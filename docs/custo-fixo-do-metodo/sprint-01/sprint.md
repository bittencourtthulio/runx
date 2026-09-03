---
expx_schema: 1
expx_tool: sprintx
kind: sprint
trabalho_id: custo-fixo-do-metodo
sprint_id: sprint-01
titulo: Capacidade de testar o conteudo das skills
status: concluido
criterio_saida: bash .claude/hooks/testes/testar-conteudo.sh e testar-espelho.sh rodam e reprovam o estado atual pelos motivos certos
fases: [F-01.1]
riscos: [Verificador frouxo passaria com o markdown errado e daria falso verde nas sprints seguintes]
atualizado_em: 2026-09-02
---

# Sprint 01 — Capacidade de testar o conteúdo das skills

## Objetivo

Criar os dois verificadores executáveis que hoje não existem (lacunas L-01 e L-03): um que
valida o conteúdo dos markdown das skills contra as regras do método, e outro que garante
o espelhamento `.claude/` ↔ `.opencode/`. Sem eles não há como fazer TDD das sprints
seguintes — que alteram markdown, não código.

## Fases

| Fase | Título | Roda em paralelo com |
|---|---|---|
| F-01.1 | Verificadores de conteúdo e de espelhamento | nenhuma |

Detalhe da fase em `fases.md`; tasks em `tasks.md`.

## Critério de saída

`bash .claude/hooks/testes/testar-conteudo.sh` e `bash .claude/hooks/testes/testar-espelho.sh`
existem, são executáveis, e no estado atual do repositório **reprovam** — o primeiro porque
o formato condensado ainda não está documentado, o segundo porque ainda não há divergência
a detectar (ele passa). E `bash .claude/hooks/testes/testar.sh` continua em 56 ok, 0 falhas.

## Riscos conhecidos

- Um verificador frouxo (que só conta linhas, ou só procura uma palavra) passaria com o
  markdown errado e daria falso verde nas sprints 02 e 03 — registrado em
  `base/testes-existentes.md` §9.

## Fora de escopo

- A skill `sprintx` — D-15: o escopo é a runx.
- Qualquer alteração no comportamento dos hooks — fica na sprint-02.
