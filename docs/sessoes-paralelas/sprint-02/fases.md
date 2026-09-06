---
expx_schema: 1
expx_tool: sprintx
kind: fases
trabalho_id: sessoes-paralelas
sprint_id: sprint-02
atualizado_em: 2026-09-06
fases:
  - id: F-02.1
    titulo: Metodo (markdown da skill)
    status: concluido
    criterio_saida: As 13 asercoes de conteudo sobre a skill passam; nenhum marcador {{...}} vazado
    paralelizavel: true
    paralela_com: [F-02.2]
    tasks: [T-02.01, T-02.02, T-02.03, T-02.04, T-02.05, T-02.06]
  - id: F-02.2
    titulo: Motor (biblioteca e hooks Python)
    status: concluido
    criterio_saida: testar.sh e testar-falsos-positivos.sh em 0 falhas com os casos novos; doctor.py lista nove hooks
    paralelizavel: true
    paralela_com: [F-02.1]
    tasks: [T-02.07, T-02.08, T-02.09, T-02.10, T-02.11]
---

# Fases — Sprint 02

```mermaid
%% Grafo de tasks — sprint-02 — gerado pela sprintx a partir de tasks.md
flowchart LR
  subgraph fase_02_1["F-02.1 Método"]
    T_02_01["T-02.01<br/>SKILL.md: regra 16, seção, hooks, rastro"]
    T_02_02["T-02.02<br/>Schema e template: worktree"]
    T_02_03["T-02.03<br/>E1: abrir a área de trabalho"]
    T_02_04["T-02.04<br/>E3: task_iniciada e reivindicação"]
    T_02_05["T-02.05<br/>E4: árvore antes da suíte"]
    T_02_06["T-02.06<br/>E2 e E5: área no ORQUESTRADOR e no relatório"]
  end
  subgraph fase_02_2["F-02.2 Motor"]
    T_02_07["T-02.07<br/>raiz em worktree, sessão, extras"]
    T_02_08["T-02.08<br/>uma-ocorrencia-por-arvore"]
    T_02_09["T-02.09<br/>task-reivindicada"]
    T_02_10["T-02.10<br/>arvore-limpa-antes-da-suite"]
    T_02_11["T-02.11<br/>hooks.json, exemplo, doctor"]
  end
  T_02_07 --> T_02_08 --> T_02_09 --> T_02_10 --> T_02_11
  classDef concluida fill:#DFF0D8,stroke:#4A6B3A,color:#1A1815
  classDef critico stroke-width:3px
  class T_02_01,T_02_02,T_02_03,T_02_04,T_02_05,T_02_06,T_02_07,T_02_08,T_02_09,T_02_10,T_02_11 concluida
  class T_02_07,T_02_08,T_02_09,T_02_10,T_02_11 critico
```

## F-02.1 — Método (markdown da skill)

**Objetivo:** o texto que os três harnesses leem passa a descrever o trabalho em sessões
paralelas: worktree por ocorrência, uma ocorrência por árvore, reivindicação de task,
árvore limpa antes da suíte, identidade no rastro.

**Tasks:** T-02.01 a T-02.06 — todas `paralelizavel: true`: cada uma toca arquivos que
nenhuma outra toca (`SKILL.md` / `00-schema.md`+`TEMPLATE-ocorrencia.md`+`06-estado.md` /
`01-investigacao.md` / `03-fix.md` / `04-qa.md` / `02-plano.md`+`TEMPLATE-ORQUESTRADOR.md`+`05-relatorio.md`).

**Critério de saída:** as 13 asserções de conteúdo sobre a skill (todas de T-01.02 menos
`readme-mimocode`) passam; nenhum `{{...}}` vazado (asserção existente).

**Roda em paralelo com:** F-02.2.

## F-02.2 — Motor (biblioteca e hooks Python)

**Objetivo:** `expx_rastro` reconhece worktree e sessão; três hooks novos; registro e
diagnóstico atualizados.

**Tasks:** T-02.07 → T-02.08 → T-02.09 → T-02.10 → T-02.11, em cadeia: T-02.07 entrega
`sessao()` que os hooks seguintes usam, e todas editam `testar.sh`.

**Critério de saída:** `testar.sh` e `testar-falsos-positivos.sh` em 0 falhas com os casos
novos; `doctor.py` lista nove hooks.

**Roda em paralelo com:** F-02.1.
