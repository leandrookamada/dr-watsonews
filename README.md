# Dr. Watsonews 🕵️

> "Elementar, meu caro... espera, isso aqui é release de marketing."

Dr. Watsonews é um briefing diário de notícias com checagem de fatos, que roda inteiro dentro do [Claude Code](https://claude.com/claude-code) com uma assinatura Claude Pro: sem API keys, sem servidor, sem banco de dados. A premissa é a de que quem faz o trabalho pesado são os coadjuvantes de Sherlock: **Lestrade** separa o joio, **Watson** vai atrás das fontes primárias e **Mycroft**, o irmão cético, procura o que está errado.

O resultado são notas em um cofre [Obsidian](https://obsidian.md) (uma por notícia, com veredito, evidências e red flags) e uma página de jornal em HTML para ler no navegador.

**As notícias publicadas ficam em outro repositório: [O Giro do Watson](https://github.com/leandrookamada/giro-do-watson).** Este aqui guarda só o código e o método.

## Inspiração e créditos

A ideia vem do [frank_investigator](https://github.com/akitaonrails/frank_investigator), de akitaonrails: extrair alegações, seguir citações até a fonte primária, classificar a autoridade das fontes, tratar veículos do mesmo grupo editorial como uma voz só, caçar manipulação e decidir por consenso.

**Nenhum código do Frank foi copiado.** Este projeto reimplementa a ideia do zero com subagentes do Claude Code, e o "consenso multi-modelo" vira consenso entre subagentes com papéis diferentes.

## Como funciona

```
scripts/coletar.mjs          baixa os feeds da área (sem LLM, sem gastar tokens)
        |
        v
Lestrade (Haiku)             tria, agrupa, remove repetidas, marca risco: baixo | alto
        |
        +--> Watson (Sonnet)    fonte primária + corroboração independente
        +--> Mycroft (Sonnet)   cético: hype, falácia, estatística torta
             (cada um julga sem ver o parecer do outro)
        |
        v
Consenso (sessão principal)  aplica as regras e define veredito + confiança
        |
        v
<cofre>                      vault Obsidian: notícias + nota de edição do dia
        |
        v
scripts/jornal.mjs  -->  jornal/index.html
```

1. **Coleta.** O script baixa os feeds listados em `areas/<área>.md`, filtra pela janela de tempo e descarta links que já estão no cofre.
2. **Triagem.** Lestrade filtra pelo escopo da área, agrupa a mesma história entre veículos e marca o risco.
3. **Verificação.** Watson e Mycroft recebem só título, alegações e URLs, e julgam de forma independente.
4. **Consenso.** Se os dois discordam por um nível, vale o pior; por dois ou mais, vale o pior e a história fica `contestado`. Fontes só de nível baixo, ou todas do mesmo grupo editorial, rebaixam o veredito.
5. **Cofre e jornal.** Cada história aprovada vira uma nota; `BULLSHIT` e `NÃO VERIFICÁVEL` vão só para a tabela "Descartado" da edição. No fim, o jornal é regerado.

### Escala de veredito

Do melhor para o pior: `CONFIRMADO` > `PROVÁVEL` > `EXAGERADO` > `NÃO VERIFICÁVEL` > `BULLSHIT`.

O veredito julga os **fatos**. Manchete exagerada sobre fato verdadeiro não derruba o veredito: vira red flag, e o título é reescrito. Se a fonte primária de uma alegação central não pôde ser lida (paywall, 403), o teto é `PROVÁVEL`. Sem evidência, o veredito é `NÃO VERIFICÁVEL`, nunca um palpite.

### Caminho rápido para economizar cota

Histórias de **risco baixo** (fonte primária, 2+ grupos independentes, sem fonte anônima, estatística ou acusação) passam só pelo Watson. Se ele não der `CONFIRMADO`, o Mycroft entra em seguida. Histórias de risco alto vão sempre para os dois. A nota registra `checagem: simples` ou `dupla`.

## Áreas

| Área | Escopo | Seções |
|---|---|---|
| `tech` | Ciência da Computação e Cybersecurity | Cybersecurity, Ciência da Computação |
| `politica` | Política do Brasil e internacional | Brasil, Internacional |
| `ia` | IA acadêmica: modelos, arquiteturas, papers e infraestrutura | Modelos e lançamentos, Pesquisa e arquiteturas, Ferramentas e infraestrutura |

A área `tech` também coleta do GitHub: advisories revisados do GitHub Advisory Database (critical e high), releases de segurança de projetos-chave (Node.js, OpenSSL, curl, Kubernetes), o GitHub Security Lab e repositórios novos de PoC de CVE (tratados só como sinal, nunca como prova de exploração).

A área `ia` coleta blogs de laboratórios (OpenAI, Google DeepMind, Microsoft Research, Qwen e outros), a curadoria diária de papers do Hugging Face (ordenada por votos), os modelos em alta no Hugging Face, releases de vLLM e Transformers e newsletters técnicas. As checagens extras tratam benchmark autodeclarado, "open source" × pesos abertos, preprint sem revisão e demonstração × disponibilidade real.

A área `politica` tem checagens extras: etapa institucional (comissão × plenário, liminar × plenário, denúncia × condenação), números oficiais, pesquisas eleitorais, fontes anônimas e comparação de enquadramento entre veículos de perfis diferentes.

**Para criar uma área nova**, adicione `areas/<nome>.md` com as mesmas seções dos arquivos existentes: Escopo, Seções do briefing, Tags de assunto, Checagens extras e Fontes (tabelas com feed e nível de autoridade). Depois é só rodar `/elementar <nome>`.

## Requisitos

- [Claude Code](https://claude.com/claude-code) com uma assinatura Claude (o plano Pro basta).
- Node.js 22 ou superior. Os scripts usam só a biblioteca padrão, sem `npm install`.
- Opcional: [Obsidian](https://obsidian.md), para navegar pelo cofre.
- Opcional: variável `GITHUB_TOKEN` com um token **só de leitura**, para a coleta usar a API do GitHub com limite maior (sem ela, funciona com o limite público de 60 requisições/hora).

## Uso

Dentro da pasta do projeto, abra o Claude Code e rode o comando:

```bash
claude
```

```text
/elementar tech
/elementar politica 6
```

O número opcional limita as histórias verificadas (padrão: 12). Sem interação, útil para agendar:

```bash
claude -p "/elementar politica"
```

Para regerar a página sem rodar o pipeline (por exemplo, depois de editar uma nota no Obsidian):

```bash
node scripts/jornal.mjs
```

Autotestes dos scripts:

```bash
node scripts/coletar.mjs --check
node scripts/jornal.mjs --check
```

Para ler o resultado, abra a pasta do cofre como vault no Obsidian e o arquivo `jornal/index.html` no navegador. A página é um arquivo único, com busca, navegação por área, tags e arquivo de edições, e tema claro/escuro.

### Onde fica o cofre

Por padrão, o cofre é a pasta `cofre/` dentro do projeto (fora do Git). Para gravar direto num vault seu do Obsidian, crie `config.local.json` na raiz:

```json
{ "cofre": "C:\\caminho\\para\\seu\\vault" }
```

Com o cofre fora do projeto, libere a escrita nele para o Claude Code em `.claude/settings.local.json` (também fora do Git). No Windows, `C:\Users\...` vira `//c/Users/...`:

```json
{
  "permissions": {
    "allow": ["Edit(//c/caminho/para/seu/vault/**)"],
    "additionalDirectories": ["C:/caminho/para/seu/vault"]
  }
}
```

### Dossiês

Além do briefing diário, dá para pedir ao Claude Code uma pesquisa direcionada sobre um tema (por exemplo, uma CVE). Ela segue o mesmo método: frentes de Watson em paralelo para fontes primárias, exploração e ecossistema, e depois o Mycroft revisa as alegações consolidadas. O resultado vai para `<cofre>/dossies/AAAA-MM-DD-<tema>.md` e aparece na aba Dossiês do jornal.

### Formato das notas

Cada notícia em `<cofre>/noticias/AAAA-MM-DD-<slug>.md` tem frontmatter (`titulo`, `data`, `area`, `secao`, `veredito`, `confianca`, `contestado`, `checagem`, `tags`), um resumo só com o que foi verificado, "Por que importa", links de evidência e red flags. A nota de edição do dia, em `<cofre>/edicoes/`, traz os destaques, a lista por seção e a tabela de descartados.

## Estrutura

```
CLAUDE.md                      regras do projeto
areas/                         uma área por arquivo: escopo, checagens extras, feeds e nível
.claude/commands/elementar.md  o pipeline (comando /elementar)
.claude/agents/                Lestrade, Watson, Mycroft
.claude/settings.json          permissões do projeto
scripts/coletar.mjs            coleta dos feeds (Node, sem dependências)
scripts/jornal.mjs             gera o jornal a partir do cofre (Node, sem dependências)
jornal/template.html           visual do jornal (jornal/index.html é gerado)
config.local.json              caminho do cofre na sua máquina (fora do Git)
```

`coleta/` (saída intermediária da coleta) e `jornal/index.html` são gerados e ficam fora do Git.

## Limitações e honestidade

- Checagem por LLM **reduz** erros, mas não os elimina. Os links de evidência existem para você conferir o que importa para você.
- Alguns sites bloqueiam acesso automatizado ou não têm RSS; nesses casos a cobertura depende de busca web e pode ser menor. As falhas de cada coleta ficam registradas na nota de edição.
- Cada execução consome cota do plano Pro. Se atingir o limite, reduza o número de histórias (`/elementar tech 6`).
- Na política, o rigor é simétrico: o veredito julga fatos (quem votou, o que a decisão diz, o que o dado mostra), nunca se uma posição é boa ou ruim. Disputas de interpretação aparecem com atribuição ("segundo o governo...", "a oposição afirma...").
- Fontes e níveis de autoridade são escolhas editoriais registradas em `areas/`. Discorde delas e ajuste.

## Segurança

Todo conteúdo buscado na web (artigos, feeds, comentários) é tratado como **dado, não instrução**. Páginas que tentam dar ordens aos agentes são ignoradas e registradas como red flag da fonte.

As permissões em `.claude/settings.json` são restritas a leitura da web, leitura de arquivos, escrita no cofre e execução dos dois scripts do projeto. Os agentes consultam o GitHub só pela API pública, via WebFetch e sem credenciais: nada do pipeline pode escrever na sua conta. Repositórios de PoC são lidos (README e descrição), nunca executados.

Durante uma execução, o pipeline só escreve dentro do cofre (e, pelos scripts, em `coleta/` e `jornal/`).

## Licença

Ainda não definida: a pessoa responsável pelo projeto vai escolher uma.
