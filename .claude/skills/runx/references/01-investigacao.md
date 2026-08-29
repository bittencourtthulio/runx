# E1 — INVESTIGAÇÃO

Você está no E1. Este estágio tem duas metades, nesta ordem: **E1.a base de conhecimento**, depois **E1.b causa raiz ou análise de impacto**. Você não planeja nada e não escreve nenhum código de implementação neste estágio.

## Delegue ao agente `investigador`, quando ele existir

A investigação lê muito — código, chamadores, migrações, testes existentes. Em contexto próprio, essa leitura não consome o contexto que depois vai implementar.

**Se o agente `investigador` estiver disponível, delegue a ele as duas metades deste estágio.** Passe: o caminho da pasta da ocorrência, o `00-OCORRENCIA.md` já preenchido (Passo 0 é sempre seu, não dele) e o tipo classificado. Ele devolve o conteúdo dos arquivos da `base/`, do `00-INDICE.md`, do `00-LACUNAS.md` e do `01-CAUSA-RAIZ.md` — prontos, mas **não gravados**: ele não tem ferramenta de escrita. Quem grava é você, com o frontmatter de `references/00-schema.md`.

Ao receber o retorno, confira antes de gravar:

- toda afirmação de comportamento aponta para arquivo e linha;
- o que ficou sem prova está como `NÃO DETERMINADO`, não preenchido com suposição;
- em `tipo: bug`, ou existe uma das três provas, ou o status é `NÃO COMPROVADO` com o que falta declarado.

Se o agente devolver `comprovada: false`, **respeite**: grave assim, com `STATUS: NÃO COMPROVADO`, e pare. Não complete a lacuna com a sua própria hipótese para desbloquear o fluxo — plano construído sobre causa errada gasta uma rodada inteira de E3 e E4 para descobrir isso.

Registre no rastro ao delegar e ao receber:

```
python3 .claude/runx-hooks/comum/rastro.py --evento agente_iniciado  --agente investigador --fase e1
python3 .claude/runx-hooks/comum/rastro.py --evento agente_concluido --agente investigador --fase e1 \
  --resultado <comprovada|nao_comprovada|impacto_mapeado> --detalhe "N arquivos de base, M lacunas"
```

**Sem o agente disponível, execute você mesmo tudo o que segue** — o método é idêntico, muda só quem carrega a leitura.

## Pré-requisitos verificáveis

- A ocorrência chegou (texto colado, identificador de ticket ou caminho de arquivo).
- O `<OC-ID>` e o `<slug>` estão definidos pelas regras do SKILL.md.

Se `docs/manutencao/<OC-ID>-<slug>/base/` já existe completa e `01-CAUSA-RAIZ.md` também existe, o E1 já passou: anuncie o estágio real detectado pela máquina de estados e execute-o em vez deste.

---

## Passo 0 — Registrar a ocorrência

Crie o scaffold, se ainda não existir:

```
docs/manutencao/<OC-ID>-<slug>/
  00-OCORRENCIA.md     preenchido agora, de assets/TEMPLATE-ocorrencia.md
  BLOQUEIOS.md         apenas o título "# Bloqueios" e "Nenhum bloqueio registrado." — preenchido no E3
  base/
    00-INDICE.md       título + lista (vazia por enquanto) dos arquivos da base
    00-LACUNAS.md      título + "Nenhuma lacuna registrada."
```

**Frontmatter:** `00-OCORRENCIA.md` é gravado com `kind: ocorrencia` e `base/00-INDICE.md` com `kind: base_indice`, no formato de `references/00-schema.md` — leia-o antes de gravar. `BLOQUEIOS.md` nasce com `kind: bloqueios` e `bloqueios: []`. Os arquivos de área da base e `00-LACUNAS.md` NÃO levam frontmatter.

Preencha `00-OCORRENCIA.md` pelo contrato de entrada do SKILL.md. O relato do cliente é **copiado literalmente**, sem reescrever, sem corrigir, sem resumir. Se não houver identificador, gere `OC-<AAAA>-<NNNN>` sequencial olhando `docs/manutencao/` e `docs/relatorios/` — obtenha o ano com `date +%Y` do sistema, nunca de memória.

**Classifique o tipo** pela lista do SKILL.md. Se ambíguo, escolha o mais provável, registre a escolha em uma linha no próprio `00-OCORRENCIA.md` e siga sem esperar confirmação.

**Portão único de pergunta deste estágio:** se `tipo: bug` e não houver passos de reprodução nem evidência suficiente para investigar (nenhum log, nenhuma mensagem de erro, nenhum dado concreto), PARE e pergunte isso — e apenas isso. Investigar bug sem reprodução é chute. Para os demais tipos, siga com o que houver.

---

# E1.a — BASE DE CONHECIMENTO

Antes de opinar sobre a causa, mapeie o pedaço do sistema que a ocorrência toca. Leia o código **de verdade** — nunca descreva de memória nem por suposição.

## Por onde começar a busca, a partir do relato

Extraia do relato os termos concretos: nome de tela, rótulo de campo, nome de botão, mensagem de erro, nome de relatório, valor numérico divergente, nome de entidade de negócio. Esses termos são as âncoras da busca.

