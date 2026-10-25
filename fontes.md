# Fontes

Níveis de autoridade (como no Frank):

- **primária**: quem originou o fato (advisory do fabricante, CVE/NVD, CISA, paper, repositório, comunicado oficial).
- **secundária**: reportagem com apuração própria e histórico de correções.
- **baixa**: agregador, opinião, blog de marketing, fórum. Serve de pista, nunca de prova.

Grupos de independência: matérias do mesmo grupo editorial, ou que só reescrevem o mesmo press release, contam como **uma** voz.

Feeds marcados com `bloqueia-bot` responderam 403/406 a requisições automáticas no teste inicial. Se o WebFetch falhar, use `WebSearch` com `site:<domínio>` nas últimas 24h.

## Cybersecurity

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| CISA Advisories | https://www.cisa.gov/cybersecurity-advisories/all.xml | primária | |
| CISA KEV | https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json | primária | prova de "explorada ativamente" |
| Google Project Zero | https://googleprojectzero.blogspot.com/feeds/posts/default | primária | |
| Google Security Blog | https://security.googleblog.com/feeds/posts/default | primária | olhar viés de fabricante |
| PortSwigger Research | https://portswigger.net/research/rss | primária | olhar viés de fabricante |
| Microsoft MSRC | https://msrc.microsoft.com/blog/feed | primária | bloqueia-bot |
| SANS ISC | https://isc.sans.edu/rssfeed_full.xml | secundária | |
| Krebs on Security | https://krebsonsecurity.com/feed/ | secundária | |
| The Record | https://therecord.media/feed | secundária | |
| Ars Technica Security | https://arstechnica.com/security/feed/ | secundária | |
| Schneier on Security | https://www.schneier.com/feed/atom/ | secundária | parte é opinião |
| BleepingComputer | https://www.bleepingcomputer.com/feed/ | secundária | bloqueia-bot |
| SecurityWeek | https://www.securityweek.com/feed/ | secundária | bloqueia-bot |
| Dark Reading | https://www.darkreading.com/rss.xml | secundária | |
| The Hacker News | https://feeds.feedburner.com/TheHackersNews | baixa | manchetes infladas, muito conteúdo patrocinado |
| CISO Advisor (BR) | https://cisoadvisor.com.br/feed/ | baixa | bloqueia-bot; muita tradução de terceiros |

## Ciência da Computação

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| arXiv cs.CR | https://rss.arxiv.org/rss/cs.CR | primária | preprint: não revisado por pares |
| arXiv cs.AI | https://rss.arxiv.org/rss/cs.AI | primária | preprint: não revisado por pares |
| LWN.net | https://lwn.net/headlines/rss | secundária | |
| Quanta Magazine | https://api.quantamagazine.org/feed/ | secundária | filtrar só computação |
| MIT Technology Review | https://www.technologyreview.com/feed/ | secundária | |
| Hacker News (200+ pts) | https://hnrss.org/frontpage?points=200 | baixa | pista; seguir o link original |
| Lobsters | https://lobste.rs/rss | baixa | pista; seguir o link original |

Para adicionar fonte: nova linha na tabela certa. Nada mais precisa mudar.
