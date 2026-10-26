---
titulo: "PHP2Shell: honeypot registra RCE funcional, mas não há vítima real confirmada; Unit 42 retira o caso da agência europeia"
data: 2026-10-26
area: tech
secao: Cybersecurity
veredito: EXAGERADO
confianca: 80
contestado: false
checagem: dupla
tags: [tech, vulnerabilidade, web, php]
---
Atualização de [[2026-10-25-php2shell]]. Em 24/10, o pesquisador Adel Karimi registrou 35 shells funcionais a partir de dois IPs (3 + 32) em três honeypots seus. Os honeypots tinham configuração deliberadamente favorável (PHP 8.4.26, Apache mod_php, worker único), e nenhum payload de segundo estágio foi observado. Em 25/10, a Unit 42 retirou a atualização de 23/10 que ligava a intrusão numa agência governamental europeia ao PHP2Shell: "unable to confirm that initial access is associated with the specific PHP2Shell CVEs". A CISA não observou exploração bem-sucedida até 23/10, e as CVEs não estão no KEV em 26/10.

**Por que importa:** o exploit funciona em pelo menos um cenário real de configuração, então atualizar para 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 continua urgente. Mas não há, até agora, comprometimento em massa confirmado.

## Evidências
- [Relatório do honeypot (Karimi)](https://github.com/0x4D31/honeypot-data/blob/main/reports/php2shell/2026-10-24-confirmed-rce.md)
- [Unit 42 com a retratação de 25/10](https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/)
- [CISA: alerta das falhas do PHP](https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching)
- [SecurityWeek](https://www.securityweek.com/php2shell-exploitation-moves-from-probes-to-working-shells/)
- [BleepingComputer](https://www.bleepingcomputer.com/news/security/php2shell-security-flaws-now-sucessfully-exploited-in-the-wild/)

## Red flags
- "Explorada com sucesso em campo" (BleepingComputer): a evidência é de honeypot de um pesquisador, com configuração favorável. O título afirma mais do que o corpo sustenta.
- "35 shells" sem contexto: são tentativas automatizadas contra uma isca, reproduzindo PoC público, e não infecções em massa. Dois IPs não significam dois atores.
- O link do The Hacker News ainda diz "exploitation hits government", mas o caso foi retratado pela Unit 42.
- A "varredura norte-coreana" vem de atribuição de fornecedor (CYFIRMA), não confirmada, e cobre só 216 servidores: não é "global".
- A CVE-2026-115560 continua sem patch (mitigação: `session.upload_progress.enabled=0`).

Edição: [[2026-10-26-tech]]
