---
expx_schema: 1
expx_tool: sprintx
kind: base_indice
trabalho_id: custo-fixo-do-metodo
atualizado_em: 2026-09-02
areas:
  - arquivo: e2-plano.md
    titulo: E2 PLANO da runx (geracao dos arquivos do plano)
    lacunas: 1
  - arquivo: acoplamento-hooks.md
    titulo: Acoplamento dos hooks e do rastro aos arquivos do plano
    lacunas: 0
  - arquivo: testes-existentes.md
    titulo: Suite de testes do repositorio RunX
    lacunas: 2
  - arquivo: arvores-espelhadas.md
    titulo: As duas arvores de skill e a distribuicao
    lacunas: 2
---

# Índice da base

Base de conhecimento da feature `custo-fixo-do-metodo`: reduzir o custo fixo do método
runx em três frentes, sem alterar contrato, testes ou QA.

| Arquivo | Resumo |
|---|---|
| [e2-plano.md](e2-plano.md) | O estágio E2 e os três arquivos que ele grava por sprint. Traz a medição das 17 ocorrências do leadiq que quantifica o custo fixo: `plano ≈ 7657 + 2171 × tasks`, e o fixo é 64% do plano numa ocorrência de 2 tasks. |
| [acoplamento-hooks.md](acoplamento-hooks.md) | Os quatro hooks Python que leem `sprint-*/tasks.md` por caminho fixo, e o parser que lê apenas o PRIMEIRO bloco YAML de um arquivo. É a restrição dura que o andaime condensado precisa respeitar. |
| [testes-existentes.md](testes-existentes.md) | `.claude/hooks/testes/testar.sh`, a única rede de proteção automatizada do repositório. Linha de base medida em 2026-09-02: **56 ok, 0 falhas**. |
| [arvores-espelhadas.md](arvores-espelhadas.md) | As duas cópias da skill (`.claude/` e `.opencode/`), hoje idênticas, e o que o `install.sh` distribui. DR-44 obriga espelhar toda mudança. |

## O que o histórico já sabia

Não há skill `memox` instalada neste repositório. A verificação foi feita pelo versionador:
`git log --oneline -1` devolve `253e666 Merge branch 'amplia-gatilho-de-sintoma'`, e a
árvore está limpa. As três melhorias são novas — nenhum trabalho anterior registrado no
repositório tocou o custo fixo do plano.

## Nota sobre o alcance da mudança

Os kinds `sprint`, `fases` e `tasks` são **compartilhados com a sprintx** (`00-schema.md`:
"Ao mudar qualquer kind compartilhado, a mudança vale para as duas skills"). Isso não
significa que a sprintx precise mudar junto — significa que o formato condensado da runx
não pode redefinir esses kinds, ou o painel que lê as duas quebra.
