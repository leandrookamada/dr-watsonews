---
titulo: "Huntress vê replay de tokens roubados em 79 organizações Microsoft 365, com 497 logins bem-sucedidos em dez semanas"
data: 2026-10-26
area: tech
secao: Cybersecurity
veredito: EXAGERADO
confianca: 70
contestado: false
checagem: dupla
tags: [tech, phishing, cloud, microsoft-365, huntress]
---
A Huntress publicou em 22/10 uma campanha de "token spray and replay" contra o Microsoft 365, observada de 14/07 a 22/09. Os tokens de sessão pós-MFA vieram de relays AitM, de phishing de device code e de engenharia social, e foram reutilizados a partir da faixa 193.26.115.0/24 (AS210558). A empresa contou 497 logins bem-sucedidos em 79 organizações, mais de 200 mil tentativas falhas e pelo menos 48 dispositivos Entra falsos registrados. Nenhum ator foi nomeado.

**Por que importa:** trocar a senha não derruba o acesso do atacante. É preciso revogar sessões, auditar dispositivos Entra, métodos de MFA e regras de caixa de correio, e aplicar Conditional Access, restrição de device code e Token Protection.

## Evidências
- [Huntress: relatório original](https://www.huntress.com/blog/token-replay-spray)
- [Help Net Security](https://www.helpnetsecurity.com/2026/10/23/microsoft-365-accounts-stolen-sessions/)
- [SecurityOnline](https://securityonline.info/microsoft-365-token-replay-attack/)

## Red flags
- "97 contas comprometidas" (The Hacker News e republicações): o número não aparece na fonte primária, que fala em 497 logins, e login não é conta. Pode ser erro de digitação ou contagem do The Hacker News, cujo texto não pôde ser lido (403).
- "Relay AitM" simplifica: AitM foi um de três vetores.
- 79 organizações é um recorte da telemetria de um fornecedor que vende o serviço de detecção, sem denominador. Não mede o tamanho global da ameaça.
- O próprio relatório traz números internos divergentes (303 logins em 29 organizações em uma seção, 232 em 28 em outra).

Edição: [[2026-10-26-tech]]
