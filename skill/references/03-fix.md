# E3 — FIX

Você está no E3. A partir de agora você implementa até o fim, sob as regras de autonomia. Você **NÃO pergunta nada**, NÃO pede autorização para nada e NÃO para no meio. Toda a ambiguidade já foi eliminada no E1 e no E2; se você sentir falta de uma decisão, isso é um bloqueio a registrar, nunca uma pergunta a fazer.

## Pré-requisitos verificáveis

- `docs/manutencao/<OC-ID>-<slug>/ORQUESTRADOR.md` existe.
- Se não existe, falta o E2: diga "Falta o E2 (plano). Vou executá-lo primeiro." e execute `references/02-plano.md`.
- Se `base/` não existe, falta o E1: diga "Falta o E1 (investigação). Vou executá-lo primeiro." e execute `references/01-investigacao.md`. Não se implementa fix sem base mapeada e causa comprovada.
- Se `QA.md` existe e contém `VEREDITO: REPROVADO`, leia-o antes de começar: este é um retorno do E4 e cada achado ALTA precisa ser endereçado.

## Passo 1 — Carregar o mapa

Leia `ORQUESTRADOR.md` inteiro e siga a ordem de leitura que ele define. Ele é a fonte da rota, do paralelismo, do caminho crítico, dos comandos e da definição de pronto. Em caso de conflito entre a sua memória da conversa e o ORQUESTRADOR, vale o ORQUESTRADOR.

Se está retomando uma sessão interrompida, siga a seção "Como retomar" do ORQUESTRADOR: o `status` de cada task em `tasks.md` mais `BLOQUEIOS.md` dizem onde você parou.

## Frontmatter: o YAML e a prosa andam juntos

Leia `references/00-schema.md` antes da primeira gravação. Neste estágio a skill escreve em arquivos que já têm frontmatter, e **toda atualização de status acontece nos dois lugares: no frontmatter E na prosa**. Nunca atualize um sem o outro — prosa e YAML divergentes quebram o painel e a retomada de sessão.

Ao mexer no `status` de uma task em `tasks.md`, reescreva no frontmatter:

- `status` da task — `pendente` → `em_andamento` → `concluida` (ou `bloqueada`);
- `concluida_em` — a data (`date +%Y-%m-%d`) ao concluir; `null` enquanto não estiver `concluida`;
- `suite` — `nao_executada` → `verde` ou `vermelha`, conforme a última execução da suíte para aquela task;
- `atualizado_em` do arquivo, a cada gravação.

Ao registrar um bloqueio, acrescente o item à lista `bloqueios:` de `BLOQUEIOS.md` (`kind: bloqueios`) além da linha `B-NN` na prosa, com `resolvido_em: null`.

Ao fechar uma fase ou uma sprint, atualize o `status` correspondente no frontmatter de `fases.md` e de `sprint.md` (`concluido`, vocabulário masculino).

**O `estagio` do `ORQUESTRADOR.md` é atualizado a cada transição de estágio da máquina de estados** — ao entrar no E3, `estagio: e3`; ao entregar para o E4, `estagio: e4`. Reescreva também `atualizado_em`. O campo `concluido_em` do orquestrador só é preenchido no E5.

## Passo 2 — A ordem do TDD, task a task

Ordem de execução: sprints em ordem numérica estrita; dentro da sprint, a rota do ORQUESTRADOR. Só execute em paralelo o que o plano declarou `paralelizavel: true`. Uma task só começa quando todas em `depende_de` estão `concluida`.

Para CADA task, exatamente nesta ordem, sem inverter nenhum passo:

1. Marque `status: em_andamento` em `tasks.md`.
2. **Escreva o teste. Rode. Ele TEM que falhar.** Nenhuma linha de implementação antes de ver o vermelho. Na primeira task da primeira fase, este é o `teste_regressao`: o teste que reproduz o problema.
3. **Implemente o mínimo para o teste passar.** Mínimo é literal: só o que faz o vermelho virar verde. Nada de refactor de brinde, nada de "já que estou aqui" — escopo travado é a regra 8 do SKILL.md.
4. **Escreva os dois testes da task** — `teste_integracao` e `teste_funcional` — exatamente como a task os descreve, e faça-os passar.
5. **Rode a suíte inteira, não só os testes novos.** O comando é o do ORQUESTRADOR. Verde na suíte inteira, não em um subconjunto.
6. Antes de aceitar o verde, responda: **este teste falharia com uma implementação errada?** Se a resposta é não, o teste não discrimina — reescreva-o e volte ao passo 2.
7. Verifique **de fato** o `criterio_aceite` da task — não presuma que ele decorre do teste verde.
8. Só então marque `status: concluida` em `tasks.md` — **no frontmatter e na prosa** — acrescentando na linha da task: data (obtenha com `date +%Y-%m-%d` do sistema, nunca de memória) e resultado da suíte. No YAML, isso significa `status: concluida`, `concluida_em` com a data e `suite: verde`, mais `atualizado_em` reescrito.

