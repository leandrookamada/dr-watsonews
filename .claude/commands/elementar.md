---
description: Gera o briefing diário de uma área (tech, politica), com checagem de fatos
argument-hint: "[área: tech|politica, padrão tech] [máx. de histórias, padrão 12]"
---

Gere o briefing de hoje.

- Área: `$1` (se vazio, `tech`). O arquivo da área é `areas/<área>.md`; se não existir, pare e liste as áreas disponíveis em `areas/`.
- Limite de histórias verificadas: `$2` (se vazio, 12).

Leia `CLAUDE.md` e o arquivo da área antes de começar. Siga as etapas na ordem.

## 1. Coleta e triagem — Lestrade

Chame o subagente **lestrade** passando: a data de hoje, o conteúdo do arquivo da área, os títulos (campo `titulo`) das notas de `cofre/noticias/` da área nos últimos 7 dias e o limite de histórias.
Ele devolve a lista de histórias candidatas, já agrupadas e sem repetição.

## 2. Verificação dupla — Watson e Mycroft em paralelo

Para cada lote de até 3 histórias, dispare **na mesma mensagem**:

- um **watson** com as histórias (título, alegações, URLs);
- um **mycroft** com as mesmas histórias.

Passe só título, alegações e URLs, mais a seção "Checagens extras" do arquivo da área. Não passe o parecer de um para o outro, nem comentários do Lestrade: os dois julgam de forma independente (é o "consenso multi-modelo" do Frank).

## 3. Consenso (você)

Escala de veredito, do melhor para o pior:
`CONFIRMADO` > `PROVÁVEL` > `EXAGERADO` > `NÃO VERIFICÁVEL` > `BULLSHIT`

O veredito julga os **fatos** da história. Manchete exagerada sobre fato verdadeiro não derruba o veredito: vira red flag e o título é reescrito no briefing.

Para cada história:

1. Se Watson e Mycroft concordam, esse é o veredito.
2. Se diferem em 1 nível, fique com o **pior** dos dois.
3. Se diferem em 2+ níveis, use o pior e marque `contestado` com o motivo da divergência.
4. Rebaixe um nível se: só há fontes de nível baixa; ou todas as fontes são do mesmo grupo de independência (exceto quando a própria fonte primária é o fato, como um paper, experimento ou documento oficial lido diretamente); ou a fonte primária não foi encontrada para uma alegação central.
5. Nota de confiança 0–100 = média das confianças dos dois, menos 15 se `contestado`.

## 4. Gravar no cofre Obsidian

O cofre é `cofre/` (abra essa pasta como vault no Obsidian). Escreva em português.

**Uma nota por história verificada** (exceto `BULLSHIT` e `NÃO VERIFICÁVEL`) em `cofre/noticias/AAAA-MM-DD-<slug>.md`, `<slug>` curto, minúsculo, sem acento, com hífens:

```markdown
---
titulo: "<título reescrito, neutro, sem clickbait; sem aspas duplas dentro>"
data: AAAA-MM-DD
area: <área>
secao: <uma das seções do arquivo da área>
veredito: PROVÁVEL
confianca: 72
contestado: false
tags: [<área>, <1-3 tags de assunto da lista do arquivo da área>, <até 2 tags de entidade: produto, órgão, pessoa; minúsculo, sem acento, com hífens>]
---
<resumo em 2–4 frases, só com o que foi verificado>

**Por que importa:** <1 frase: quem é afetado, o que muda>

## Evidências
- [fonte primária](url)
- [corroboração independente](url)

## Red flags
- <lista curta, ou "nenhuma">
<se contestado: "**Contestado:** <motivo da divergência>">

Edição: [[AAAA-MM-DD-<área>]]
```

**Uma nota de edição** por dia e área em `cofre/edicoes/AAAA-MM-DD-<área>.md`:

```markdown
---
data: AAAA-MM-DD
area: <área>
tags: [edicao, <área>]
---
# Edição <área> AAAA-MM-DD

> N histórias verificadas · X confirmadas · Y descartadas como bullshit

## Destaques
- 3 a 5 linhas: o que importa hoje e por quê.

## <seção da área>
- [[AAAA-MM-DD-<slug>]] · PROVÁVEL · 72

## Descartado
| Manchete original | Veredito | Motivo |
|---|---|---|

<sub>Feeds com falha: ...</sub>
```

Ordene cada seção por relevância × confiança. `BULLSHIT` e `NÃO VERIFICÁVEL` vão só para a tabela "Descartado".
Se a nota de edição de hoje já existir, acrescente `## Atualização HH:MM` só com as histórias novas.

## 5. Atualizar o jornal

Rode `node scripts/jornal.mjs`. Ele regera `jornal/index.html` a partir do cofre.

## 6. Resposta final

Responda com os Destaques e o caminho da nota de edição. Nada mais.
