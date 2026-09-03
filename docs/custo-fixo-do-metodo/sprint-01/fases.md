---
expx_schema: 1
expx_tool: sprintx
kind: fases
trabalho_id: custo-fixo-do-metodo
sprint_id: sprint-01
atualizado_em: 2026-09-02
fases:
  - id: F-01.1
    titulo: Verificadores de conteudo e de espelhamento
    status: concluido
    criterio_saida: Os dois scripts existem, rodam, e reprovam o estado atual pelos motivos certos
    paralelizavel: false
    paralela_com: []
    tasks: [T-01.01, T-01.02]
---

# Fases — Sprint 01

```mermaid
%% Grafo de tasks — sprint-01 — gerado pela sprintx a partir de tasks.md
flowchart LR
  subgraph fase_01_1["F-01.1 Verificadores"]
    T_01_01["T-01.01<br/>Verificador de conteudo"]
    T_01_02["T-01.02<br/>Teste de espelhamento"]
  end
  classDef pendente fill:#F3F0EA,stroke:#8A7F70,color:#1A1815
  classDef concluida fill:#DFF0D8,stroke:#4A6B3A,color:#1A1815
  classDef critico stroke-width:3px
  class T_01_01 concluida
  class T_01_02 concluida
  class T_01_01 critico
```

## F-01.1 — Verificadores de conteúdo e de espelhamento

**Objetivo:** criar os dois scripts que tornam testável o que hoje só é revisado a olho.

**Tasks:** T-01.01, T-01.02

**Critério de saída:** `testar-conteudo.sh` e `testar-espelho.sh` existem, são executáveis e
rodam sem travar. `testar-conteudo.sh` reprova no estado atual (o formato condensado ainda
não está documentado); `testar-espelho.sh` passa (as árvores estão idênticas hoje).

**Roda em paralelo com:** nenhuma.
