---
expx_schema: 1
expx_tool: runx
kind: fases
trabalho_id: {{OC-ID}}
sprint_id: sprint-{{NN}}
atualizado_em: {{AAAA-MM-DD}}
fases:
  - id: F-{{NN}}.{{M}}
    titulo: {{titulo da fase}}
    status: {{nao_iniciado | em_andamento | bloqueado | concluido}}
    criterio_saida: {{condicao verificavel, uma linha}}
    paralelizavel: {{true | false}}
    paralela_com: []
    tasks: [T-{{NN}}.{{MM}}]
---

> Frontmatter obrigatorio (expx-schema v1). Formato completo em `references/00-schema.md`. Substitua os marcadores; NUNCA omita uma chave — ausente e `null`, lista vazia e `[]`. Sem acento em chave nem em valor de enum. `atualizado_em` e reescrito a cada gravacao.

# Fases — Sprint {{NN}}

> Um bloco por fase. Repita o bloco quantas vezes forem necessárias. O paralelismo declarado aqui é definitivo: a execução nunca decide paralelismo sozinha.

---

## F-{{NN}}.{{M}} — {{título da fase}}

**Objetivo:** {{uma frase}}

**Tasks que a compõem:** {{T-NN.MM, T-NN.MM, ...}}

**Critério de saída:** {{condição verificável, binária, sem adjetivo}}

**Roda em paralelo com:** {{F-NN.M | nenhuma}}

---

## F-{{NN}}.{{M}} — {{título da fase}}

**Objetivo:** {{uma frase}}

**Tasks que a compõem:** {{T-NN.MM, ...}}

**Critério de saída:** {{condição verificável, binária, sem adjetivo}}

**Roda em paralelo com:** {{F-NN.M | nenhuma}}
