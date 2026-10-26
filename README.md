# Dr. Watsonews 🕵️‍♂️📰

> "Elementar, meu caro... espera, isso aqui é release de marketing."

Briefing diário com checagem de fatos, por área: **tech** (Ciência da Computação e Cybersecurity) e **politica** (Brasil e internacional), rodando só no **Claude Code** (plano Pro). Sem API keys, sem servidor, sem banco.

Inspirado no [frank_investigator](https://github.com/akitaonrails/frank_investigator) do Akita. O pipeline é o mesmo: extrair alegações, seguir citações até a fonte primária, classificar a autoridade das fontes, juntar veículos do mesmo grupo editorial numa voz só, caçar falácias e manipulação, e decidir por consenso. A diferença: em vez de vários LLMs via OpenRouter, o consenso é entre subagentes Claude com papéis e modelos diferentes.

| Personagem | Modelo | Papel |
|---|---|---|
| Lestrade | Haiku | Lê os feeds, filtra, agrupa e remove repetidas |
| Watson | Sonnet | Vai atrás da fonte primária e corroboração independente |
| Mycroft | modelo da sessão | Cético: hype, falácias, estatística torta, marketing disfarçado |

Watson e Mycroft julgam a mesma história **sem ver o parecer um do outro**. Se discordam, vale o veredito mais pessimista e a história é marcada como `contestado`.

## Uso

Na pasta do projeto:

```bash
claude
```

Depois, dentro do Claude Code: `/elementar tech` ou `/elementar politica 8` (o número limita as histórias; padrão 12).

Sem interação (para agendar):

```bash
claude -p "/elementar politica"
```

O resultado vai para o cofre Obsidian em `cofre/` (uma nota por notícia, com tags, e uma nota de edição por dia), e o jornal `jornal/index.html` é regerado no fim. Abra `cofre/` como vault no Obsidian e `jornal/index.html` no navegador.

Para regerar o jornal à mão (por exemplo, depois de editar uma nota no Obsidian):

```bash
node scripts/jornal.mjs
```

Nova área: crie `areas/<nome>.md` no mesmo formato (escopo, seções, checagens extras, fontes).

## Estrutura

```
CLAUDE.md                     regras do projeto
areas/                        uma área por arquivo: escopo, checagens extras, feeds + nível
.claude/commands/elementar.md o pipeline
.claude/agents/               Lestrade, Watson, Mycroft
.claude/settings.json         permissões: web + escrita em cofre/ + gerar o jornal
cofre/noticias/               vault Obsidian: uma nota por notícia (frontmatter + tags)
cofre/edicoes/                vault Obsidian: uma nota por dia e área, com destaques
scripts/jornal.mjs            gera o jornal a partir do cofre (Node, sem dependências)
jornal/template.html          visual do jornal; jornal/index.html é gerado
```

## Limites conhecidos

- Cada execução gasta cota do plano Pro. Uma rodada de 12 histórias usa ~9 subagentes. Reduza com `/elementar tech 6` se bater no limite.
- Alguns sites bloqueiam acesso automatizado (marcados `bloqueia-bot` nos arquivos de área). Nesses casos o Lestrade usa WebSearch.
- Checagem por LLM reduz o bullshit, mas não zera. As evidências com link existem para você conferir o que importa.
