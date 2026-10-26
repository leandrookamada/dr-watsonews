// Coleta os feeds de uma área sem gastar LLM: baixa, filtra pela janela de tempo, remove links que já
// estão no cofre e grava uma lista compacta em coleta/<área>.md para o Lestrade só triar.
// Uso: node scripts/coletar.mjs <área> [horas=36]   |   node scripts/coletar.mjs --check
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
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

// RSS 2.0, Atom e o JSON do catálogo KEV da CISA.
export function parseFeed(corpo) {
  if (corpo.trimStart().startsWith('{')) {
    const d = JSON.parse(corpo);
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
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const bytes = await r.arrayBuffer();
  // Alguns feeds brasileiros ainda vêm em ISO-8859-1.
  const cabeca = new TextDecoder('latin1').decode(bytes.slice(0, 200));
  const charset = (r.headers.get('content-type') || '').match(/charset=([\w-]+)/i)?.[1]
    || cabeca.match(/encoding=["']([\w-]+)/i)?.[1] || 'utf-8';
  try { return new TextDecoder(charset).decode(bytes); } catch { return new TextDecoder('utf-8').decode(bytes); }
}

function linksNoCofre(dias) {
  const dir = join(RAIZ, 'cofre', 'noticias');
  if (!existsSync(dir)) return new Set();
  const corte = new Date(Date.now() - dias * 864e5).toISOString().slice(0, 10);
  return new Set(readdirSync(dir)
    .filter(f => f.endsWith('.md') && f.slice(0, 10) >= corte)
    .flatMap(f => readFileSync(join(dir, f), 'utf8').match(/https?:\/\/[^\s)\]>]+/g) || []));
}

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
  const f = fontesDaArea('| Fonte | Feed |\n|---|---|\n| G1 | https://g1/rss | secundária | Globo |\n| STF | sem feed |');
  assert.deepEqual(f, [{ nome: 'G1', url: 'https://g1/rss', meta: 'secundária · Globo' }]);
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

const fontes = fontesDaArea(readFileSync(arqArea, 'utf8'));
const corte = Date.now() - horas * 36e5;
const jaVistos = linksNoCofre(7);
let removidos = 0;

const resultados = await Promise.all(fontes.map(async f => {
  try {
    const itens = parseFeed(await baixar(f.url));
    if (!itens.length) return { ...f, falha: 'sem itens (página sem RSS?)' };
    const novos = itens.filter(i => i.data && !isNaN(i.data) && i.data >= corte && i.link);
    if (!novos.length && itens.every(i => !i.data || isNaN(i.data))) return { ...f, falha: 'itens sem data' };
    const filtrados = novos.filter(i => !jaVistos.has(i.link));
    removidos += novos.length - filtrados.length;
    return { ...f, itens: filtrados.sort((a, b) => b.data - a.data).slice(0, MAX_ITENS) };
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
