---
expx_schema: 1
expx_tool: sprintx
kind: sprint
trabalho_id: sessoes-paralelas
sprint_id: sprint-02
titulo: Metodo e motor
status: concluido
criterio_saida: testar-conteudo.sh sai 0 exceto readme-mimocode; testar.sh e testar-falsos-positivos.sh saem 0 falhas com os casos novos; doctor.py lista nove hooks
fases: [F-02.1, F-02.2]
riscos: [Tres hooks novos e a biblioteca comum tocam testar.sh em sequencia; um caso perdido no meio passa despercebido sem contagem]
atualizado_em: 2026-09-06
---

# Sprint 02 — Método e motor

## Objetivo

Duas frentes paralelas. **Método** (F-02.1): o texto da skill passa a dizer que a ocorrência
nasce em worktree, que task se reivindica pelo rastro e que a suíte inteira só roda em árvore
limpa — o que vale nos três harnesses, porque os três leem o mesmo `SKILL.md`. **Motor**
(F-02.2): a biblioteca comum aprende o que é um worktree e quem é a sessão, e nascem os três
hooks que transformam as regras novas em verificação determinística.

## Fases

| Fase | Título | Roda em paralelo com |
|---|---|---|
| F-02.1 | Método (markdown da skill) | F-02.2 |
| F-02.2 | Motor (biblioteca e hooks Python) | F-02.1 |

As duas fases são paralelas porque não compartilham arquivo: F-02.1 toca só
`.claude/skills/runx/`; F-02.2 toca só `.claude/hooks/`.

## Critério de saída

- `bash .claude/hooks/testes/testar-conteudo.sh` sai com **0 falhas exceto `readme-mimocode`**
  (o README é da sprint-03).
- `bash .claude/hooks/testes/testar.sh` sai 0 falhas, com pelo menos 59 + 1 + 3 + 4 + 4 + 6 = 77 casos.
- `bash .claude/hooks/testes/testar-falsos-positivos.sh` sai 0 falhas com os casos novos.
- `python3 .claude/hooks/comum/doctor.py` lista nove hooks, os três novos em `aviso`.

## Riscos conhecidos

- **Cadeia sobre `testar.sh`** — T-02.07 a T-02.10 editam o mesmo script em sequência. Cada
  `criterio_aceite` fixa a contagem mínima de casos; contagem que cai é regressão.
- **`task-so-fecha-verde` e `task-reivindicada` casam o mesmo arquivo** (`tasks.md`). Os dois
  vão no mesmo grupo do despachante; a ordem no `hooks.json` é a ordem de execução, e ambos
  são aviso — não há corrida.
- **`.expx/` no worktree** — o texto do E1 precisa dizer "copie se existir no principal", nunca
  "crie". É a contradição resolvida em `00-DECISOES.md`.

## Fora de escopo

- README, instalador, ponte JS, espelhamento e DRs — sprint-03.
- Os agentes (`.claude/agents/`) — não mudam.
