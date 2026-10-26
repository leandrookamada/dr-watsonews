---
description: Gera o briefing diário de uma área (tech, politica), com checagem de fatos
argument-hint: "[área: tech|politica, padrão tech] [máx. de histórias, padrão 12]"
---

Gere o briefing de hoje.

- Área: `$0` (se vazio, `tech`). O arquivo da área é `areas/<área>.md`; se não existir, pare e liste as áreas disponíveis em `areas/`.
- Limite de histórias verificadas: `$1` (se vazio, 12).

Leia `CLAUDE.md` e o arquivo da área antes de começar. O **cofre** é a pasta do campo `cofre` em `config.local.json`; se esse arquivo não existir, é `cofre/` no projeto. Abaixo, `<cofre>` é esse caminho. Siga as etapas na ordem.

## 1. Coleta e triagem — script + Lestrade

1. Rode `node scripts/coletar.mjs <área>`. Ele baixa os feeds da área sem gastar tokens e grava `coleta/<área>.md`. Não leia esse arquivo na sessão principal: ele é para o Lestrade.
2. Chame o subagente **lestrade** passando: a data de hoje, o caminho do arquivo da área, o caminho `coleta/<área>.md`, os títulos (campo `titulo`) das notas de `<cofre>/noticias/` da área nos últimos 7 dias e o limite de histórias.

Ele devolve a lista de histórias candidatas, já agrupadas, sem repetição e com `risco: baixo | alto`.

## 2. Verificação — dupla para risco alto, simples para casos claros

Passe a Watson e Mycroft só título, alegações e URLs, mais a seção "Checagens extras" do arquivo da área. Não passe o risco, o parecer de um para o outro, nem comentários do Lestrade: os dois julgam de forma independente (é o "consenso multi-modelo" do Frank).

Se o Lestrade não marcou `risco` numa história, trate como `alto`.

1. **Risco alto:** para cada lote de até 3 histórias, dispare **na mesma mensagem** um **watson** e um **mycroft** com as mesmas histórias.
2. **Risco baixo:** dispare só um **watson** por lote de até 3, na mesma mensagem dos lotes de risco alto.
3. Toda história de risco baixo em que o Watson **não** deu `CONFIRMADO` vai para um **mycroft** em seguida (lotes de até 3). Assim só fica com checagem simples o que é primário, corroborado e confirmado.

## 3. Consenso (você)

Escala de veredito, do melhor para o pior:
`CONFIRMADO` > `PROVÁVEL` > `EXAGERADO` > `NÃO VERIFICÁVEL` > `BULLSHIT`

O veredito julga os **fatos** da história. Manchete exagerada sobre fato verdadeiro não derruba o veredito: vira red flag e o título é reescrito no briefing.

Para cada história:

1. Se Watson e Mycroft concordam, esse é o veredito.
2. Se diferem em 1 nível, fique com o **pior** dos dois.
3. Se diferem em 2+ níveis, use o pior e marque `contestado` com o motivo da divergência.
4. Rebaixe um nível se: só há fontes de nível baixa; ou todas as fontes são do mesmo grupo de independência (exceto quando a própria fonte primária é o fato, como um paper, experimento ou documento oficial lido diretamente).
   Se a fonte primária de uma alegação central não foi lida (403, paywall, post apagado), o teto é `PROVÁVEL`. Não rebaixe além disso: ausência de fonte primária não torna o fato `EXAGERADO`.
5. Nota de confiança 0–100 = média das confianças dos dois, menos 15 se `contestado`.
6. Checagem simples (só Watson, `CONFIRMADO`): veredito e confiança do Watson, com `checagem: simples` na nota.

## 4. Gravar no cofre Obsidian

O cofre é `<cofre>`, um vault do Obsidian. Escreva em português.

**Uma nota por história verificada** (exceto `BULLSHIT` e `NÃO VERIFICÁVEL`) em `<cofre>/noticias/AAAA-MM-DD-<slug>.md`, `<slug>` curto, minúsculo, sem acento, com hífens:

```markdown
---
titulo: "<título reescrito, neutro, sem clickbait; sem aspas duplas dentro>"
data: AAAA-MM-DD
area: <área>
secao: <uma das seções do arquivo da área>
veredito: PROVÁVEL
confianca: 72
contestado: false
checagem: dupla
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

**Uma nota de edição** por dia e área em `<cofre>/edicoes/AAAA-MM-DD-<área>.md`:

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
