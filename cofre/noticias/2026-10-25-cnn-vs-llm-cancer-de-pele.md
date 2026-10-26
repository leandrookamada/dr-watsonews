---
titulo: Teste de dermatologista - CNN de 2015 acerta mais diagnósticos de pele que LLMs de fronteira, mas os LLMs são mais cautelosos
data: 2026-10-25
area: tech
secao: Ciência da Computação
veredito: PROVÁVEL
confianca: 75
contestado: false
tags: [tech, ia, pesquisa, saude]
---
O Dr. Magnus Lynch (Guy's Hospital / King's College London) testou 200 lesões do MILK10k confirmadas por biópsia, 30 delas melanomas. No primeiro diagnóstico, Inception v3 acertou 125 (62,5%), GPT-6 Astra 84 e Claude Fable 5.1 85 (~42%). Na decisão de dar alta, porém, a CNN no limiar padrão liberou 18 dos 30 melanomas, contra 3 e 4 dos LLMs. É um único experimento, publicado em blog sem revisão por pares, com cada LLM rodando uma vez, e o autor declara essas limitações e publica casos, prompts e código.

**Por que importa:** "LLM generalista contra modelo especializado" em tarefa médica: acurácia e segurança clínica apontam em direções diferentes.

## Evidências
- [post original](https://lynchlab.net/llm-skin-cancer)
- [dataset MILK10k (ISIC)](https://api.isic-archive.com/doi/milk10k/)
- [discussão HN](https://news.ycombinator.com/item?id=50233779)

## Red flags
- Amostra pequena e uma única execução.
- "Supera" vale para acurácia, não para segurança: no limiar padrão a CNN deixaria passar mais melanomas.

Edição: [[2026-10-25-tech]]
