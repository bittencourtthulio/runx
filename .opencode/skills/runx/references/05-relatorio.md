# E5 — RELATÓRIO E FECHAMENTO

Você está no E5, o último estágio. Você grava os dois relatórios, atualiza o índice e encerra a ocorrência. Neste estágio você não altera código, não altera testes e não altera o plano.

## Pré-requisitos verificáveis

- `docs/manutencao/<OC-ID>-<slug>/QA.md` existe e contém `VEREDITO: APROVADO`.
- Se contém `VEREDITO: REPROVADO`, PARE: volte para o E3 (`references/03-fix.md`). Ocorrência reprovada não fecha.
- Se `QA.md` não existe, falta o E4: diga "Falta o E4 (QA)." e execute `references/04-qa.md`.

## Passo 1 — Criar a pasta do relatório

Obtenha a data de fechamento com `date +%Y-%m-%d` do sistema, nunca de memória. Crie:

```
docs/relatorios/<AAAA-MM-DD>-<OC-ID>-<slug>/
  tecnico.md
  uso.md
```

O `<slug>` é **o mesmo** usado em `docs/manutencao/` — as duas árvores compartilham o slug. A data é a de fechamento, para que uma listagem simples da pasta devolva a linha do tempo do sistema.

**Nada em `docs/manutencao/` é apagado ou movido.** O trabalho em andamento permanece no repositório; a limpeza é decisão do usuário. Os relatórios são cópia destilada, não recorte.

## Passo 2 — Escrever o `tecnico.md`

**Frontmatter:** grave com `kind: relatorio_tecnico`, no formato de `references/00-schema.md` — leia-o antes de gravar. `fechado_em` é a data de fechamento (a mesma do nome da pasta), `arquivos_alterados` espelha a seção 8 e `testes_adicionados` é a contagem de testes criados, incluindo o de regressão.

Leitor: **o próximo desenvolvedor que abrir este código.** Pode usar nome de arquivo, função, tabela e jargão à vontade — é para isso que ele existe. Use `assets/TEMPLATE-relatorio-tecnico.md`, com estas seções:

1. **Ocorrência e tipo**
2. **Sintoma relatado**
3. **Base do que foi mapeado, em resumo** — destilada de `base/`, com os caminhos
4. **Causa raiz ou análise de impacto** — de `01-CAUSA-RAIZ.md`, com a prova
5. **Solução aplicada**
6. **Decisão técnica e alternativas descartadas** — as linhas `D-NN`
7. **Sprints, fases e tasks executadas**
8. **Arquivos alterados** — caminhos relativos
9. **Testes adicionados, incluindo o de regressão**
10. **Risco residual** — inclua aqui os achados MÉDIA/BAIXA de `QA.md` que permanecem válidos
11. **O que observar em produção**
12. **Sugestões de novas ocorrências percebidas e não feitas** — tudo que foi visto e deliberadamente não tocado por estar fora de escopo (regra 8). Sugestão, nunca implementação.

## Passo 3 — Escrever o `uso.md`

**Frontmatter:** grave com `kind: relatorio_uso`, no formato de `references/00-schema.md`. Ele NÃO leva `arquivos_alterados` nem `testes_adicionados`: **as regras de linguagem abaixo valem também dentro do YAML** — nenhum nome de arquivo, de função, de tabela ou de coluna entra no frontmatter deste arquivo. `titulo` e `modulo_afetado` vão em linguagem de cliente.

Leitor: **o suporte copia este texto e devolve ao cliente.** Use `assets/TEMPLATE-relatorio-uso.md`, com estas quatro seções:

1. **O que estava acontecendo**
2. **O que muda a partir de agora**
3. **Se é preciso fazer algo diferente**
4. **Se é preciso refazer alguma coisa que ficou errada no período**

### Regras duras de linguagem deste arquivo

