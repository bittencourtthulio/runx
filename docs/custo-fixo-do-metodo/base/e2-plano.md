# Área — E2 PLANO da runx (geração dos arquivos do plano)

## 1. Contrato de entrada

O estágio E2 recebe:

- `docs/manutencao/<OC-ID>-<slug>/01-CAUSA-RAIZ.md` com `STATUS: COMPROVADO` ou `STATUS: IMPACTO MAPEADO`
- `base/00-LACUNAS.md` sem lacuna bloqueante
- Opcionalmente `QA.md` com `VEREDITO: REPROVADO` (retorno do E4)

Fonte: `.claude/skills/runx/references/02-plano.md`, seção "Pré-requisitos verificáveis".

## 2. Contrato de saída

Para cada sprint N, o E2 grava hoje TRÊS arquivos em `docs/manutencao/<OC-ID>-<slug>/sprint-NN/`:

| Arquivo | kind | Conteúdo |
|---|---|---|
| `sprint.md` | `sprint` | objetivo, fases, critério de saída, riscos, fora de escopo |
| `fases.md` | `fases` | por fase: objetivo, tasks, critério de saída, paralelismo + bloco Mermaid do grafo de tasks |
| `tasks.md` | `tasks` | um bloco por task com todos os campos do contrato |

Mais `ORQUESTRADOR.md` (`kind: orquestrador`) com 7 seções obrigatórias.

Fonte: `.claude/skills/runx/references/02-plano.md`, Passo 3 e Passo 4.

## 3. Estrutura de dados

Cada um dos três arquivos carrega frontmatter próprio com o cabeçalho comum de 4 chaves
(`expx_schema`, `expx_tool`, `kind`, `trabalho_id`), mais as chaves do seu kind.

Contagem de chaves de cabeçalho repetidas por sprint hoje: **3 blocos de frontmatter**
(um por arquivo), sendo que `expx_schema`, `expx_tool`, `trabalho_id`, `sprint_id` e
`atualizado_em` se repetem nos três — 5 chaves × 3 arquivos = 15 ocorrências, das quais
10 são repetição.

Fonte: `.claude/skills/runx/references/00-schema.md`, kinds `sprint`, `fases`, `tasks`.

## 4. Funções e trechos relevantes

O Passo 3 do E2 determina literalmente (`references/02-plano.md`):

> Para cada sprint N, crie `docs/manutencao/<OC-ID>-<slug>/sprint-NN/` com três arquivos, usando os templates (caminhos relativos à raiz da skill)

A regra de proporcionalidade do `SKILL.md` determina:

> Uma correção de uma linha gera **1 sprint, 1 fase e 2 tasks**, e ainda assim com todos os campos do contrato preenchidos.

## 5. Quem chama e quem é chamado

- **Chamado por:** `.claude/commands/runx-plano.md`, `.claude/commands/runx.md`, e pelo E1 ao terminar.
- **Chama:** `references/00-schema.md` (obrigatório antes de gravar), `references/07-diagrama.md` (grafo de tasks), `references/06-estado.md` (barra de status), os 4 templates em `assets/`.
- **Consumidores dos arquivos gerados:** E3 (`03-fix.md` lê `tasks.md` e atualiza status), E4 (`04-qa.md` lê os três para montar a lista autorizada), hooks `causa-antes-do-plano.py`, `task-so-fecha-verde.py`, `escopo-da-ocorrencia.py`, e a biblioteca `expx_rastro.py` (função `pasta_ocorrencia`, `task_aberta`).

## 6. Estrutura de dados medida (evidência do custo)

Medição real sobre 17 ocorrências fechadas em `/Users/thuliobittencourt/Documents/Projetos/LeadIQ/leadiq/docs/manutencao/`, acessada em 2026-09-02:

| Métrica | Valor |
|---|---|
| Regressão do custo do plano | `plano ≈ 7657 + 2171 × tasks` bytes (n=16, r=0,87) |
| Custo fixo por ocorrência (intercepto) | 7.657 B |
| Ocorrências com ≤ 2 tasks | 10 de 16 |
| Plano mediano de ocorrência ≤2 tasks | 11.921 B |
| Plano mediano de ocorrência ≥4 tasks | 15.549 B |
| Fixo como % do plano numa ocorrência de 2 tasks | 64% |

## 7. Testes existentes

`NÃO DETERMINADO` — o repositório RunX não tem suíte de testes automatizados para o
conteúdo das skills. Existem apenas os testes de hooks em `.claude/hooks/testes/`
(`testar.sh`, `testar-falsos-positivos.sh`), que cobrem os hooks Python, não os markdown
das skills. Registrado em `00-LACUNAS.md`.

## 8. Limites e regras de negócio conhecidas

- Regra inviolável 3 do `SKILL.md`: "O plano segue sempre a hierarquia sprint → fase → task, com todos os campos do contrato, qualquer que seja o tamanho da ocorrência."
- Regra de proporcionalidade: "Proibido inflar o plano para parecer robusto. Proibido enxugar campos para parecer ágil."
- `references/00-schema.md`: "Ao mudar qualquer kind compartilhado, a mudança vale para as duas skills" — `sprint`, `fases` e `tasks` são kinds COMPARTILHADOS com a sprintx.

## 9. Riscos para esta ocorrência

- **Risco alto:** os kinds `sprint`, `fases` e `tasks` são compartilhados com a sprintx. Um formato condensado que altere esses kinds quebra o painel que lê as duas skills. Mitigação obrigatória: o arquivo condensado deve preservar os três kinds como blocos YAML válidos, ou ser um kind novo exclusivo da runx.
- **Risco médio:** `expx_rastro.py` lê `sprint-*/tasks.md` por caminho fixo (função `task_aberta`, linha ~"for sprint in sprints: fm = R.frontmatter(os.path.join(pasta, sprint, 'tasks.md'))"). Um arquivo condensado que elimine `tasks.md` quebra a leitura do rastro.
- **Risco médio:** o hook `task-so-fecha-verde.py` casa em `tasks.md` pelo caminho.
- **Risco médio:** o E4 (`04-qa.md`, Passo 3.2) monta a lista autorizada lendo `tasks.md`.

## 10. Fonte

- `.claude/skills/runx/references/02-plano.md` — acessado em 2026-09-02
- `.claude/skills/runx/references/00-schema.md` — acessado em 2026-09-02
- `.claude/skills/runx/SKILL.md` — acessado em 2026-09-02
- `.claude/skills/runx/assets/TEMPLATE-sprint.md`, `TEMPLATE-fases.md`, `TEMPLATE-tasks.md` — acessados em 2026-09-02
- Medição: `/Users/thuliobittencourt/Documents/Projetos/LeadIQ/leadiq/docs/manutencao/` (17 ocorrências) — acessado em 2026-09-02
