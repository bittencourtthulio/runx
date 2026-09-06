# Área — A suíte no E3 e no E4

Esta área existe porque o relato do usuário tem um sintoma preciso: "alguma sessão manda
rodar um teste completo no projeto e como a outra está no meio do trabalho alguma coisa
falha". O método diz **quando** a suíte roda; não diz **sobre qual árvore**.

## 1. O que é e onde vive

- `SKILL.md`, regra 9: subconjunto por task no E3 (`suite: parcial`); suíte inteira uma vez no E4
- `references/03-fix.md`, Passo 2 item 5: "Rode o subconjunto afetado pela task"
- `references/04-qa.md`, Passo 2 item 4: "A suíte inteira passa, incluindo o que não foi tocado"
- `references/04-qa.md`, Passo 3: diff contra o escopo declarado
- `.claude/hooks/comum/rastro-suite.py`: registra a execução, não a condiciona

## 2. O que o E4 verifica antes de rodar a suíte (evidência)

Pré-requisitos do `04-qa.md`: "toda task em `concluida` ou `bloqueada`". Só isso. Em
seguida o Passo 2 item 4 manda rodar o comando do ORQUESTRADOR e colar a saída.

O Passo 3 levanta `git status --porcelain` e `git diff --name-only`, mas **depois** da
suíte, e para conferir escopo: "arquivo no diff que não está na lista autorizada → achado
ALTA (escopo estourado)". Um arquivo sujo de **outra** ocorrência entra nesse achado como se
fosse refactor de brinde desta — o diagnóstico sai errado e o veredito sai REPROVADO.

## 3. O que acontece com o veredito contaminado (evidência)

`04-qa.md`, "Quando o veredito é REPROVADO": grava `fase: e3`, registra
`fase_iniciada --resultado reprovado --detalhe "retorno do E4"` e volta ao E3. O SKILL.md
apresenta essa contagem como "a que revela qualidade de plano, porque plano ruim gera volta".
Uma volta causada por trabalho alheio na mesma árvore **polui a métrica** que o método usa
para se avaliar.

## 4. A lista autorizada, já calculada em dois lugares

`escopo-da-ocorrencia.py::autorizados()` e o Passo 3 do E4 montam a mesma união:
`arquivos_impactados` do `01-CAUSA-RAIZ.md` + `arquivos.cria`/`altera` de todas as tasks,
com os artefatos do método (`docs/manutencao`, `docs/relatorios`, `docs/eventos`, `.expx/`)
e os arquivos de teste sempre livres (`LIVRE`, `TESTE`). Um portão de árvore limpa reaproveita
`autorizados()` sem reescrever nada: sujo **e** fora dessa lista = contaminação.

## 5. Subconjunto no E3 (evidência)

`03-fix.md` item 5: rodar "os testes que ela criou ou alterou, mais os que cobrem os
arquivos em `arquivos.cria` e `arquivos.altera`". Duas sessões na mesma ocorrência, em tasks
declaradas `paralelizavel: true`, têm por contrato arquivos disjuntos (checklist do
`02-plano.md`: "task com `paralelizavel: true` não escreve nos mesmos arquivos de outra task
paralela"). O subconjunto de uma não cobre os arquivos da outra. **O risco real está na suíte
inteira, não no subconjunto.**

## 6. Riscos desta área para o plano

| Risco | Severidade | Onde é tratado |
|---|---|---|
| Suíte inteira rodada sobre árvore com trabalho de outra sessão → REPROVADO falso → volta ao E3 falsa | ALTA | D-11, D-12 |
| `suite_executada` sem `HEAD` nem arquivos sujos: impossível auditar depois | MÉDIA | D-13 |
