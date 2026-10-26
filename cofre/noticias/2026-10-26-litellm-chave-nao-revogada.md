---
titulo: "LiteLLM: chave mestra vazada em maio e nunca revogada levou à versão maliciosa 1.107.0 no PyPI"
data: 2026-10-26
area: tech
secao: Cybersecurity
veredito: CONFIRMADO
confianca: 89
contestado: false
checagem: dupla
tags: [tech, incidente, malware, ia, litellm]
---
Segundo o post mortem do próprio LiteLLM (23/10), em 27/05 um `opencode.json` com a chave mestra de um deployment da LiteLLM Agent Platform foi commitado no repositório público LiteLLM-Labs/lite-harness. O commit foi apagado com force-push, mas a chave nunca foi revogada. Em 10/10 o atacante usou a chave para obter o token OAuth do GitHub de um dono da organização e, depois, tokens de mantenedores. Em 21/10 publicou o `litellm==1.107.0` malicioso, um ladrão de credenciais que ficou cerca de 2 horas no PyPI (de ~11h40 a 13h23 UTC) e teve ~49 mil downloads, segundo a Wiz.

**Por que importa:** quem instalou a 1.107.0 (PyPI, Docker ou GHCR com as tags `latest` e `main-stable` no período) deve tratar as credenciais da máquina como roubadas. As versões anteriores e a enterprise com registro privado não foram afetadas.

## Evidências
- [Post mortem do LiteLLM (cadeia do ataque)](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain)
- [The Record](https://therecord.media/litellm-hackers-ai-malware)

## Red flags
- ~49 mil downloads não equivalem a 49 mil vítimas, e nenhuma organização confirmou publicamente uma violação ligada a esse release.
- A primeira explicação do LiteLLM (21/10), que falava em tokens vazados em logs, foi substituída pela de 23/10. Cite a versão nova.
- A chave foi a causa inicial, não a única: o ataque também dependeu de um token de owner sem escopo e de proteção de branch contornada.
- É o segundo incidente de supply chain do LiteLLM em 2026 (o primeiro foi em março, nas versões 1.82.7 e 1.82.8).

Edição: [[2026-10-26-tech]]
