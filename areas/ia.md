# Área: ia

## Escopo

Inteligência artificial com olhar acadêmico: lançamentos de modelos (fronteira e open-weights), arquiteturas e técnicas novas, papers com repercussão, avaliação e benchmarks, e ferramentas e infraestrutura que mudam como se treina ou se roda modelo.
Descartar: anúncio de produto sem novidade técnica, parceria comercial, rodada de investimento, opinião sobre "AGI", lista "top N", tutorial, paper incremental sem resultado relevante.
Segurança de IA aplicada a ataques e defesa fica na área `tech`.
Prioridade: modelo novo de fronteira ou open-weights relevante > arquitetura ou técnica nova com resultado verificável (código ou pesos) > paper muito discutido > ferramenta ou infraestrutura > análise.

## Seções do briefing

`## Modelos e lançamentos`, `## Pesquisa e arquiteturas` e `## Ferramentas e infraestrutura`.

## Tags de assunto

`llm`, `multimodal`, `arquitetura`, `agentes`, `raciocinio`, `eficiencia`, `treinamento`, `alinhamento`, `avaliacao`, `open-weights`, `visao`, `audio`, `robotica`, `rl`, `interpretabilidade`, `hardware`.

## Checagens extras (passar ao Watson e ao Mycroft)

**Benchmark.** Número divulgado pelo próprio laboratório é autodeclarado: diga isso. Procure o eval independente (LMArena, Artificial Analysis, Epoch AI, papers de terceiros) e, se não houver, escreva "sem avaliação independente ainda". Desconfie de:
- comparação com versões antigas dos concorrentes ou com configurações diferentes (pass@k, número de shots, ferramentas liberadas);
- benchmark saturado ou com suspeita de contaminação;
- gráfico com eixo cortado e escolha seletiva de benchmarks.

**Aberto de verdade?** Distinga open source (código e dados de treino), open weights (só pesos) e "disponível por API". Diga a licença e as restrições de uso.

**Números do modelo.** Parâmetros totais × ativos (MoE), janela de contexto declarada × efetiva, custo de treino e compute: só com fonte primária (paper, model card, relatório técnico).

**Paper.** Preprint não é revisado por pares. Diga se o código ou os pesos foram liberados e se alguém reproduziu o resultado. Votos no Hugging Face medem atenção, não validade.

**Disponibilidade.** Demo, waitlist ou "em breve" não é lançamento. Diga quem pode usar, onde e a partir de quando.

**Linguagem.** "Revolucionário", "raciocina como humano", "AGI" e similares são red flag sem métrica concreta. Blog de laboratório é fonte primária para o que o laboratório afirma, não prova de que é verdade.

## Fontes

Níveis de autoridade:

- **primária**: quem originou o fato (paper, relatório técnico, model card, blog do laboratório que lançou, repositório oficial).
- **secundária**: análise com apuração própria (pesquisadores independentes, newsletters técnicas sérias, imprensa especializada).
- **baixa**: agregador, ranking de popularidade, rede social. Serve de pista, nunca de prova.

Grupos de independência: Google DeepMind e Google Research contam como uma voz; blogs de quem lançou o modelo nunca contam como corroboração independente do próprio modelo.

Linhas sem feed aparecem como falha na coleta; o Lestrade as cobre com `WebSearch site:<domínio>`.

### Laboratórios

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| OpenAI | https://openai.com/news/rss.xml | primária | mistura pesquisa e produto |
| Google DeepMind | https://deepmind.google/blog/rss.xml | primária | |
| Google Research | https://research.google/blog/rss/ | primária | |
| Microsoft Research | https://www.microsoft.com/en-us/research/feed/ | primária | |
| Qwen (Alibaba) | https://qwenlm.github.io/blog/index.xml | primária | |
| NVIDIA (IA generativa) | https://blogs.nvidia.com/blog/category/generative-ai/feed/ | primária | muito marketing de hardware |
| BAIR (Berkeley) | https://bair.berkeley.edu/blog/feed.xml | primária | acadêmico |
| Anthropic | https://www.anthropic.com/news | primária | sem RSS |
| Meta AI | https://ai.meta.com/blog/ | primária | sem RSS |
| Mistral | https://mistral.ai/news | primária | sem RSS |

### Papers e modelos

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| Hugging Face Daily Papers | https://huggingface.co/api/daily_papers?limit=100 | primária | curadoria diária com votos; o link leva ao paper. Votos = atenção, não validade |
| Hugging Face: modelos em alta | https://huggingface.co/api/models?sort=trendingScore&limit=50 | baixa | janela 7d; pista de lançamento, conferir no model card |
| Hugging Face Blog | https://huggingface.co/blog/feed.xml | secundária | parte é post de parceiro |

### Ferramentas e infraestrutura

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| Releases vLLM | https://github.com/vllm-project/vllm/releases.atom | primária | só interessa release com mudança relevante |
| Releases Transformers | https://github.com/huggingface/transformers/releases.atom | primária | só interessa suporte a arquitetura nova |

### Análise

| Fonte | Feed | Nível | Obs. |
|---|---|---|---|
| Import AI (Jack Clark) | https://importai.substack.com/feed | secundária | autor é cofundador da Anthropic |
| Interconnects (Nathan Lambert) | https://www.interconnects.ai/feed | secundária | foco em open models e pós-treino |
| Ahead of AI (Sebastian Raschka) | https://magazine.sebastianraschka.com/feed | secundária | arquiteturas explicadas |
| Simon Willison | https://simonwillison.net/atom/everything/ | secundária | testes práticos de modelos; volume alto |
| The Gradient | https://thegradient.pub/rss/ | secundária | |
| MIT News: IA | https://news.mit.edu/rss/topic/artificial-intelligence2 | secundária | comunicação institucional do MIT |

Para adicionar fonte: nova linha na tabela certa. Nada mais precisa mudar.
