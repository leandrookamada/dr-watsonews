// Coleta os feeds de uma área sem gastar LLM: baixa, filtra pela janela de tempo, remove links que já
// estão no cofre e grava uma lista compacta em coleta/<área>.md para o Lestrade só triar.
// Uso: node scripts/coletar.mjs <área> [horas=36]   |   node scripts/coletar.mjs --check
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
// Caminho do cofre: campo "cofre" de config.local.json (fora do git); sem ele, cofre/ dentro do projeto.
const CONFIG = join(RAIZ, 'config.local.json');
const COFRE = existsSync(CONFIG) ? JSON.parse(readFileSync(CONFIG, 'utf8')).cofre : join(RAIZ, 'cofre');
const MAX_ITENS = 15;   // por fonte, os mais recentes
const RESUMO = 160;     // caracteres
const TIMEOUT = 20000;  // ms por feed
const UA = 'Mozilla/5.0 (compatible; DrWatsonews RSS reader)';

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const semTags = s => s.replace(/<[^>]*>/g, ' ');
function texto(s = '') {
  s = semTags(s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'));
  s = s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] !== '#' ? ENTIDADES[e.toLowerCase()] ?? m
      : String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))));
  return semTags(s).replace(/\s+/g, ' ').trim();
}

function campo(bloco, ...nomes) {
  for (const n of nomes) {
    const m = bloco.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'i'));
    if (m) return m[1];
  }
  return '';
}

