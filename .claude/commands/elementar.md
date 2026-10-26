---
description: Gera o briefing diário de CS e Cybersecurity, com checagem de fatos
argument-hint: "[máx. de histórias, padrão 12]"
---

Gere o briefing de hoje. Limite de histórias verificadas: `$ARGUMENTS` (se vazio, 12).
Siga as etapas na ordem. Leia `CLAUDE.md` e `fontes.md` antes de começar.

## 1. Coleta e triagem — Lestrade

Chame o subagente **lestrade** passando: a data de hoje, o conteúdo de `fontes.md`, os nomes dos arquivos de `briefings/` dos últimos 7 dias e o limite de histórias.
Ele devolve a lista de histórias candidatas, já agrupadas e sem repetição.

## 2. Verificação dupla — Watson e Mycroft em paralelo

Para cada lote de até 3 histórias, dispare **na mesma mensagem**:

- um **watson** com as histórias (título, alegações, URLs);
- um **mycroft** com as mesmas histórias.

Passe só título, alegações e URLs. Não passe o parecer de um para o outro, nem comentários do Lestrade: os dois julgam de forma independente (é o "consenso multi-modelo" do Frank).

## 3. Consenso (você)

Escala de veredito, do melhor para o pior:
`CONFIRMADO` > `PROVÁVEL` > `EXAGERADO` > `NÃO VERIFICÁVEL` > `BULLSHIT`

O veredito julga os **fatos** da história. Manchete exagerada sobre fato verdadeiro não derruba o veredito: vira red flag e o título é reescrito no briefing.

Para cada história:

1. Se Watson e Mycroft concordam, esse é o veredito.
2. Se diferem em 1 nível, fique com o **pior** dos dois.
3. Se diferem em 2+ níveis, use o pior e marque `contestado` com o motivo da divergência.
4. Rebaixe um nível se: só há fontes de nível baixa; ou todas as fontes são do mesmo grupo de independência (exceto quando a própria fonte primária é o fato, como um paper ou experimento lido diretamente); ou a fonte primária não foi encontrada para uma alegação técnica (CVE, exploração ativa, benchmark, resultado de paper).
5. Nota de confiança 0–100 = média das confianças dos dois, menos 15 se `contestado`.

## 4. Briefing

Escreva `briefings/AAAA-MM-DD.md` (data de hoje) neste formato:

```markdown
# Briefing AAAA-MM-DD

> N histórias verificadas · X confirmadas · Y descartadas como bullshit

## Destaques
- 3 a 5 linhas: o que importa hoje e por quê.

## Cybersecurity
### <título reescrito, sem clickbait>
**Veredito:** PROVÁVEL · **Confiança:** 72 · (contestado: motivo, se houver)
<resumo em 2–4 frases, só com o que foi verificado>
**Por que importa:** <1 frase: quem é afetado, o que fazer>
**Evidências:** [fonte primária](url) · [corroboração independente](url)
**Red flags:** <lista curta, ou "nenhuma">

## Ciência da Computação
(mesmo formato)

## Descartado
| Manchete original | Veredito | Motivo |
|---|---|---|
```

Ordene cada seção por relevância × confiança. `BULLSHIT` e `NÃO VERIFICÁVEL` vão só para a tabela "Descartado".
Se já existir um briefing de hoje, acrescente uma seção `## Atualização HH:MM` só com histórias novas.

## 5. Resposta final

Responda com os Destaques e o caminho do arquivo gerado. Nada mais.
