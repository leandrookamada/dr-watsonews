# Área: tech

## Escopo

Ciência da Computação e Cybersecurity: vulnerabilidades, incidentes, pesquisa, ferramentas, infraestrutura, IA aplicada.
Descartar: patrocinado/webinar, vaga, review de produto, listas "top 10".
Prioridade: exploração ativa/incidente amplo > vulnerabilidade crítica com patch > pesquisa relevante > resto.

## Seções do briefing

`## Cybersecurity` e `## Ciência da Computação`.

## Tags de assunto

`vulnerabilidade`, `exploracao-ativa`, `incidente`, `vazamento`, `ransomware`, `malware`, `phishing`, `ia`, `seguranca-de-ia`, `pesquisa`, `criptografia`, `privacidade`, `cloud`, `linux`, `web`, `open-source`, `hardware`, `regulacao`.

## Checagens extras

Nenhuma além das padrão de Watson e Mycroft.

## Fontes

Níveis de autoridade (como no Frank):

- **primária**: quem originou o fato (advisory do fabricante, CVE/NVD, CISA, paper, repositório, comunicado oficial).
- **secundária**: reportagem com apuração própria e histórico de correções.
- **baixa**: agregador, opinião, blog de marketing, fórum. Serve de pista, nunca de prova.

Grupos de independência: matérias do mesmo grupo editorial, ou que só reescrevem o mesmo press release, contam como **uma** voz.

Feeds marcados com `bloqueia-bot` responderam 403/406 a requisições automáticas no teste inicial. Se o WebFetch falhar, use `WebSearch` com `site:<domínio>` nas últimas 24h.

### Cybersecurity

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| CISA Advisories | https://www.cisa.gov/cybersecurity-advisories/all.xml | primária | |
| CISA KEV | https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json | primária | prova de "explorada ativamente" |
| Google Project Zero | https://projectzero.google/feed.xml | primária | feed passa de 10 MB; se falhar, `WebSearch site:projectzero.google` |
| Google Security Blog | https://security.googleblog.com/feeds/posts/default | primária | olhar viés de fabricante |
| PortSwigger Research | https://portswigger.net/research/rss | primária | olhar viés de fabricante |
| Microsoft MSRC | https://msrc.microsoft.com/blog/feed | primária | bloqueia-bot |
| SANS ISC | https://isc.sans.edu/rssfeed_full.xml | secundária | |
| Krebs on Security | https://krebsonsecurity.com/feed/ | secundária | |
| The Record | https://therecord.media/feed | secundária | |
| Ars Technica Security | https://arstechnica.com/security/feed/ | secundária | bloqueia-bot |
| Schneier on Security | https://www.schneier.com/feed/atom/ | secundária | parte é opinião |
| BleepingComputer | https://www.bleepingcomputer.com/feed/ | secundária | bloqueia-bot |
| SecurityWeek | https://www.securityweek.com/feed/ | secundária | bloqueia-bot |
| Dark Reading | https://www.darkreading.com/rss.xml | secundária | |
| The Hacker News | https://feeds.feedburner.com/TheHackersNews | baixa | manchetes infladas, muito conteúdo patrocinado; feed funciona, páginas de artigo dão 403 (use o resumo do feed e vá direto à fonte citada) |
| CISO Advisor (BR) | https://cisoadvisor.com.br/feed/ | baixa | bloqueia-bot; muita tradução de terceiros |

### Ciência da Computação

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| arXiv cs.CR | https://rss.arxiv.org/rss/cs.CR | primária | preprint: não revisado por pares; vazio sáb/dom |
| arXiv cs.AI | https://rss.arxiv.org/rss/cs.AI | primária | preprint: não revisado por pares; vazio sáb/dom |
| LWN.net | https://lwn.net/headlines/rss | secundária | |
| Quanta Magazine | https://api.quantamagazine.org/feed/ | secundária | filtrar só computação |
| MIT Technology Review | https://www.technologyreview.com/feed/ | secundária | |
| Hacker News (200+ pts) | https://hnrss.org/frontpage?points=200 | baixa | pista; seguir o link original |
| Lobsters | https://lobste.rs/rss | baixa | pista; seguir o link original |

### GitHub

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| GitHub Advisory Database (critical) | https://api.github.com/advisories?type=reviewed&severity=critical&per_page=50 | primária | advisories revisados pelo GitHub; CVE, pacote e ecossistema |
| GitHub Advisory Database (high) | https://api.github.com/advisories?type=reviewed&severity=high&per_page=50 | primária | volume alto: priorizar pacotes muito usados |
| GitHub Security Lab | https://github.blog/tag/github-security-lab/feed/ | primária | pesquisa original de vulnerabilidades |
| GitHub Blog Security | https://github.blog/security/feed/ | secundária | parte é anúncio de produto do GitHub |
| Releases Node.js | https://github.com/nodejs/node/releases.atom | primária | só interessa release de segurança |
| Releases OpenSSL | https://github.com/openssl/openssl/releases.atom | primária | só interessa release de segurança |
| Releases curl | https://github.com/curl/curl/releases.atom | primária | só interessa release de segurança |
| Releases Kubernetes | https://github.com/kubernetes/kubernetes/releases.atom | primária | só interessa release de segurança |
| PoCs novos de CVE | https://api.github.com/search/repositories?q=CVE+in:name+created:%3E%3D{desde}&sort=stars&order=desc&per_page=30 | baixa | sinal de PoC público, nunca prova de exploração; repositórios de PoC falsos com malware são comuns: nunca executar nada |

Para adicionar fonte: nova linha na tabela certa. Nada mais precisa mudar.
