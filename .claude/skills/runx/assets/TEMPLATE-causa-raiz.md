---
expx_schema: 1
expx_tool: runx
kind: causa_raiz
trabalho_id: {{OC-ID}}
modo: causa_raiz
comprovada: {{true | false}}
evidencia: {{teste_falho | log | codigo | null}}
arquivos_impactados: [{{caminho/relativo/arquivo.ext}}]
decisoes:
  - id: D-01
    decisao: {{decisao tomada, uma linha}}
    alternativa_descartada: {{alternativa, uma linha}}
    motivo: {{motivo, uma linha}}
atualizado_em: {{AAAA-MM-DD}}
---

> Frontmatter obrigatorio (expx-schema v1). Formato completo em `references/00-schema.md`. Substitua os marcadores; NUNCA omita uma chave — ausente e `null`, lista vazia e `[]`. Sem acento em chave nem em valor de enum. `atualizado_em` e reescrito a cada gravacao.

# Causa raiz — {{OC-ID}} {{título da ocorrência}}

> Usado quando `tipo: bug`. Obrigatório PROVAR a causa, não supor. Hipótese sem prova não passa do E1.

STATUS: {{COMPROVADO | NÃO COMPROVADO}}

## Comportamento atual

{{O que o sistema faz hoje, com evidência: caminho/arquivo.ext:linha.}}

## Comportamento esperado

{{O que deveria acontecer, e por quê — regra de negócio ou contrato que sustenta essa expectativa.}}

## A prova

{{Pelo menos uma das três formas abaixo. Apague as que não usar.}}

**Teste que reproduz e falha:**
```
{{o teste e a saída vermelha, colada}}
```

**Log, stack trace ou query que evidencia o caminho do erro:**
```
{{colado literalmente, não parafraseado}}
```

**Trecho de código identificado:**
```
{{trecho}}
```
`{{caminho/relativo/arquivo.ext}}:{{linha}}` — {{o mecanismo: qual entrada leva a qual desvio, e por que produz a saída errada}}

{{Se STATUS = NÃO COMPROVADO: escreva aqui a hipótese mais forte e, abaixo, exatamente o que falta para comprovar — acesso, log, ambiente, dado de produção. O E2 fica bloqueado enquanto este marcador existir.}}

## Arquivos e módulos impactados

> Esta lista TRAVA o escopo: o que não está aqui não é tocado no E3.

- `{{caminho/relativo/arquivo.ext}}` — {{o que muda nele}}
- `{{caminho/relativo/arquivo.ext}}` — {{o que muda nele}}

## Opções de solução consideradas

| Opção | Trade-off |
|---|---|
| {{opção}} | {{o que ganha, o que perde}} |
| {{opção}} | {{o que ganha, o que perde}} |

## Decisões

> Formato fixo. Não apague decisões: uma decisão revertida ganha nova linha que cita a anterior.

```
D-01 | {{decisão tomada}} | {{alternativa descartada}} | {{motivo}}
```

## Como isso será testado

{{Estratégia de teste que o E2 vai converter em tasks: o teste de regressão que reproduz o problema, e o que os testes de integração e funcional de cada task precisam cobrir.}}
