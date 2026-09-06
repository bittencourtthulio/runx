---
expx_schema: 1
expx_tool: sprintx
kind: fases
trabalho_id: sessoes-paralelas
sprint_id: sprint-03
atualizado_em: 2026-09-06
fases:
  - id: F-03.1
    titulo: A ponte
    status: concluido
    criterio_saida: testar-ponte.sh sai 0 falhas
    paralelizavel: true
    paralela_com: [F-03.2]
    tasks: [T-03.01]
  - id: F-03.2
    titulo: Instalador e README
    status: concluido
    criterio_saida: testar-instalador.sh sai 0 falhas e readme-mimocode passa
    paralelizavel: true
    paralela_com: [F-03.1]
    tasks: [T-03.02, T-03.03]
  - id: F-03.3
    titulo: Fechamento
    status: concluido
    criterio_saida: As seis suites em 0 falhas e as arvores identicas
    paralelizavel: false
    paralela_com: []
    tasks: [T-03.04, T-03.05]
---

# Fases — Sprint 03

```mermaid
%% Grafo de tasks — sprint-03 — gerado pela sprintx a partir de tasks.md
flowchart LR
  subgraph fase_03_1["F-03.1 A ponte"]
    T_03_01["T-03.01<br/>runx-ponte.js"]
  end
  subgraph fase_03_2["F-03.2 Instalador e README"]
    T_03_02["T-03.02<br/>install.sh --mimocode e ponte"]
    T_03_03["T-03.03<br/>README"]
  end
  subgraph fase_03_3["F-03.3 Fechamento"]
    T_03_04["T-03.04<br/>DRs na DECISOES-DA-SKILL"]
    T_03_05["T-03.05<br/>Espelhar e rodar tudo"]
  end
  T_03_01 --> T_03_02
  T_03_01 --> T_03_04
  T_03_02 --> T_03_04
  T_03_03 --> T_03_04
  T_03_04 --> T_03_05
  classDef concluida fill:#DFF0D8,stroke:#4A6B3A,color:#1A1815
  classDef critico stroke-width:3px
  class T_03_01,T_03_02,T_03_03,T_03_04,T_03_05 concluida
  class T_03_01,T_03_02,T_03_04,T_03_05 critico
```

## F-03.1 — A ponte

**Objetivo:** `runx-ponte.js` traduz os eventos do OpenCode e do MimoCode para o despachante.

**Tasks:** T-03.01.

**Critério de saída:** `testar-ponte.sh` sai 0 falhas.

**Roda em paralelo com:** F-03.2 — T-03.03 (README) não depende da ponte; T-03.02 depende
de T-03.01 e por isso é `paralelizavel: false`.

## F-03.2 — Instalador e README

**Objetivo:** o instalador distribui a ponte e os grupos novos; o README documenta os três
harnesses.

**Tasks:** T-03.02 (depende de T-03.01), T-03.03.

**Critério de saída:** `testar-instalador.sh` sai 0 falhas; `readme-mimocode` passa.

**Roda em paralelo com:** F-03.1.

## F-03.3 — Fechamento

**Objetivo:** registrar as decisões, espelhar as árvores, rodar as seis suítes.

**Tasks:** T-03.04 → T-03.05.

**Critério de saída:** as seis suítes em 0 falhas e as árvores idênticas.

**Roda em paralelo com:** nenhuma.
