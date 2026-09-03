---
expx_schema: 1
expx_tool: sprintx
kind: fases
trabalho_id: custo-fixo-do-metodo
sprint_id: sprint-02
atualizado_em: 2026-09-02
fases:
  - id: F-02.1
    titulo: Andaime condensado
    status: concluido
    criterio_saida: As asercoes de formato condensado do testar-conteudo.sh passam
    paralelizavel: true
    paralela_com: [F-02.2, F-02.3]
    tasks: [T-02.01, T-02.02, T-02.03]
  - id: F-02.2
    titulo: Suite parcial por task
    status: concluido
    criterio_saida: As asercoes de suite parcial passam e o hook aceita parcial sem barrar
    paralelizavel: true
    paralela_com: [F-02.1, F-02.3]
    tasks: [T-02.04, T-02.05, T-02.06]
  - id: F-02.3
    titulo: Investigador por evidencia
    status: concluido
    criterio_saida: A asercao do corte de 3 arquivos passa
    paralelizavel: true
    paralela_com: [F-02.1, F-02.2]
    tasks: [T-02.07]
  - id: F-02.4
    titulo: Espelhamento e fechamento
    status: concluido
    criterio_saida: testar-espelho.sh sai 0 e as tres suites saem 0
    paralelizavel: false
    paralela_com: []
    tasks: [T-02.08, T-02.09]
---

# Fases — Sprint 02

```mermaid
%% Grafo de tasks — sprint-02 — gerado pela sprintx a partir de tasks.md
flowchart LR
  subgraph fase_02_1["F-02.1 Andaime condensado"]
    T_02_01["T-02.01<br/>Kind plano no schema"]
    T_02_02["T-02.02<br/>Template condensado"]
    T_02_03["T-02.03<br/>E2 escolhe o formato"]
  end
  subgraph fase_02_2["F-02.2 Suite parcial"]
    T_02_04["T-02.04<br/>Enum suite com parcial"]
    T_02_05["T-02.05<br/>E3 roda subconjunto"]
    T_02_06["T-02.06<br/>Hook aceita parcial"]
  end
  subgraph fase_02_3["F-02.3 Investigador"]
    T_02_07["T-02.07<br/>Corte de 3 arquivos"]
  end
  subgraph fase_02_4["F-02.4 Fechamento"]
    T_02_08["T-02.08<br/>Espelhar em .opencode"]
    T_02_09["T-02.09<br/>Registrar decisoes DR"]
  end
  T_02_01 --> T_02_02
  T_02_02 --> T_02_03
  T_02_04 --> T_02_05
  T_02_04 --> T_02_06
  T_02_03 --> T_02_08
  T_02_05 --> T_02_08
  T_02_06 --> T_02_08
  T_02_07 --> T_02_08
  T_02_08 --> T_02_09
  classDef pendente fill:#F3F0EA,stroke:#8A7F70,color:#1A1815
  classDef concluida fill:#DFF0D8,stroke:#4A6B3A,color:#1A1815
  classDef critico stroke-width:3px
  class T_02_01 concluida
  class T_02_02 concluida
  class T_02_03 concluida
  class T_02_04 concluida
  class T_02_05 concluida
  class T_02_06 concluida
  class T_02_07 concluida
  class T_02_08 concluida
  class T_02_09 concluida
  class T_02_01 critico
  class T_02_02 critico
  class T_02_03 critico
  class T_02_08 critico
  class T_02_09 critico
```

## F-02.1 — Andaime condensado

**Objetivo:** permitir que um plano de 1 sprint e 1 fase seja gravado em um arquivo só.

**Tasks:** T-02.01, T-02.02, T-02.03

**Critério de saída:** as asserções de formato condensado do `testar-conteudo.sh` passam —
o `00-schema.md` declara o kind `plano`, existe `TEMPLATE-plano-condensado.md` sem marcador
vazado, e o `02-plano.md` diz quando usar cada formato.

**Roda em paralelo com:** F-02.2 e F-02.3 (arquivos disjuntos: esta toca `00-schema.md`,
`02-plano.md` e um asset novo; a F-02.2 toca `03-fix.md`, `04-qa.md` e um hook; a F-02.3
toca `01-investigacao.md`).

> Atenção: T-02.01 e T-02.04 tocam ambas o `00-schema.md`. Por isso as duas são
> `paralelizavel: false` dentro das suas fases — ver `tasks.md`. As fases são paralelas;
> essas duas tasks específicas, não.

## F-02.2 — Suíte parcial por task

**Objetivo:** o E3 roda o subconjunto afetado; o E4 exige a execução completa.

**Tasks:** T-02.04, T-02.05, T-02.06

**Critério de saída:** o enum `suite` inclui `parcial`, o `03-fix.md` manda rodar o
subconjunto, o `04-qa.md` exige a completa antes do veredito, e o hook
`task-so-fecha-verde` aceita `parcial` sem barrar — provado por caso novo em `testar.sh`.

**Roda em paralelo com:** F-02.1 e F-02.3.

## F-02.3 — Investigador por evidência

**Objetivo:** delegar ao agente só quando o grep devolver 3 ou mais arquivos.

**Tasks:** T-02.07

**Critério de saída:** o `01-investigacao.md` traz o corte de 3 arquivos, com o que fazer
em cada lado do corte.

**Roda em paralelo com:** F-02.1 e F-02.2.

## F-02.4 — Espelhamento e fechamento

**Objetivo:** espelhar tudo em `.opencode/` e registrar as decisões de projeto.

**Tasks:** T-02.08, T-02.09

**Critério de saída:** `testar-espelho.sh` sai 0, `testar-conteudo.sh` sai 0 e
`testar.sh` sai com 0 falhas.

**Roda em paralelo com:** nenhuma — depende de todas as anteriores.
