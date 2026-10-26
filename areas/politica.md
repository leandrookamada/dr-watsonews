# Área: política

## Escopo

Política brasileira (Executivo, Congresso, STF/TSE, eleições, investigações, economia política) e política internacional com impacto no Brasil ou relevância global grande.
Só **fatos noticiáveis**: votação, decisão judicial, ato do governo, nomeação, operação, resultado/pesquisa eleitoral, dado oficial.
Descartar: coluna, editorial, artigo de opinião, "bastidores" sem fato novo, fofoca, enquete sem método.
Prioridade: decisão com efeito imediato (lei sancionada, decisão de plenário, medida provisória) > votação/tramitação relevante > investigação/operação > declarações > resto.

## Seções do briefing

`## Brasil` e `## Internacional`.

## Tags de assunto

`congresso`, `stf`, `tse`, `eleicoes`, `executivo`, `economia`, `orcamento`, `investigacao`, `judiciario`, `relacoes-exteriores`, `meio-ambiente`, `seguranca-publica`, `saude`, `educacao`, `desinformacao`, `internacional`.

## Checagens extras (passar ao Watson e ao Mycroft)

**Simetria.** O mesmo rigor vale para qualquer lado político. O veredito julga fatos, nunca se a política é boa ou ruim. Não use adjetivo valorativo; quando houver disputa de interpretação, apresente as versões com atribuição ("segundo o governo...", "a oposição afirma...").

**Fato × declaração.** "X disse Y" é verdadeiro se X disse. Se Y é uma alegação factual relevante, verifique Y à parte.

**Etapa institucional.** Não confundir:
- projeto aprovado em comissão × no plenário de uma Casa × nas duas × sancionado × regulamentado;
- liminar monocrática × decisão de turma × decisão do plenário do STF; decisão com recurso pendente;
- denúncia × réu × condenado × trânsito em julgado; investigado ≠ acusado.
Confirme na fonte primária: página da proposição na Câmara/Senado (placar, texto, fase), portal do STF/TSE, Diário Oficial.

**Números.** PIB, inflação, desemprego, dívida, gasto público: conferir no IBGE, Banco Central, Tesouro, Portal da Transparência, com período, base de comparação e se o valor é nominal ou real.

**Pesquisa eleitoral.** Registro no TSE, instituto, contratante, amostra, margem de erro, data de campo. Diferença dentro da margem é empate técnico.

**Fonte anônima.** "Interlocutores", "aliados", "pessoas próximas": sem confirmação on-record ou documento, a alegação vai no máximo a `PROVÁVEL`.

**Viés e enquadramento.** Compare a cobertura de veículos de perfis diferentes. Procure omissão seletiva, enquadramento que muda o sentido, falsa equivalência e número sem contexto.

**Mídia fora de contexto.** Vídeo, foto ou áudio: data e local originais. Consulte as agências de checagem.

## Fontes

Níveis de autoridade:

- **primária**: quem originou o fato (Câmara, Senado, STF, TSE, Diário Oficial, órgão oficial, documento, dado oficial).
- **secundária**: reportagem com apuração própria e histórico de correções.
- **baixa**: veículo com linha editorial militante, agregador, opinião. Serve de pista, nunca de prova.

Perfil é só metadado para o Mycroft comparar enquadramentos; não muda o nível por si só.

Grupos de independência (contam como **uma** voz):
- Globo: G1, O Globo, Valor, CBN, GloboNews
- Folha: Folha, UOL, piauí
- Estadão; Abril (VEJA); Record (R7); Band; EBC/Agência Brasil (estatal)

Feeds marcados `bloqueia-bot` falharam no teste automatizado: use `WebSearch site:<domínio>` nas últimas 24h.

### Primárias

| Fonte | Feed | Obs. |
|---|---|---|
| Agência Câmara | https://www.camara.leg.br/noticias/rss/ultimas-noticias | órgão da Câmara: notícia institucional |
| Agência Senado | https://www12.senado.leg.br/noticias/feed/todasnoticias/RSS | órgão do Senado: notícia institucional |
| STF | https://portal.stf.jus.br/ | sem RSS útil: `WebSearch site:portal.stf.jus.br` |
| TSE | https://www.tse.jus.br/comunicacao/noticias | bloqueia-bot |
| Planalto | https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/noticias | bloqueia-bot; comunicação do governo, não é neutra |

### Brasil

| Fonte | Feed | Nível | Perfil |
|---|---|---|---|
| G1 Política | https://g1.globo.com/rss/g1/politica/ | secundária | grande imprensa (Globo) |
| Folha Poder | https://feeds.folha.uol.com.br/poder/rss091.xml | secundária | grande imprensa (Folha) |
| Estadão Política | https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/politica/ | secundária | grande imprensa |
| Poder360 | https://www.poder360.com.br/feed/ | secundária | grande imprensa digital |
| Metrópoles | https://www.metropoles.com/feed | secundária | grande imprensa digital |
| Nexo | https://www.nexojornal.com.br/rss.xml | secundária | explicativo |
| BBC News Brasil | https://feeds.bbci.co.uk/portuguese/rss.xml | secundária | internacional em português |
| DW Brasil | https://rss.dw.com/xml/rss-br-all | secundária | internacional em português |
| Agência Pública | https://apublica.org/feed/ | secundária | investigativo |
| Agência Brasil | https://agenciabrasil.ebc.com.br/rss/politica/feed.xml | secundária | estatal (EBC) |
| Gazeta do Povo | https://www.gazetadopovo.com.br/feed/rss/republica.xml | secundária | linha conservadora |
| Jovem Pan | https://jovempan.com.br/feed | baixa | linha de direita |
| Revista Oeste | https://revistaoeste.com/feed/ | baixa | linha de direita |
| CartaCapital | https://www.cartacapital.com.br/feed/ | baixa | linha de esquerda |
| Intercept Brasil | https://www.intercept.com.br/feed/ | baixa | linha de esquerda, investigativo |

### Checagem

| Fonte | Feed |
|---|---|
| Aos Fatos | https://www.aosfatos.org/noticias/feed/ |
| Lupa | https://lupa.uol.com.br/feed |
| Projeto Comprova | https://projetocomprova.com.br/feed/ |

### Internacional

| Fonte | Feed | Nível |
|---|---|---|
| BBC World | https://feeds.bbci.co.uk/news/world/rss.xml | secundária |
| The Guardian World | https://www.theguardian.com/world/rss | secundária |
