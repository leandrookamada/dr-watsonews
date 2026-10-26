---
titulo: CISA põe no KEV falhas exploradas no CODE embutido do Nextcloud e no Arista VeloCloud Orchestrator
data: 2026-10-25
area: tech
secao: Cybersecurity
veredito: CONFIRMADO
confianca: 90
contestado: false
tags: [tech, vulnerabilidade, exploracao-ativa, nextcloud, arista]
---
Em 23/10 a CISA incluiu no KEV a CVE-2026-110447 (injeção de comando, CVSS v4.0 9.2) e a CVE-2026-114625 (SQL injection, CVSS v3.1 9.9), as duas com evidência de exploração ativa e prazo federal de 26/10. A falha da Collabora afeta só o app Nextcloud `richdocumentscode` (CODE embutido). Collabora standalone, Docker, RPM/DEB e Nextcloud AIO não são afetados. A exploração da Collabora começou em setembro, antes de existir CVE, e deixou webshells PHP. A falha do Arista exige usuário autenticado.

**Por que importa:** quem usa Nextcloud com o "Built-in CODE Server" deve atualizar para 26.4.303+ ou remover o app e procurar `apps/richdocumentscode/shx*.php`. Desativar o app não basta. Para o VCO on-prem, as versões corrigidas são 5.2.3.18, 6.1.3.10 e 6.4.2.12.

## Evidências
- [CISA (Collabora)](https://www.cisa.gov/news-events/alerts/2026/10/23/cisa-adds-one-known-exploited-vulnerability-catalog-0)
- [CISA (Arista)](https://www.cisa.gov/news-events/alerts/2026/10/23/cisa-adds-one-known-exploited-vulnerability-catalog)
- [advisory Collabora](https://github.com/CollaboraOnline/online/security/advisories/GHSA-g3vx-3m76-fghh)
- [advisory Arista 0199](https://www.arista.com/en/support/advisories-notices/security-advisory/24838-security-advisory-0199)
- [BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-exploit-collabora-rce-flaw-to-backdoor-nextcloud-servers/)

## Red flags
- "Servidor CODE do Collabora Online" sugere um escopo maior do que o real.
- A exploração exige que o CODE embutido esteja parado (reinício, upgrade ou crash).

Edição: [[2026-10-25-tech]]