- **Sem nome de arquivo. Sem nome de função. Sem nome de tabela ou de coluna. Sem nome de variável.**
- **Sem jargão técnico** — nada de banco de dados, endpoint, API, cache, migração, deploy, commit, branch, teste unitário, regressão, null, timeout, log.
- **Sem stack trace, sem trecho de código, sem mensagem de erro bruta.**
- **Sem identificador interno** — número de task, nome de sprint, código de commit.
- **Frases curtas.** Uma ideia por frase.
- Fale do que a pessoa vê e faz no sistema: a tela, o botão, o valor que aparecia errado, o que ela precisa conferir.
- Se a seção 3 ou 4 não se aplica, escreva a frase de dispensa em linguagem de cliente — "Não é preciso fazer nada diferente." / "Nada precisa ser refeito." — nunca "N/A" nem "não aplicável".

**Teste final obrigatório antes de salvar:** releia o `uso.md` inteiro perguntando *"um cliente que não é desenvolvedor entenderia cada frase?"*. Se qualquer frase falha, reescreva. Se uma frase só funciona com um termo técnico, o problema é a frase — descreva o efeito visível em vez do mecanismo.

## Passo 4 — Atualizar o `INDICE.md`

`docs/relatorios/INDICE.md` é **append-only**: uma linha por ocorrência, **mais recente no topo**. Nunca reescreva, reordene nem apague linhas existentes.

**A ocorrência entra nos DOIS lugares, na mesma gravação:** um item novo no topo da lista `entradas:` do frontmatter (`kind: relatorios_indice`, formato em `references/00-schema.md`) **e** a linha nova no topo da tabela em prosa. Os dois carregam a mesma informação e nunca divergem. Este kind não leva `trabalho_id` — o índice é do sistema inteiro, não de uma ocorrência. Se o `INDICE.md` já existe sem frontmatter, acrescente-o agora inferindo as entradas das linhas da tabela existente, sem reescrever a prosa (regra de migração).

1. Se `INDICE.md` não existe, crie-o de `assets/TEMPLATE-INDICE.md` com o cabeçalho da tabela.
2. Insira a nova linha **imediatamente abaixo do cabeçalho da tabela**, empurrando as anteriores para baixo.
3. Formato das colunas, nesta ordem:

```
| data | OC-ID | tipo | módulo afetado | resumo em uma linha | link |
```

- `data` — a data de fechamento, a mesma do nome da pasta.
- `tipo` — um dos tipos de ocorrência do SKILL.md.
- `módulo afetado` — a área principal, em linguagem do sistema.
- `resumo em uma linha` — o que mudou, sem jargão pesado; esta coluna é lida por quem varre o histórico.
- `link` — caminho relativo para a pasta do relatório.

## Passo 5 — Encerrar

O deploy é externo: runx **registra** que a correção está liberada, não executa o deploy. Se o usuário informar que o deploy foi feito, registre isso em uma linha no `tecnico.md`, seção "O que observar em produção".

## Critério de saída do estágio

- [ ] `docs/relatorios/<AAAA-MM-DD>-<OC-ID>-<slug>/tecnico.md` existe com as 12 seções.
- [ ] `docs/relatorios/<AAAA-MM-DD>-<OC-ID>-<slug>/uso.md` existe com as 4 seções e passa no teste de linguagem.
- [ ] `docs/relatorios/INDICE.md` tem a nova entrada no topo da lista `entradas:` do frontmatter E a nova linha no topo da tabela em prosa, com as 6 colunas, e nenhuma entrada anterior foi alterada.
- [ ] `tecnico.md`, `uso.md` e `INDICE.md` gravados com o frontmatter de `references/00-schema.md`; o de `uso.md` sem nome de arquivo, função ou tabela.
- [ ] `ORQUESTRADOR.md` com `estagio: e5`, `status: concluido` e `concluido_em` preenchido com a data de fechamento.
- [ ] Nada em `docs/manutencao/` foi apagado ou movido.

## Quando o critério não é atendido

Complete o que falta neste estágio. Se o `uso.md` não passa no teste de linguagem, reescreva-o quantas vezes forem necessárias — um relatório de uso com jargão é um relatório que o suporte não pode enviar.

## Ao terminar

Anuncie: "E5 concluído. Ocorrência `<OC-ID>` encerrada. Relatórios em `docs/relatorios/<AAAA-MM-DD>-<OC-ID>-<slug>/` e `INDICE.md` atualizado." Entregue ao usuário, na conversa, o conteúdo do `uso.md` — é o texto que o suporte vai enviar ao cliente.
