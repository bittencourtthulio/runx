---
expx_schema: 1
expx_tool: sprintx
kind: fases
trabalho_id: sessoes-paralelas
sprint_id: sprint-01
atualizado_em: 2026-09-06
fases:
  - id: F-01.1
    titulo: Verificadores vermelhos
    status: concluido
    criterio_saida: Os quatro scripts de teste existem, cada asercao nova falha pelo nome e nenhuma asercao antiga regrediu
    paralelizavel: false
    paralela_com: []
    tasks: [T-01.01, T-01.02, T-01.03, T-01.04]
---

# Fases — Sprint 01

```mermaid
%% Grafo de tasks — sprint-01 — gerado pela sprintx a partir de tasks.md
flowchart LR
  subgraph fase_01_1["F-01.1 Verificadores vermelhos"]
    T_01_01["T-01.01<br/>Fixture git real"]
    T_01_02["T-01.02<br/>Asserções de conteúdo"]
    T_01_03["T-01.03<br/>Harness da ponte"]
    T_01_04["T-01.04<br/>Teste do instalador"]
  end
  classDef concluida fill:#DFF0D8,stroke:#4A6B3A,color:#1A1815
  classDef critico stroke-width:3px
  class T_01_01,T_01_02,T_01_03,T_01_04 concluida
  class T_01_01 critico
```

## F-01.1 — Verificadores vermelhos

**Objetivo:** ter, antes de qualquer mudança de conteúdo ou de código, o teste que vai
falhar por cada uma delas.

**Tasks:** T-01.01, T-01.02, T-01.03, T-01.04 — as quatro são `paralelizavel: true` entre si:
cada uma toca um arquivo só, e os quatro arquivos são distintos.

**Critério de saída:** os quatro scripts existem; cada asserção nova falha pelo nome; as
suítes que já passavam (`testar-falsos-positivos.sh`, `testar-espelho.sh`) continuam em 0
falhas; `testar.sh` mantém os 59 casos anteriores ok.

**Roda em paralelo com:** nenhuma — é a única fase da sprint.
