# Dr. Watsonews 🕵️‍♂️📰

> "Elementar, meu caro... espera, isso aqui é release de marketing."

Briefing diário de **Ciência da Computação e Cybersecurity** com checagem de fatos, rodando só no **Claude Code** (plano Pro). Sem API keys, sem servidor, sem banco.

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

Depois, dentro do Claude Code: `/elementar` (ou `/elementar 8` para limitar a 8 histórias).

Sem interação (para agendar):

```bash
claude -p "/elementar"
```

O resultado fica em `briefings/AAAA-MM-DD.md`.

## Estrutura

```
CLAUDE.md                     regras do projeto
fontes.md                     feeds + nível de autoridade (edite para adicionar fontes)
.claude/commands/elementar.md o pipeline
.claude/agents/               Lestrade, Watson, Mycroft
.claude/settings.json         permissões: só web + escrita em briefings/
briefings/                    saída diária (também serve de histórico)
```

## Limites conhecidos

- Cada execução gasta cota do plano Pro. Uma rodada de 12 histórias usa ~9 subagentes. Reduza com `/elementar 6` se bater no limite.
- Alguns sites bloqueiam acesso automatizado (marcados `bloqueia-bot` em `fontes.md`). Nesses casos o Lestrade usa WebSearch.
- Checagem por LLM reduz o bullshit, mas não zera. As evidências com link existem para você conferir o que importa.