1. **Grep pelos termos literais** do relato no repositório — rótulos de tela e mensagens de erro costumam existir textualmente no código, em templates ou em arquivos de tradução.
2. **Do rótulo ao componente:** o arquivo que contém o texto é a ponta da linha; suba dele para o componente/controller que o renderiza.
3. **Do componente à regra:** siga do componente para onde o valor é calculado ou persistido — service, use case, model, procedure.
4. **Do nome de negócio ao schema:** grep pelo nome da entidade em migrações, models e definições de schema para achar a tabela real.
5. Quando o relato traz um número divergente, busque também a **fórmula**: nomes de operação, constantes e faixas/limites citados no relato.

Se o grep pelos termos do relato não devolve nada, registre isso em `base/00-LACUNAS.md` e amplie: procure por sinônimos, pelo termo em inglês, e pela rota/endpoint que a tela chama.

## Como seguir chamadores e dependências

Para cada função ou módulo central que você encontrar:

- **Quem chama:** grep pelo nome da função/classe/endpoint em todo o repositório. Registre cada chamador com caminho e linha — telas, jobs, endpoints, relatórios, integrações, testes.
- **Quem é chamado:** leia o corpo da função e liste o que ela invoca, especialmente o que atravessa fronteira (banco, fila, HTTP, cache, arquivo).
- Pare de subir a cadeia de chamadores quando chegar a um ponto de entrada (rota, comando, job agendado, handler de evento). Esse ponto de entrada é fronteira do mapa.

## Como localizar estrutura de tabela e migrações

- Procure a definição do schema onde o projeto a mantiver: pasta de migrações, arquivo de schema declarativo, definição de model/ORM.
- Registre, da tabela envolvida: **colunas com tipo, chaves, índices e constraints**. Tipo de coluna importa — divergência de arredondamento e truncamento costuma morar aí.
- Quando possível, inclua **um exemplo real de registro**. Se não houver acesso a dado real, escreva `NÃO DETERMINADO` — nunca invente um registro plausível.
- Registre também migrações recentes que tocaram a tabela: uma mudança de tipo ou de default é candidata frequente a causa.

## Como identificar os testes existentes

- Localize a pasta de testes e o padrão de nomenclatura do projeto.
- Para cada arquivo da base, responda: **o que já é coberto e o que não é.** Cite o arquivo de teste e o caso.
- Registre o **comando de teste do projeto** (do package manager, Makefile ou config) — o E2 vai precisar dele para o ORQUESTRADOR.

## Quando parar de mapear

Mapeie **só o que a ocorrência toca**, não o sistema todo. Pare quando:

- todo termo do relato tem arquivo e linha correspondentes;
- a cadeia de chamadores de cada ponto central chegou a um ponto de entrada;
- a estrutura de dados envolvida está descrita;
- você consegue explicar o comportamento atual apontando para código, sem lacuna no caminho.

Um módulo que só é vizinho, e que a ocorrência não toca, não entra na base. Base inflada atrasa o fix e não protege ninguém.

## Formato de cada arquivo da base

Um arquivo por área impactada em `base/`, usando `assets/TEMPLATE-base-area.md` (caminho relativo à raiz da skill), com exatamente estas seções:

1. **O que é e onde vive** — arquivos e caminhos, com linha quando fizer sentido.
2. **Contrato de entrada** — parâmetros, payload, campos de formulário: nome, tipo, obrigatoriedade, validação existente.
3. **Contrato de saída** — retorno, resposta, efeito colateral, o que é persistido.
4. **Estrutura de dados** — tabelas e colunas envolvidas, tipos, chaves, índices, constraints, e um exemplo real de registro quando possível.
5. **Funções e trechos relevantes** — assinaturas e trechos de código citados textualmente, com caminho e linha.
6. **Quem chama e quem é chamado** — chamadores e dependências: telas, jobs, endpoints, relatórios, integrações.
7. **Testes existentes** — o que já é coberto e o que não é.
8. **Limites e regras de negócio conhecidas**
9. **Riscos para esta ocorrência**
10. **Fonte** — caminhos de arquivo e, quando houver, documentação interna.

## Regras duras desta metade

- **Nada de invenção.** Se o código não deixa claro, escreva literalmente `NÃO DETERMINADO` — nunca preencha com o que "deve ser".
- **Toda afirmação sobre comportamento aponta para arquivo e linha.**
- **Proibido escrever código de implementação nesta metade.** Trechos citados do código existente são permitidos; código novo, não.

## Fechamento do E1.a

Feche com os dois arquivos:

- `base/00-INDICE.md` — frontmatter `kind: base_indice` (uma entrada em `areas:` por arquivo da base, com `arquivo`, `titulo` e `lacunas`) e, abaixo, a lista dos arquivos criados, uma linha de resumo cada.
- `base/00-LACUNAS.md` — tudo que ficou `NÃO DETERMINADO`, com **o impacto de cada lacuna sobre o plano** (o que não poderá ser planejado, ou o que será planejado sobre suposição). Marque como **bloqueante** a lacuna sem a qual o plano não pode ser escrito.

