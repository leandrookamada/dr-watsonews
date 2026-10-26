// Gera jornal/index.html a partir das notas do cofre Obsidian (<cofre>/noticias, <cofre>/edicoes e <cofre>/dossies).
// Uso: node scripts/jornal.mjs   |   node scripts/jornal.mjs --check (só valida o parser)
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const caminho = (...p) => join(RAIZ, ...p);
// Caminho do cofre: campo "cofre" de config.local.json (fora do git); sem ele, cofre/ dentro do projeto.
const CONFIG = join(RAIZ, 'config.local.json');
const COFRE = existsSync(CONFIG) ? JSON.parse(readFileSync(CONFIG, 'utf8')).cofre : join(RAIZ, 'cofre');

// Frontmatter só no subconjunto que o pipeline escreve: `chave: valor` e listas `[a, b]`.
export function parseNota(texto) {
  const raw = texto.replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = {};
  if (m) {
    for (const linha of m[1].split('\n')) {
      const i = linha.indexOf(':');
      if (i < 0) continue;
      const chave = linha.slice(0, i).trim();
      let v = linha.slice(i + 1).trim();
      if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
      else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
      else if (v === 'true' || v === 'false') v = v === 'true';
      else v = v.replace(/^(["'])(.*)\1$/, '$2');
      meta[chave] = v;
    }
  }
  return { meta, corpo: m ? raw.slice(m[0].length) : raw };
}

function lerPasta(pasta) {
  const dir = join(COFRE, pasta);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ id: basename(f, '.md'), ...parseNota(readFileSync(join(dir, f), 'utf8')) }));
}

if (process.argv.includes('--check')) {
  const { meta, corpo } = parseNota('---\r\ntitulo: "A: b"\r\nconfianca: 71\r\ncontestado: false\r\ntags: [tech, ia]\r\n---\r\ntexto');
  assert.ok(meta.titulo === 'A: b');
  assert.ok(meta.confianca === 71);
  assert.ok(meta.contestado === false);
  assert.ok(meta.tags.join() === 'tech,ia');
  assert.ok(corpo === 'texto');
  console.log('parser ok');
  process.exit(0);
}

const dados = {
  gerado: new Date().toISOString(),
  noticias: lerPasta('noticias'),
  edicoes: lerPasta('edicoes'),
  dossies: lerPasta('dossies'),
};
// `<` escapado para o JSON não fechar a tag <script> se alguma nota tiver "</script>".
const json = JSON.stringify(dados).replace(/</g, '\\u003c');
const html = readFileSync(caminho('jornal', 'template.html'), 'utf8').replace('__DADOS__', () => json);
writeFileSync(caminho('jornal', 'index.html'), html);
console.log(`jornal/index.html: ${dados.noticias.length} notícias, ${dados.edicoes.length} edições, ${dados.dossies.length} dossiês`);
