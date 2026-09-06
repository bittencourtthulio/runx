---
expx_schema: 1
expx_tool: sprintx
kind: sprint
trabalho_id: sessoes-paralelas
sprint_id: sprint-03
titulo: Pontes, instalador e fechamento
status: concluido
criterio_saida: As seis suites saem 0 falhas; diff -rq entre as duas arvores de skill nao reporta diferenca; DRs registradas
fases: [F-03.1, F-03.2, F-03.3]
riscos: [A carga real da ponte pelo OpenCode e pelo MimoCode so e verificavel a mao; o teste em node prova o contrato, nao a carga]
atualizado_em: 2026-09-06
---

# Sprint 03 — Pontes, instalador e fechamento

## Objetivo

Levar a rede de proteção aos outros dois harnesses com **um** arquivo JS que traduz os eventos
do OpenCode e do MimoCode para o payload que os hooks Python já entendem; ensinar o
instalador a colocar esse arquivo onde cada harness procura; documentar; espelhar; registrar
as decisões.

## Por que é uma sprint separada

Portão real: a ponte lê o `hooks.json` para saber o que despachar, e o `hooks.json` só fica
pronto em T-02.11. Escrever a ponte antes seria testá-la contra um registro que ainda vai
mudar.

## Fases

| Fase | Título | Roda em paralelo com |
|---|---|---|
| F-03.1 | A ponte | F-03.2 |
| F-03.2 | Instalador e README | F-03.1 |
| F-03.3 | Fechamento | nenhuma |

## Critério de saída

- `testar.sh`, `testar-falsos-positivos.sh`, `testar-conteudo.sh`, `testar-espelho.sh`,
  `testar-ponte.sh`, `testar-instalador.sh`: todos em **0 falhas**.
- `diff -rq .claude/skills/runx .opencode/skills/runx` e `diff -rq .claude/commands .opencode/command` sem saída.
- `DECISOES-DA-SKILL.md` tem as DRs desta feature.

## Riscos conhecidos

- **Carga real da ponte** (L-06): o teste em `node` prova a tradução; que o OpenCode e o
  MimoCode carreguem o arquivo da pasta certa é verificação manual, listada na definição de
  pronto do ORQUESTRADOR.
- **`metadata.exit` no `after`** (L-03): se o harness não entregar, `rastro-suite` grava
  `nao_determinado` — degrada, não quebra.

## Fora de escopo

- Declarar as extras no contrato canônico (expxdev); painel por worktree (expxdev); mergex.
