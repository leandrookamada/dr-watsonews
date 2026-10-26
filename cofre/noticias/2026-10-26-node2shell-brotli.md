---
titulo: "Falha no decodificador Brotli (CVE-2026-111497) gera patches em Node.js, .NET, PowerShell e Python; sem exploração ativa"
data: 2026-10-26
area: tech
secao: Cybersecurity
veredito: PROVÁVEL
confianca: 85
contestado: false
checagem: dupla
tags: [tech, vulnerabilidade, open-source, nodejs, brotli]
---
A CVE-2026-111497 ("Node2Shell") é um out-of-bounds write no decodificador Brotli do Google, nas versões 1.0.3 a 1.2.0. O Node.js corrigiu em 21/10 nas versões 22.23.4, 24.22.1 e 26.12.1; o advisory diz que a falha permite crash, vazamento de memória ou execução de código via `node:zlib`. Segundo o SecurityWeek, a Microsoft (.NET 8.0.33/9.0.22/10.0.14, PowerShell 7.4–7.6, Visual Studio) e os pacotes Python (Brotli 1.2.1, brotlicffi 1.2.1.0) também receberam patches. A falha foi creditada à OpenAI Codex Security, e não há exploração em campo reportada.

**Por que importa:** só são afetadas aplicações que descomprimem dados Brotli não confiáveis, como corpo de requisição, resposta externa ou arquivo. Depois de atualizar, reinicie os serviços e reconstrua as imagens. O Node.js 20 e anteriores (EOL), além das linhas 23 e 25, não recebem correção.

## Evidências
- [Advisory de segurança do Node.js (outubro/2026)](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [SecurityWeek](https://www.securityweek.com/node2shell-brotli-flaw-triggers-patching-across-microsoft-node-js-python-packages/)
- [Konfirmity (agregador)](https://www.konfirmity.com/advisories/nodejs-october-2026-security-releases)

## Red flags
- O CVSS varia conforme o emissor: 9.2 (v4, Google) contra 8.1 (v3.1, Microsoft). Citar "9.2" sozinho infla a percepção.
- RCE só demonstrado em condições específicas: a Imperva conseguiu num container Node 24.22.0, sem confiabilidade, e o PoC público só funciona em build enfraquecido.
- "Node2Shell" é nome de marketing de pesquisa, não indica ataque em curso.
- Os patches da Microsoft e do Python foram confirmados via SecurityWeek, não direto nos fabricantes.

Edição: [[2026-10-26-tech]]