// RSS 2.0, Atom, o JSON do catálogo KEV da CISA e as APIs do GitHub (advisories e busca de repositórios).
export function parseFeed(corpo) {
  if (/^[[{]/.test(corpo.trimStart())) {
    const d = JSON.parse(corpo);
    // Hugging Face: papers do dia (curadoria com votos) e modelos em alta. `peso` ordena antes da data.
    if (Array.isArray(d) && d[0]?.paper) return d.map(({ paper: p }) => ({
      titulo: `[▲${p.upvotes ?? 0}] ${p.title}`,
      link: `https://huggingface.co/papers/${p.id}`,
      data: new Date(p.submittedOnDailyAt || p.publishedAt),
      resumo: p.ai_summary || p.summary || '',
      peso: p.upvotes ?? 0,
    }));
    if (Array.isArray(d) && d[0]?.modelId) return d.map(m => ({
      titulo: `${m.id}${m.pipeline_tag ? ` [${m.pipeline_tag}]` : ''} (♥${m.likes ?? 0})`,
      link: `https://huggingface.co/${m.id}`,
      data: new Date(m.createdAt),
      resumo: `${m.downloads ?? 0} downloads`,
      peso: m.trendingScore ?? 0,
    }));
    if (Array.isArray(d)) return d.map(a => ({
      titulo: `${a.ghsa_id}${a.cve_id ? ` / ${a.cve_id}` : ''} [${a.severity}] ${a.summary}`,
      link: a.html_url,
      data: new Date(a.published_at),
      resumo: (a.vulnerabilities || []).map(v => `${v.package?.ecosystem}:${v.package?.name}`).join(', '),
    }));
    if (d.items) return d.items.map(r => ({
      titulo: `${r.full_name} (★${r.stargazers_count})`,
      link: r.html_url,
      data: new Date(r.created_at),
      resumo: r.description || '',
    }));
    return (d.vulnerabilities || []).map(v => ({
      titulo: `${v.cveID}: ${v.vulnerabilityName}`,
      link: `https://www.cve.org/CVERecord?id=${v.cveID}`,
      data: new Date(`${v.dateAdded}T23:59:59Z`),
      resumo: v.shortDescription || '',
    }));
  }
  const blocos = corpo.match(/<item[\s>][\s\S]*?<\/item>/gi) || corpo.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocos.map(b => {
    const href = b.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)/i) || b.match(/<link[^>]*href=["']([^"']+)/i);
    const data = texto(campo(b, 'pubDate', 'published', 'updated', 'dc:date'));
    return {
      titulo: texto(campo(b, 'title')),
      link: texto(campo(b, 'link')) || (href ? texto(href[1]) : '') || texto(campo(b, 'guid', 'id')),
      data: data ? new Date(data) : null,
      resumo: texto(campo(b, 'description', 'summary', 'content')),
    };
  });
}

// Toda linha de tabela cuja 2ª coluna é uma URL vira fonte; o resto da linha é metadado (nível, perfil, obs.).
export function fontesDaArea(md) {
  return md.split(/\r?\n/).flatMap(linha => {
    const c = linha.split('|').slice(1, -1).map(s => s.trim());
    return c.length >= 2 && /^https?:\/\//.test(c[1]) ? [{ nome: c[0], url: c[1], meta: c.slice(2).filter(Boolean).join(' · ') }] : [];
  });
}

async function baixar(url) {
  const headers = { 'User-Agent': UA, Accept: '*/*' };
  if (url.startsWith('https://api.github.com/')) {
    headers.Accept = 'application/vnd.github+json';
    // Opcional: um token só de leitura sobe o limite de 60 para 5000 req/h. Sem ele, funciona igual.
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const bytes = await r.arrayBuffer();
  // Alguns feeds brasileiros ainda vêm em ISO-8859-1.
  const cabeca = new TextDecoder('latin1').decode(bytes.slice(0, 200));
  const charset = (r.headers.get('content-type') || '').match(/charset=([\w-]+)/i)?.[1]
    || cabeca.match(/encoding=["']([\w-]+)/i)?.[1] || 'utf-8';
  try { return new TextDecoder(charset).decode(bytes); } catch { return new TextDecoder('utf-8').decode(bytes); }
}

// Notícias e edições: área em modo radar só grava edição, e os links dela também contam como já vistos.
function linksNoCofre(dias) {
  const corte = new Date(Date.now() - dias * 864e5).toISOString().slice(0, 10);
  return new Set(['noticias', 'edicoes'].map(p => join(COFRE, p)).filter(existsSync).flatMap(dir => readdirSync(dir)
    .filter(f => f.endsWith('.md') && f.slice(0, 10) >= corte)
    .flatMap(f => readFileSync(join(dir, f), 'utf8').match(/https?:\/\/[^\s)\]>]+/g) || [])));
}

// "Execução: só nuvem" no arquivo da área: a coleta só roda com WATSON_NUVEM=1 (variável do ambiente em nuvem),
// para que os acessos dessa área nunca saiam da máquina local.
export const soNuvem = (md, env) => /^Execução:\s*só nuvem/mi.test(md) && !env.WATSON_NUVEM;

const fmtData = d => d.toISOString().slice(0, 16).replace('T', ' ');

if (process.argv.includes('--check')) {
  const rss = parseFeed(`<rss><channel><item><title><![CDATA[A &amp; B]]></title><link>https://x/1</link>
    <pubDate>Mon, 26 Oct 2026 10:00:00 GMT</pubDate><description>&lt;p&gt;oi &#233;&lt;/p&gt;</description></item></channel></rss>`);
  assert.equal(rss[0].titulo, 'A & B');
  assert.equal(rss[0].link, 'https://x/1');
  assert.equal(rss[0].resumo, 'oi é');
  assert.equal(rss[0].data.toISOString(), '2026-10-26T10:00:00.000Z');
  const atom = parseFeed(`<feed><entry><title>T</title><link rel="alternate" href="https://y/2"/><updated>2026-10-26T09:00:00Z</updated><summary>s</summary></entry></feed>`);
  assert.equal(atom[0].link, 'https://y/2');
  const kev = parseFeed('{"vulnerabilities":[{"cveID":"CVE-1","vulnerabilityName":"n","dateAdded":"2026-10-23"}]}');
  assert.equal(kev[0].link, 'https://www.cve.org/CVERecord?id=CVE-1');
  const ghsa = parseFeed('[{"ghsa_id":"GHSA-1","cve_id":"CVE-2","severity":"critical","summary":"s","html_url":"https://g/1","published_at":"2026-10-26T01:00:00Z","vulnerabilities":[{"package":{"ecosystem":"npm","name":"x"}}]}]');
  assert.equal(ghsa[0].titulo, 'GHSA-1 / CVE-2 [critical] s');
  assert.equal(ghsa[0].resumo, 'npm:x');
  const repos = parseFeed('{"total_count":1,"items":[{"full_name":"a/CVE-1-poc","stargazers_count":3,"html_url":"https://g/2","created_at":"2026-10-26T02:00:00Z","description":null}]}');
  assert.equal(repos[0].titulo, 'a/CVE-1-poc (★3)');
  assert.deepEqual(parseFeed('[]'), []);
  const papers = parseFeed('[{"paper":{"id":"2610.1","title":"P","upvotes":42,"submittedOnDailyAt":"2026-10-26T08:00:00Z","summary":"s"}}]');
  assert.equal(papers[0].titulo, '[▲42] P');
  assert.equal(papers[0].link, 'https://huggingface.co/papers/2610.1');
  assert.equal(papers[0].peso, 42);
  const modelos = parseFeed('[{"modelId":"a/b","id":"a/b","pipeline_tag":"text-generation","likes":5,"trendingScore":9,"createdAt":"2026-10-24T00:00:00Z","downloads":10}]');
  assert.equal(modelos[0].titulo, 'a/b [text-generation] (♥5)');
  assert.equal(modelos[0].peso, 9);
  const f = fontesDaArea('| Fonte | Feed |\n|---|---|\n| G1 | https://g1/rss | secundária | Globo |\n| STF | sem feed |');
  assert.deepEqual(f, [{ nome: 'G1', url: 'https://g1/rss', meta: 'secundária · Globo' }]);
  assert.equal(soNuvem('# Área\n\nModo: radar\nExecução: só nuvem\n', {}), true);
  assert.equal(soNuvem('Execução: só nuvem', { WATSON_NUVEM: '1' }), false);
  assert.equal(soNuvem('# Área: tech', {}), false);
  console.log('coleta ok');
  process.exit(0);
}

const area = process.argv[2];
const horas = Number(process.argv[3] || 36);
const arqArea = join(RAIZ, 'areas', `${area}.md`);
if (!area || !existsSync(arqArea)) {
  console.error(`Área inválida. Disponíveis: ${readdirSync(join(RAIZ, 'areas')).map(f => f.replace('.md', '')).join(', ')}`);
  process.exit(1);
}

const md = readFileSync(arqArea, 'utf8');
if (soNuvem(md, process.env)) {
  console.error(`A área ${area} roda só em nuvem (defina WATSON_NUVEM=1 no ambiente em nuvem). Nada foi baixado.`);
  process.exit(3);
}
const fontes = fontesDaArea(md);
const corte = Date.now() - horas * 36e5;
const jaVistos = linksNoCofre(7);
let removidos = 0;

// `{desde}` na URL (busca do GitHub) vira a data de início da janela.
const desde = new Date(corte).toISOString().slice(0, 10);

const resultados = await Promise.all(fontes.map(async f => {
  try {
    const url = f.url.replaceAll('{desde}', desde);
    const itens = parseFeed(await baixar(url));
    // API do GitHub sem resultado é dia sem novidade, não falha.
    if (!itens.length) return url.startsWith('https://api.github.com/') ? { ...f, itens: [] } : { ...f, falha: 'sem itens (página sem RSS?)' };
    // "janela Nd" na linha da fonte amplia a janela só para ela (ex.: modelos em alta criados na semana).
    const dias = Number(f.meta.match(/janela (\d+)d/)?.[1]);
    const corteFonte = dias ? Date.now() - dias * 864e5 : corte;
    const novos = itens.filter(i => i.data && !isNaN(i.data) && i.data >= corteFonte && i.link);
    if (!novos.length && itens.every(i => !i.data || isNaN(i.data))) return { ...f, falha: 'itens sem data' };
    const filtrados = novos.filter(i => !jaVistos.has(i.link));
    removidos += novos.length - filtrados.length;
    // "max N" na linha da fonte troca o limite de itens (ex.: rastreadores de leak site, contados no radar).
    const max = Number(f.meta.match(/max (\d+)/)?.[1]) || MAX_ITENS;
    return { ...f, itens: filtrados.sort((a, b) => (b.peso ?? 0) - (a.peso ?? 0) || b.data - a.data).slice(0, max) };
  } catch (e) {
    return { ...f, falha: e.name === 'TimeoutError' ? 'timeout' : e.message };
  }
}));

const ok = resultados.filter(r => r.itens);
const falhas = resultados.filter(r => r.falha);
const total = ok.reduce((s, r) => s + r.itens.length, 0);
const saida = [
  `# Coleta ${area} · ${fmtData(new Date())} UTC · janela ${horas}h`,
  `${total} itens de ${ok.length} fontes. ${removidos} removidos por já estarem no cofre.`,
  '',
  `## Falhas (use WebSearch site:<domínio>)`,
  ...(falhas.length ? falhas.map(r => `- ${r.nome} — ${r.url} — ${r.falha}`) : ['- nenhuma']),
  ...ok.filter(r => r.itens.length).flatMap(r => [
    '', `## ${r.nome}${r.meta ? ` (${r.meta})` : ''}`,
    ...r.itens.map(i => `- [${fmtData(i.data)}] ${i.titulo} — ${i.link}` +
      (i.resumo ? `\n  ${i.resumo.length > RESUMO ? i.resumo.slice(0, RESUMO - 1) + '…' : i.resumo}` : '')),
  ]),
].join('\n') + '\n';

mkdirSync(join(RAIZ, 'coleta'), { recursive: true });
writeFileSync(join(RAIZ, 'coleta', `${area}.md`), saida);
console.log(`coleta/${area}.md: ${total} itens, ${ok.length} fontes ok, ${falhas.length} falhas, ${removidos} já no cofre`);
