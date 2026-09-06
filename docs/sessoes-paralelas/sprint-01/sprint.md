---
expx_schema: 1
expx_tool: sprintx
kind: sprint
trabalho_id: sessoes-paralelas
sprint_id: sprint-01
titulo: Capacidade de testar
status: concluido
criterio_saida: testar.sh tem fixture git real e 1 falha nomeada raiz-em-worktree; testar-conteudo.sh, testar-ponte.sh e testar-instalador.sh existem e saem 1 nomeando cada asercao que falta
fases: [F-01.1]
riscos: [Editar testar.sh sem comparar a contagem de casos antes e depois pode esconder um caso perdido]
atualizado_em: 2026-09-06
---

# Sprint 01 — Capacidade de testar

## Objetivo

Regra 13 da sprintx: a primeira sprint entrega a capacidade de testar. Aqui isso significa
quatro coisas, todas **vermelhas por construção** ao fim da sprint: uma fixture git de
verdade em `testar.sh` com o caso que prova o defeito do `raiz_repo`; as asserções de
conteúdo que descrevem o que o método vai passar a dizer; um harness em `node` para a ponte
JS que ainda não existe; e um teste de `--dry-run` do instalador que ainda não sabe de
MimoCode.

## Fases

| Fase | Título | Roda em paralelo com |
|---|---|---|
| F-01.1 | Verificadores vermelhos | nenhuma (única fase) |

Detalhe em `fases.md`; tasks em `tasks.md`.

## Critério de saída

- `bash .claude/hooks/testes/testar.sh` sai com **59 ok e exatamente 1 falha**, nomeada `raiz-em-worktree`.
- `bash .claude/hooks/testes/testar-conteudo.sh` sai 1, com as 20 asserções anteriores ok (a `regras-continuam-15` renomeada para `-16` e vermelha) e 14 asserções novas vermelhas, cada uma nomeada.
- `bash .claude/hooks/testes/testar-ponte.sh` sai 1 dizendo que `.claude/hooks/ponte/runx-ponte.js` não existe.
- `bash .claude/hooks/testes/testar-instalador.sh` sai 1 nomeando o que o `--dry-run` não listou.
- `testar-falsos-positivos.sh` e `testar-espelho.sh` continuam em 0 falhas.

## Riscos conhecidos

- **Editar `testar.sh` pode perder um caso em silêncio** — o auditor do plano anterior já
  apontou. Mitigação: o `criterio_aceite` de T-01.01 exige contagem exata (59 ok) além da
  falha nova.
- **`node` ausente na máquina de quem executa** — `testar-ponte.sh` sai 1 nomeando a falta,
  nunca 0 fingindo que passou.

## Fora de escopo

- Qualquer mudança em markdown da skill, hook Python, ponte ou instalador: tudo isso é
  sprint-02 e sprint-03.