Critério de aceite não atendido, ou qualquer teste não passando: a task **NÃO** é concluída. **Não existe "concluído com ressalva".**

## Quando o teste de regressão passa antes do fix

Se o teste de regressão passa **antes** de qualquer implementação, ele não está reproduzindo o problema. Isso significa uma de duas coisas, e as duas invalidam o plano:

- o teste está errado — testa outra coisa, ou outra entrada, ou outro caminho; **ou**
- a causa raiz está errada — o problema não vive onde o `01-CAUSA-RAIZ.md` afirma.

Nos dois casos: **PARE a execução, volte ao E1** e registre isso. Escreva no `01-CAUSA-RAIZ.md` o que foi observado (o teste, a entrada usada, o resultado verde inesperado), reabra a investigação e refaça o E2 se a causa mudar. Nunca ajuste o teste até ele ficar vermelho para poder seguir: isso fabrica uma falha e esconde o defeito real.

## Regra de bloqueio — nunca parar, nunca perguntar

Surgiu dúvida nova, decisão não coberta pelo plano, pré-requisito faltando (segredo inexistente, serviço fora do ar, dependência quebrada, dado de produção indisponível):

1. Registre em `docs/manutencao/<OC-ID>-<slug>/BLOQUEIOS.md`: `B-NN | task | descrição do bloqueio | o que destravaria`.
2. Marque a task como `status: bloqueada` em `tasks.md`.
3. Pule para a próxima task paralelizável cujas dependências estão satisfeitas.
4. **NUNCA pare para esperar resposta humana.** Se não resta nenhuma task executável, encerre com o relatório final — os bloqueios são a pauta do usuário, não uma conversa sua.

## Portões de fase e de sprint

- Fase só é dada como concluída quando seu **critério de saída** em `fases.md` é verdade.
- Sprint só é dada como concluída quando seu **critério de saída** em `sprint.md` é verdade.
- Critério não atendido = **não avança** para a próxima fase/sprint; trate como bloqueio se não houver task que o resolva.
- Entre sprints a execução é sempre sequencial: o paralelismo declarado existe entre tasks e entre fases, nunca entre sprints.

## Passo 3 — Relatório de encerramento do estágio

Ao terminar (tudo concluído, ou nada mais executável), entregue ao usuário um relatório com exatamente estas seções:

1. **Concluído por sprint** — por sprint: tasks concluídas / total, e o que ficou funcionando.
2. **Bloqueios** — o conteúdo de `BLOQUEIOS.md` (ou "nenhum").
3. **Saída da suíte** — o resultado da última execução completa da suíte, colado, não resumido de memória.
4. **Divergências entre o plano e a realidade** — tudo que foi diferente do planejado, uma linha por divergência.

Este relatório é para o usuário na conversa; ele **não** substitui os relatórios do E5.

## Critério de saída do estágio

- [ ] Toda task está `concluida` ou `bloqueada` (nenhuma `pendente`/`em_andamento` executável restante).
- [ ] `tasks.md` atualizado com data e resultado da suíte em cada task concluída.
- [ ] A suíte inteira roda verde.
- [ ] Nenhum arquivo fora da lista de impactados do `01-CAUSA-RAIZ.md` e de `tasks.md` foi alterado.
- [ ] Relatório de encerramento entregue com as 4 seções.
- [ ] Frontmatter e prosa consistentes em todo arquivo tocado: `tasks.md`, `fases.md`, `sprint.md`, `BLOQUEIOS.md` e o `estagio` do `ORQUESTRADOR.md`.

## Ao terminar

Anuncie: "E3 concluído. N tasks concluídas, M bloqueadas. Próximo estágio: E4 QA." Siga para o E4 lendo `references/04-qa.md`.