---

# E1.b — CAUSA RAIZ OU ANÁLISE DE IMPACTO

Mesmo arquivo, mesma posição no fluxo, conteúdo determinado pelo tipo. Escreva em `docs/manutencao/<OC-ID>-<slug>/01-CAUSA-RAIZ.md`.

**Frontmatter:** grave com `kind: causa_raiz`, no formato de `references/00-schema.md`. `modo: causa_raiz` quando `tipo_ocorrencia: bug`; `modo: analise_impacto` nos demais tipos — e então `comprovada` e `evidencia` vão como `null`, com as chaves presentes. As decisões `D-NN` da prosa entram também na lista `decisoes:` do YAML.

## Se `tipo: bug` → CAUSA RAIZ

Use `assets/TEMPLATE-causa-raiz.md`.

**Obrigatório provar a causa, não supor.** Prova aceita é uma destas três:

1. **Um teste que reproduz o problema e falha** — a prova mais forte. Escreva-o e rode-o.
2. **Um log, stack trace ou query que evidencia o caminho do erro** — colado literalmente, não parafraseado.
3. **O trecho de código identificado, com a linha e o porquê** — o mecanismo explicado: qual entrada leva a qual desvio, e por que produz a saída errada.

Hipótese sem prova **não passa deste estágio**.

Se depois de investigar a prova não aparecer: escreva a hipótese mais forte, marque o arquivo com a linha literal `STATUS: NÃO COMPROVADO` e **pare**, informando exatamente o que falta (acesso, log, ambiente, dado de produção). O E2 está bloqueado enquanto esse marcador existir.

Com prova obtida, marque a linha literal `STATUS: COMPROVADO`.

## Se `tipo` ≠ `bug` → ANÁLISE DE IMPACTO

Use `assets/TEMPLATE-analise-impacto.md`. Não force uma causa raiz que não existe — não há defeito a explicar, há mudança a dimensionar. O arquivo cobre:

- **Como o sistema se comporta hoje**, com evidência no código (arquivo e linha).
- **O que exatamente muda.**
- **O que pode quebrar junto:** chamadores, telas, relatórios, integrações, migrações, cache.
- **O comportamento esperado depois da mudança.**
- Para `melhoria-ui` e `melhoria-ux`: **qual é o critério visual ou de fluxo que define "certo"**, já que não há teste automático que julgue estética. O critério precisa ser observável e binário — uma condição que qualquer pessoa consegue verificar olhando a tela em uma condição declarada (viewport, estado, papel de usuário), não um juízo de gosto. Esse critério é a matéria-prima do `criterio_aceite` das tasks do E2.

Marque a linha literal `STATUS: IMPACTO MAPEADO`.

## Fechamento comum aos dois modos

Em ambos os modos o arquivo termina com:

1. **Arquivos e módulos impactados**, listados nominalmente com caminho relativo. Esta lista trava o escopo: o que não está aqui não é tocado no E3.
2. **Opções de solução consideradas**, com o trade-off de cada uma.
3. **A decisão tomada e o motivo**, no formato fixo, uma linha por decisão:

```
D-NN | decisão tomada | alternativa descartada | motivo
```

Esta lista é o registro de decisão da ocorrência — o equivalente ao `00-DECISOES.md` da `sprintx`. Não apague decisões: uma decisão revertida ganha nova linha que cita a anterior.

4. **Como isso será testado** — a estratégia de teste que o E2 vai converter em tasks.

## Critério de saída do estágio

- [ ] `00-OCORRENCIA.md` existe com todos os campos do contrato de entrada e o relato preservado literalmente.
- [ ] Toda área impactada tem arquivo em `base/` no template fixo, com as 10 seções.
- [ ] `base/00-INDICE.md` lista todos os arquivos da base.
- [ ] `base/00-LACUNAS.md` registra tudo que ficou `NÃO DETERMINADO`, com impacto e marcação de bloqueante.
- [ ] `01-CAUSA-RAIZ.md` existe com `STATUS: COMPROVADO` (bug) ou `STATUS: IMPACTO MAPEADO` (demais tipos).
- [ ] O arquivo lista arquivos impactados, opções, decisões D-NN e estratégia de teste.
- [ ] Nenhum campo inventado; toda afirmação de comportamento aponta para arquivo e linha.
- [ ] `00-OCORRENCIA.md`, `base/00-INDICE.md`, `BLOQUEIOS.md` e `01-CAUSA-RAIZ.md` gravados com o frontmatter de `references/00-schema.md`, validado pela checklist daquele arquivo.

## Quando o critério não é atendido

Continue investigando até atender. Se a prova de um bug não aparece, encerre com `STATUS: NÃO COMPROVADO` e informe o que falta — não avance para o E2 e não invente uma causa plausível para desbloquear o fluxo.

## Ao terminar

Anuncie: "E1 concluído. Base em `docs/manutencao/<OC-ID>-<slug>/base/` (N arquivos, M lacunas). Causa raiz COMPROVADA / impacto mapeado. Próximo estágio: E2 PLANO." Em seguida, se a sessão continuar, entre no E2 lendo `references/02-plano.md`.
