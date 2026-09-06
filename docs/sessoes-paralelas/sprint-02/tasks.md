---
expx_schema: 1
expx_tool: sprintx
kind: tasks
trabalho_id: sessoes-paralelas
sprint_id: sprint-02
atualizado_em: 2026-09-06
tasks:
  - id: T-02.01
    titulo: SKILL.md - regra 16, secao Sessoes paralelas, hooks novos e identidade no rastro
    fase: F-02.1
    status: concluida
    objetivo: Fazer o texto central da skill declarar a regra e os mecanismos que os tres harnesses vao seguir
    arquivos:
      cria: []
      altera: [.claude/skills/runx/SKILL.md]
    teste_integracao: Roda testar-conteudo.sh e confere que regras-continuam-16, regra-16-cita-worktree, skill-secao-sessoes-paralelas, skill-tabela-hooks-novos e skill-rastro-sessao-harness passam
    teste_funcional: Dada a secao Regras invioláveis, grep de linhas numeradas conta 16 e a linha 16 contem worktree; dada a tabela de hooks, ela tem nove linhas de hook
    criterio_aceite: As cinco asercoes citadas passam e nenhuma das 19 anteriores regride
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.02
    titulo: Schema, template da ocorrencia e 06-estado - a chave worktree e a heranca de .expx
    fase: F-02.1
    status: concluida
    objetivo: Declarar onde o caminho do worktree e gravado e dizer que .expx/ e copiado do principal, nunca inventado
    arquivos:
      cria: []
      altera: [.claude/skills/runx/references/00-schema.md, .claude/skills/runx/assets/TEMPLATE-ocorrencia.md, .claude/skills/runx/references/06-estado.md]
    teste_integracao: Roda testar-conteudo.sh e confere que schema-ocorrencia-worktree e template-ocorrencia-worktree passam e que a asercao de marcador vazado continua passando
    teste_funcional: Dado o bloco do kind ocorrencia no 00-schema.md, ele tem a chave worktree com exemplo relativo e a regra null sem git ou com opt-out; dado o 06-estado.md, a secao Se .expx nao existir diz que num worktree ele e copiado do checkout principal
    criterio_aceite: As duas asercoes passam; grep -c 'worktree' em 06-estado.md e maior que zero; nenhum {{ vazado
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.03
    titulo: E1 - Passo 0.a uma ocorrencia por arvore e Passo 0.b abrir a area de trabalho
    fase: F-02.1
    status: concluida
    objetivo: Ensinar o E1 a nascer em worktree proprio, na branch da mergex, herdando o local e instalando dependencias, e a entrar nele em cada harness
    arquivos:
      cria: []
      altera: [.claude/skills/runx/references/01-investigacao.md]
    teste_integracao: Roda testar-conteudo.sh e confere que e1-passo-worktree e e1-uma-por-arvore passam
    teste_funcional: Dado o Passo 0.b, ele contem git worktree add -b, a ordem de base da mergex, a tabela de lockfiles, a lista fechada de arquivos herdados, a instrucao EnterWorktree com path para o Claude Code e a frase de opt-out sem worktree
    criterio_aceite: As duas asercoes passam; o passo nao contem caminho absoluto; o passo diz literalmente que sem git nada muda
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.04
    titulo: E3 - eventos de task no rastro e verificacao de reivindicacao
    fase: F-02.1
    status: concluida
    objetivo: Fazer o E3 registrar quem abriu e fechou cada task e desviar de task reivindicada por outra sessao
    arquivos:
      cria: []
      altera: [.claude/skills/runx/references/03-fix.md]
    teste_integracao: Roda testar-conteudo.sh e confere que e3-task-iniciada e e3-reivindicacao passam
    teste_funcional: Dado o Passo 2, ele traz os comandos rastro.py --evento task_iniciada, task_concluida e task_bloqueada com --task, e diz que task reivindicada por outra sessao e pulada para a proxima paralelizavel ou vira bloqueio
    criterio_aceite: As duas asercoes passam; a checklist de saida do E3 ganha o item de que toda task concluida tem task_iniciada e task_concluida no rastro
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.05
    titulo: E4 - Passo 0 arvore pronta para a suite
    fase: F-02.1
    status: concluida
    objetivo: Impedir que a suite inteira rode sobre arvore com trabalho de outra sessao e que isso vire REPROVADO falso
    arquivos:
      cria: []
      altera: [.claude/skills/runx/references/04-qa.md]
    teste_integracao: Roda testar-conteudo.sh e confere que e4-portao-arvore passa
    teste_funcional: Dado o Passo 0, ele manda comparar git status --porcelain com a lista autorizada e o rastro, e diz que com arvore contaminada a suite nao roda, o QA.md nao e gravado e nenhum veredito sai
    criterio_aceite: A asercao passa; o Passo 2 item 4 referencia o Passo 0; o comando de rastro do veredito continua identico ao atual
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.06
    titulo: E2 e E5 - area de trabalho no ORQUESTRADOR e no relatorio tecnico
    fase: F-02.1
    status: concluida
    objetivo: Deixar registrado, para quem chega depois, onde a ocorrencia vive e que o worktree nao e removido pela skill
    arquivos:
      cria: []
      altera: [.claude/skills/runx/references/02-plano.md, .claude/skills/runx/assets/TEMPLATE-ORQUESTRADOR.md, .claude/skills/runx/references/05-relatorio.md]
    teste_integracao: Roda testar-conteudo.sh e confere que e2-orq-area-de-trabalho passa e que nenhum marcador vazou
    teste_funcional: Dada a secao 4 do template, ela tem a linha Area de trabalho com as duas alternativas (caminho do worktree ou checkout principal); dado o 05-relatorio.md, o relatorio tecnico registra a area e diz que a skill nunca remove worktree nem branch
    criterio_aceite: A asercao passa; a secao 8 do template diz que a retomada acontece de dentro da area de trabalho
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.07
    titulo: Biblioteca comum - raiz em worktree, sessao e harness, extras no rastro
    fase: F-02.2
    status: concluida
    objetivo: Fazer expx_rastro reconhecer .git arquivo, descobrir a identidade da sessao e grava-la depois das doze chaves
    arquivos:
      cria: []
      altera: [.claude/hooks/comum/expx_rastro.py, .claude/hooks/comum/rastro.py, .claude/hooks/testes/testar.sh]
    teste_integracao: Roda testar.sh e confere que raiz-em-worktree passa e que os casos novos sessao-por-env, sessao-por-payload, sessao-por-ancestral e extras-depois-das-doze passam
    teste_funcional: Dado EXPX_SESSAO=opencode@abc, a linha gravada termina com sessao opencode@abc e harness opencode apos a chave arquivos; sem nenhuma variavel nem payload, sessao casa o padrao nome@pid
    criterio_aceite: bash .claude/hooks/testes/testar.sh sai 0 falhas com pelo menos 64 casos, e o JSON gravado mantem as doze chaves na ordem do contrato antes das duas extras
    depende_de: []
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.08
    titulo: Hook uma-ocorrencia-por-arvore
    fase: F-02.2
    status: concluida
    objetivo: Avisar quando um 00-OCORRENCIA.md novo e gravado numa raiz que ja tem outra ocorrencia aberta
    arquivos:
      cria: [.claude/hooks/runx/uma-ocorrencia-por-arvore.py]
      altera: [.claude/hooks/testes/testar.sh, .claude/hooks/testes/testar-falsos-positivos.sh]
    teste_integracao: Roda testar.sh e testar-falsos-positivos.sh com os casos do hook e confere 0 falhas
    teste_funcional: Dado um Write em docs/manutencao/OC-2026-0200-x/00-OCORRENCIA.md com OC-2026-0142 aberta na mesma raiz, sai 0 com aviso no stderr; dado o mesmo Write quando a 0142 esta concluida, ou quando o Write e na propria 0142, sai 0 sem stderr
    criterio_aceite: testar.sh sai 0 falhas com pelo menos 67 casos; testar-falsos-positivos.sh sai 0 falhas com pelo menos 40 casos; o hook em modo bloqueio sai 2
    depende_de: [T-02.07]
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.09
    titulo: Hook task-reivindicada
    fase: F-02.2
    status: concluida
    objetivo: Avisar quando uma sessao marca em_andamento uma task que o rastro mostra aberta por outra sessao
    arquivos:
      cria: [.claude/hooks/runx/task-reivindicada.py]
      altera: [.claude/hooks/testes/testar.sh, .claude/hooks/testes/testar-falsos-positivos.sh]
    teste_integracao: Roda testar.sh e testar-falsos-positivos.sh com os casos do hook e confere 0 falhas
    teste_funcional: Dado um rastro com task_iniciada de T-01.02 pela sessao claude-code@1 sem fechamento, uma escrita em tasks.md pondo T-01.02 em em_andamento vinda da sessao opencode@2 sai 0 com aviso; a mesma escrita vinda de claude-code@1, ou com task_concluida posterior, ou sem rastro, sai 0 sem stderr
    criterio_aceite: testar.sh sai 0 falhas com pelo menos 71 casos; testar-falsos-positivos.sh com pelo menos 42; o hook nunca le o rastro alem do arquivo do trabalho atual
    depende_de: [T-02.08]
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.10
    titulo: Hook arvore-limpa-antes-da-suite e HEAD no rastro-suite
    fase: F-02.2
    status: concluida
    objetivo: Avisar antes de um comando de suite quando ha arquivo sujo fora do escopo ou task de outra sessao em andamento, e deixar a execucao auditavel
    arquivos:
      cria: [.claude/hooks/runx/arvore-limpa-antes-da-suite.py]
      altera: [.claude/hooks/comum/rastro-suite.py, .claude/hooks/testes/testar.sh, .claude/hooks/testes/testar-falsos-positivos.sh]
    teste_integracao: Roda testar.sh e testar-falsos-positivos.sh com os casos do hook e confere 0 falhas; o caso do rastro-suite confere que detalhe traz o HEAD curto e sujos_fora_escopo
    teste_funcional: Dado npm test com src/outro/modulo.ts modificado e fora do escopo, sai 0 com aviso listando o arquivo; dado o mesmo comando com so src/frete/calculo.ts (no escopo) ou um arquivo de teste sujo, sai 0 sem stderr; dado ls, nao roda; sem repositorio git, sai 0 sem stderr
    criterio_aceite: testar.sh sai 0 falhas com pelo menos 77 casos; testar-falsos-positivos.sh com pelo menos 45; o hook reutiliza autorizados() do escopo-da-ocorrencia sem copiar a funcao
    depende_de: [T-02.09]
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
  - id: T-02.11
    titulo: Registro dos hooks novos - hooks.json, exemplo e doctor
    fase: F-02.2
    status: concluida
    objetivo: Ligar os tres hooks ao harness pelo despachante, criar o grupo PreToolUse Bash e faze-los aparecer no diagnostico
    arquivos:
      cria: []
      altera: [.claude/hooks/hooks.json, .claude/hooks/hooks.exemplo.json, .claude/hooks/comum/doctor.py, .claude/hooks/testes/testar.sh]
    teste_integracao: Roda o despachante com as listas do hooks.json novo contra a fixture e confere que os sete hooks do grupo Write|Edit rodam num processo so e que o grupo PreToolUse Bash existe
    teste_funcional: Dado python3 doctor.py, a tabela lista nove hooks e os tres novos em aviso; dado hooks.json, existe um grupo PreToolUse com matcher Bash apontando para runx/arvore-limpa-antes-da-suite
    criterio_aceite: testar.sh sai 0 falhas com pelo menos 79 casos; python3 -c com json.load valida os dois json; doctor.py lista nove hooks
    depende_de: [T-02.10]
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
---

# Tasks — Sprint 02

> F-02.1 (T-02.01 a T-02.06) são paralelas entre si e com toda a F-02.2. Dentro da F-02.2 a
> ordem é estrita: T-02.07 → T-02.08 → T-02.09 → T-02.10 → T-02.11, porque todas editam
> `testar.sh` e as três de hook usam `sessao()` de T-02.07.

---

```yaml
id: T-02.01
titulo: SKILL.md — regra 16, seção "Sessões paralelas", hooks novos e identidade no rastro
objetivo: Fazer o texto central da skill declarar a regra e os mecanismos que os três harnesses vão seguir
arquivos:
  cria: []
  altera: [.claude/skills/runx/SKILL.md]
teste_integracao: Roda testar-conteudo.sh e confere que regras-continuam-16, regra-16-cita-worktree, skill-secao-sessoes-paralelas, skill-tabela-hooks-novos e skill-rastro-sessao-harness passam
teste_funcional: Dada a seção Regras invioláveis, grep de linhas numeradas conta 16 e a linha 16 contém worktree; dada a tabela de hooks, ela tem nove linhas de hook
criterio_aceite: As cinco asserções citadas passam e nenhuma das 19 anteriores regride
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 24 ok, 9 falhas — as 5 desta task ok, 19 antigas intactas; achado e corrigido um bug no teste (asserção usava "## O rastro", a seção é "### O rastro")
```

O que entra no `SKILL.md`:

- **Regra 16:** "Uma ocorrência aberta por árvore de trabalho. Com git, a ocorrência nasce em
  worktree próprio no E1, e toda sessão que a toca trabalha de dentro dele."
- **Seção `## Sessões paralelas`**, depois de "Hooks e agentes": o problema em três linhas
  (stash, versão antiga, suíte contaminada), o que resolve cada um — worktree (D-01, D-02),
  reivindicação pelo rastro (D-08), portão da suíte (D-11, D-12) —, e o que vale em cada
  harness: o método vale nos três; os hooks rodam no Claude Code direto e no OpenCode e no
  MimoCode pela ponte (D-14).
- **Tabela de hooks:** três linhas novas, modo inicial `aviso`, com a regra que cada um
  cobra (16, 7/13, 9).
- **"O rastro":** as doze chaves ganham `sessao` (`<harness>@<id>`) e `harness` depois delas;
  o comando de exemplo continua igual; nota de que o `doctor` do expxdev avisa até o contrato
  canônico declarar as duas (L-01).

---

```yaml
id: T-02.02
titulo: Schema, template da ocorrência e 06-estado — a chave worktree e a herança de .expx
objetivo: Declarar onde o caminho do worktree é gravado e dizer que .expx/ é copiado do principal, nunca inventado
arquivos:
  cria: []
  altera: [.claude/skills/runx/references/00-schema.md, .claude/skills/runx/assets/TEMPLATE-ocorrencia.md, .claude/skills/runx/references/06-estado.md]
teste_integracao: Roda testar-conteudo.sh e confere que schema-ocorrencia-worktree e template-ocorrencia-worktree passam e que a asserção de marcador vazado continua passando
teste_funcional: Dado o bloco do kind ocorrencia no 00-schema.md, ele tem a chave worktree com exemplo relativo e a regra null sem git ou com opt-out; dado o 06-estado.md, a seção "Se .expx/ não existir" diz que num worktree ele é copiado do checkout principal
criterio_aceite: As duas asserções passam; grep -c 'worktree' em 06-estado.md é maior que zero; nenhum {{ vazado
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 26 ok, 7 falhas — schema-ocorrencia-worktree e template-ocorrencia-worktree ok; sem-marcador-vazado intacta
```

`kind: ocorrencia` ganha, depois de `modulo_afetado`:

```yaml
worktree: ../leadiq--OC-2026-0142-calculo-frete
```

Regras: caminho **relativo à raiz do checkout principal**; `null` quando não há git ou quando
a pessoa pediu "sem worktree" (D-07). A chave existe sempre. O template recebe
`worktree: {{../<repo>--<OC-ID>-<slug> | null}}`.

`06-estado.md`, seção "Se `.expx/` não existir, não crie", ganha o parágrafo: "Num worktree
aberto pelo E1, `.expx/` não nasce porque é ignorado pelo git, não porque o CLI não instalou.
O E1 copia `hooks.json` do checkout principal e grava o `estado.json` do objeto padrão; isso
é herança, não criação." (D-04, contradição resolvida em `00-DECISOES.md`.)

---

```yaml
id: T-02.03
titulo: E1 — Passo 0.a "uma ocorrência por árvore" e Passo 0.b "abrir a área de trabalho"
objetivo: Ensinar o E1 a nascer em worktree próprio, na branch da mergex, herdando o local e instalando dependências, e a entrar nele em cada harness
arquivos:
  cria: []
  altera: [.claude/skills/runx/references/01-investigacao.md]
teste_integracao: Roda testar-conteudo.sh e confere que e1-passo-worktree e e1-uma-por-arvore passam
teste_funcional: Dado o Passo 0.b, ele contém git worktree add -b, a ordem de base da mergex, a tabela de lockfiles, a lista fechada de arquivos herdados, a instrução EnterWorktree com path para o Claude Code e a frase de opt-out "sem worktree"
criterio_aceite: As duas asserções passam; o passo não contém caminho absoluto; o passo diz literalmente que sem git nada muda
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 28 ok, 5 falhas — e1-passo-worktree e e1-uma-por-arvore ok; sem caminho absoluto introduzido
```

**Passo 0.a — uma ocorrência aberta por árvore.** Antes de criar a pasta: se `docs/manutencao/`
desta raiz já tem outra ocorrência aberta (ORQUESTRADOR sem `status: concluido`), esta raiz
está ocupada. Com git, o Passo 0.b resolve (a nova nasce em outro worktree). Sem git, anuncie
qual está aberta e pergunte se é para continuar nela ou fechar antes — E1 pode perguntar.

**Passo 0.b — abrir a área de trabalho.** Só com git (`git rev-parse --is-inside-work-tree`).
Sem git: `worktree: null`, nada muda. Com "sem worktree" no pedido: idem, registre em uma
linha no `00-OCORRENCIA.md`.

1. **Nome da branch e base** — copiados da mergex, não reinterpretados: `fix/<OC-ID>-<slug>`
   para `bug`, `chore/<OC-ID>-<slug>` para os demais; convenção do `CONVENCOES.md` da stackx
   ou do repositório vence. Base: `CONVENCOES.md` → `git symbolic-ref refs/remotes/origin/HEAD`
   → branch atual se for `main`/`master`/`develop`.
2. **Criar ou retomar** — `git worktree list` já tem um worktree nessa branch → retome nele.
   Senão: `git worktree add -b <branch> ../<repo>--<OC-ID>-<slug> <base>` (`<repo>` = nome do
   diretório do checkout principal). Se a branch já existe sem worktree: `git worktree add
   ../<repo>--<OC-ID>-<slug> <branch>`.
3. **Herdar o local** (D-04), lista fechada, só copiando o que existir no principal:
   `.expx/hooks.json` (e `estado.json` do objeto padrão), `.claude/settings.local.json`,
   `.env`, `.env.local`, `.env.*.local`. Nunca ler nem imprimir o conteúdo.
4. **Instalar dependências** (D-05): comando de instalação do `CONVENCOES.md`, se existir;
   senão pela tabela — `package-lock.json` → `npm ci`; `pnpm-lock.yaml` → `pnpm install
   --frozen-lockfile`; `yarn.lock` → `yarn install --frozen-lockfile`; `bun.lock`/`bun.lockb`
   → `bun install`; `requirements.txt` → `pip install -r requirements.txt`; `poetry.lock` →
   `poetry install`; `go.mod` → `go mod download`; `Cargo.lock` → `cargo fetch`;
   `Gemfile.lock` → `bundle install`; `composer.lock` → `composer install`. Nenhum: lacuna
   em `base/00-LACUNAS.md`, siga.
5. **Gravar** `worktree:` no `00-OCORRENCIA.md` (que é gravado **dentro** do worktree) e
   registrar `fase_iniciada --detalhe "worktree <caminho>"` no rastro.
6. **Entrar.** Claude Code: `EnterWorktree` com `path` apontando para o worktree — a sessão
   continua lá. OpenCode e MimoCode: anuncie "Área de trabalho: `<caminho>`. Abra o harness
   nesse diretório para continuar" e encerre o E1 aqui; o próximo comando, rodado de lá,
   retoma pela máquina de estados normalmente.

Toda a pasta `docs/manutencao/<OC-ID>-<slug>/` vive no worktree; nada é gravado no principal.

---

```yaml
id: T-02.04
titulo: E3 — eventos de task no rastro e verificação de reivindicação
objetivo: Fazer o E3 registrar quem abriu e fechou cada task e desviar de task reivindicada por outra sessão
arquivos:
  cria: []
  altera: [.claude/skills/runx/references/03-fix.md]
teste_integracao: Roda testar-conteudo.sh e confere que e3-task-iniciada e e3-reivindicacao passam
teste_funcional: Dado o Passo 2, ele traz os comandos rastro.py --evento task_iniciada, task_concluida e task_bloqueada com --task, e diz que task reivindicada por outra sessão é pulada para a próxima paralelizável ou vira bloqueio
criterio_aceite: As duas asserções passam; a checklist de saída do E3 ganha o item de que toda task concluída tem task_iniciada e task_concluida no rastro
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 30 ok, 3 falhas — e3-task-iniciada e e3-reivindicacao ok
```

No Passo 2, **antes** de marcar `em_andamento`: leia `docs/eventos/<trabalho_id>.jsonl`; se o
último `task_iniciada` daquela task é de outra `sessao` e não há `task_concluida` nem
`task_bloqueada` dela depois, a task está reivindicada — pule para a próxima paralelizável
com dependências satisfeitas; se não houver, registre `B-NN` em `BLOQUEIOS.md` ("task T
reivindicada pela sessão S") e siga a regra 13. Ao abrir:
`rastro.py --evento task_iniciada --fase e3 --task T-NN.MM`. Ao fechar: `task_concluida` ou
`task_bloqueada`, com `--task`. O Passo 1 ganha a nota: a mergex, no E0, **retoma** a branch
em que o worktree já está (não cria outra).

---

```yaml
id: T-02.05
titulo: E4 — Passo 0 "árvore pronta para a suíte"
objetivo: Impedir que a suíte inteira rode sobre árvore com trabalho de outra sessão e que isso vire REPROVADO falso
arquivos:
  cria: []
  altera: [.claude/skills/runx/references/04-qa.md]
teste_integracao: Roda testar-conteudo.sh e confere que e4-portao-arvore passa
teste_funcional: Dado o Passo 0, ele manda comparar git status --porcelain com a lista autorizada e o rastro, e diz que com árvore contaminada a suíte não roda, o QA.md não é gravado e nenhum veredito sai
criterio_aceite: A asserção passa; o Passo 2 item 4 referencia o Passo 0; o comando de rastro do veredito continua idêntico ao atual
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 31 ok, 2 falhas — e4-portao-arvore ok; git diff confirma veredito_emitido intocado
```

**Passo 0.** Antes de qualquer execução: (a) `git status --porcelain`; arquivo sujo que não
está na lista autorizada (a mesma do Passo 3) nem é artefato do método nem arquivo de teste
→ contaminação; (b) rastro com `task_iniciada` de outra sessão sem fechamento → outra sessão
está no meio. Em qualquer dos dois: **não rode a suíte, não grave `QA.md`, não emita
veredito.** Anuncie "E4 aguardando árvore limpa: `<arquivos>` (sessão `<sessao>`)" e encerre;
o E4 é reexecutado quando a árvore estiver pronta. Isso não é volta ao E3 e não é registrado
como `reprovado` (D-12). Sem git: siga para o Passo 1. O item 4 do Passo 2 passa a dizer
"executada sobre a árvore que o Passo 0 aprovou"; o `suite_executada` que o hook grava traz
o `HEAD` — cole-o em `QA.md` junto com a saída.

---

```yaml
id: T-02.06
titulo: E2 e E5 — área de trabalho no ORQUESTRADOR e no relatório técnico
objetivo: Deixar registrado, para quem chega depois, onde a ocorrência vive e que o worktree não é removido pela skill
arquivos:
  cria: []
  altera: [.claude/skills/runx/references/02-plano.md, .claude/skills/runx/assets/TEMPLATE-ORQUESTRADOR.md, .claude/skills/runx/references/05-relatorio.md]
teste_integracao: Roda testar-conteudo.sh e confere que e2-orq-area-de-trabalho passa e que nenhum marcador vazou
teste_funcional: Dada a seção 4 do template, ela tem a linha "Área de trabalho" com as duas alternativas (caminho do worktree ou checkout principal); dado o 05-relatorio.md, o relatório técnico registra a área e diz que a skill nunca remove worktree nem branch
criterio_aceite: A asserção passa; a seção 8 do template diz que a retomada acontece de dentro da área de trabalho
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 32 ok, 1 falha (só readme-mimocode, da sprint-03) — F-02.1 inteira concluída
```

Seção 4 do template: `- **Área de trabalho:** {{../<repo>--<OC-ID>-<slug> | checkout principal (sem worktree)}}`.
Seção 8, item 1: "Abra a sessão de dentro da área de trabalho da seção 4". `02-plano.md`
Passo 5 copia o `worktree` do `00-OCORRENCIA.md` para essa linha. `05-relatorio.md`: o
relatório técnico ganha a linha da área de trabalho na seção de entrega e a frase "o worktree
e a branch ficam; remoção é de quem entrega" (D-07).

---

```yaml
id: T-02.07
titulo: Biblioteca comum — raiz em worktree, sessão e harness, extras no rastro
objetivo: Fazer expx_rastro reconhecer .git arquivo, descobrir a identidade da sessão e gravá-la depois das doze chaves
arquivos:
  cria: []
  altera: [.claude/hooks/comum/expx_rastro.py, .claude/hooks/comum/rastro.py, .claude/hooks/testes/testar.sh]
teste_integracao: Roda testar.sh e confere que raiz-em-worktree passa e que os casos novos sessao-por-env, sessao-por-payload, sessao-por-ancestral e extras-depois-das-doze passam
teste_funcional: Dado EXPX_SESSAO=opencode@abc, a linha gravada termina com sessao opencode@abc e harness opencode após a chave arquivos; sem nenhuma variável nem payload, sessao casa o padrão nome@pid
criterio_aceite: bash .claude/hooks/testes/testar.sh sai 0 falhas com pelo menos 64 casos, e o JSON gravado mantém as doze chaves na ordem do contrato antes das duas extras
depende_de: []
paralelizavel: false
status: concluida   # 2026-09-06 · testar.sh: 64 ok, 0 falhas (era 59; +1 raiz-em-worktree corrigido, +4 identidade); testar-falsos-positivos.sh: 38 ok, 0 falhas
```

- `raiz_repo()`: `os.path.isdir(".git") or os.path.isfile(".git")` (D-06).
- `harness()`: `EXPX_HARNESS` → `CLAUDECODE` → nome do executável do avô do processo
  (`ps -o comm= -p <ppid do pai>`, só o basename: `claude` → `claude-code`, `opencode`,
  `mimo` → `mimocode`) → `desconhecido`.
- `sessao(evento=None)`: `EXPX_SESSAO` → `evento["session_id"]` (com o harness na frente) →
  `CLAUDE_CODE_SESSION_ID` → `<harness>@<pid do avô>` (D-09). Resultado em cache por processo.
- `grava(..., sessao=None)`: escreve `sessao` e `harness` **depois** de `arquivos` (D-10).
  `ler_evento()` guarda o `session_id` num módulo-global para `grava` usar sem mudar a
  assinatura dos hooks.
- `rastro.py --sessao` opcional.
- Casos em `testar.sh`: os quatro nomeados acima, mais `raiz-em-worktree` (de vermelho a verde).

---

```yaml
id: T-02.08
titulo: Hook uma-ocorrencia-por-arvore
objetivo: Avisar quando um 00-OCORRENCIA.md novo é gravado numa raiz que já tem outra ocorrência aberta
arquivos:
  cria: [.claude/hooks/runx/uma-ocorrencia-por-arvore.py]
  altera: [.claude/hooks/testes/testar.sh, .claude/hooks/testes/testar-falsos-positivos.sh]
teste_integracao: Roda testar.sh e testar-falsos-positivos.sh com os casos do hook e confere 0 falhas
teste_funcional: Dado um Write em docs/manutencao/OC-2026-0200-x/00-OCORRENCIA.md com OC-2026-0142 aberta na mesma raiz, sai 0 com aviso no stderr; dado o mesmo Write quando a 0142 está concluída, ou quando o Write é na própria 0142, sai 0 sem stderr
criterio_aceite: testar.sh sai 0 falhas com pelo menos 67 casos; testar-falsos-positivos.sh sai 0 falhas com pelo menos 40 casos; o hook em modo bloqueio sai 2
depende_de: [T-02.07]
paralelizavel: false
status: concluida   # 2026-09-06 · testar.sh: 68 ok, 0 falhas; testar-falsos-positivos.sh: 41 ok, 0 falhas
```

`PreToolUse` em `Write|Edit`; alvo `docs/manutencao/<X>/00-OCORRENCIA.md`. Lista as pastas
irmãs com ORQUESTRADOR ou 00-OCORRENCIA sem `status: concluido`/`concluido_em`; se alguma
tem id ≠ `<X>`, `barra_ou_avisa` com a regra 16 e o nome da aberta. `LIVRE` do escopo não se
aplica aqui (o alvo é justamente um artefato do método). Falso positivo a cobrir:
reescrever o `00-OCORRENCIA.md` da própria ocorrência aberta.

---

```yaml
id: T-02.09
titulo: Hook task-reivindicada
objetivo: Avisar quando uma sessão marca em_andamento uma task que o rastro mostra aberta por outra sessão
arquivos:
  cria: [.claude/hooks/runx/task-reivindicada.py]
  altera: [.claude/hooks/testes/testar.sh, .claude/hooks/testes/testar-falsos-positivos.sh]
teste_integracao: Roda testar.sh e testar-falsos-positivos.sh com os casos do hook e confere 0 falhas
teste_funcional: Dado um rastro com task_iniciada de T-01.02 pela sessão claude-code@1 sem fechamento, uma escrita em tasks.md pondo T-01.02 em em_andamento vinda da sessão opencode@2 sai 0 com aviso; a mesma escrita vinda de claude-code@1, ou com task_concluida posterior, ou sem rastro, sai 0 sem stderr
criterio_aceite: testar.sh sai 0 falhas com pelo menos 71 casos; testar-falsos-positivos.sh com pelo menos 42; o hook nunca lê o rastro além do arquivo do trabalho atual
depende_de: [T-02.08]
paralelizavel: false
status: concluida   # 2026-09-06 · testar.sh: 74 ok, 0 falhas; testar-falsos-positivos.sh: 41 ok, 0 falhas. Achado e corrigido bug real no proprio teste: RASTRO usava OC-2026-0142-calculo-frete.jsonl, mas trabalho_id() le 01-CAUSA-RAIZ.md/tasks.md ja gravados na fixture com trabalho_id OC-2026-0142
```

`PreToolUse` em `Write|Edit` sobre `sprint-*/tasks.md` (mesmo `ALVO` do
`task-so-fecha-verde`). Reusa `conteudo_proposto()` e `bloco_yaml()` daquele hook (import,
não cópia) para descobrir quais tasks **passam** a `em_andamento` nesta escrita. Para cada
uma, varre `docs/eventos/<trabalho_id>.jsonl` de trás para frente: primeiro evento com
`task` igual decide — `task_iniciada` de `sessao` ≠ `sessao()` atual → aviso;
`task_concluida`/`task_bloqueada` ou mesma sessão → silêncio. Linha sem `sessao` (rastro
antigo) conta como mesma sessão: nunca avisar por falta de dado.

---

```yaml
id: T-02.10
titulo: Hook arvore-limpa-antes-da-suite e HEAD no rastro-suite
objetivo: Avisar antes de um comando de suíte quando há arquivo sujo fora do escopo ou task de outra sessão em andamento, e deixar a execução auditável
arquivos:
  cria: [.claude/hooks/runx/arvore-limpa-antes-da-suite.py]
  altera: [.claude/hooks/comum/rastro-suite.py, .claude/hooks/testes/testar.sh, .claude/hooks/testes/testar-falsos-positivos.sh]
teste_integracao: Roda testar.sh e testar-falsos-positivos.sh com os casos do hook e confere 0 falhas; o caso do rastro-suite confere que detalhe traz o HEAD curto e sujos_fora_escopo
teste_funcional: Dado npm test com src/outro/modulo.ts modificado e fora do escopo, sai 0 com aviso listando o arquivo; dado o mesmo comando com só src/frete/calculo.ts (no escopo) ou um arquivo de teste sujo, sai 0 sem stderr; dado ls, não roda; sem repositório git, sai 0 sem stderr
criterio_aceite: testar.sh sai 0 falhas com pelo menos 77 casos; testar-falsos-positivos.sh com pelo menos 45; o hook reutiliza autorizados() do escopo-da-ocorrencia sem copiar a função
depende_de: [T-02.09]
paralelizavel: false
status: concluida   # 2026-09-06 · testar.sh: 81 ok, 0 falhas; testar-falsos-positivos.sh: 43 ok, 0 falhas. Achado e corrigido: git status --porcelain sem --untracked-files=all lista diretorio inteiro (docs/, src/), nao o arquivo individual, mascarando o escopo
```

`PreToolUse` em `Bash`. Regex `SUITE` importado de `rastro-suite` (mover para
`expx_rastro` se o import circular atrapalhar — decisão do executor, registrada em
`BLOQUEIOS.md` só se travar). `git status --porcelain` via `subprocess` com timeout de 2 s;
falha ou timeout → sai 0. Sujo = linhas `M`, `A`, `??`, `R`; descarta `LIVRE`, `TESTE` e
`autorizados()`; sobra → aviso com a lista. Segunda checagem: o mesmo critério de
reivindicação de T-02.09, para tasks `em_andamento`. `rastro-suite`: `detalhe` vira
`suite <estado> @<sha7> sujos_fora_escopo=<n>: <comando>` (D-13); sem git, `@-`.

---

```yaml
id: T-02.11
titulo: Registro dos hooks novos — hooks.json, exemplo e doctor
objetivo: Ligar os três hooks ao harness pelo despachante, criar o grupo PreToolUse Bash e fazê-los aparecer no diagnóstico
arquivos:
  cria: []
  altera: [.claude/hooks/hooks.json, .claude/hooks/hooks.exemplo.json, .claude/hooks/comum/doctor.py, .claude/hooks/testes/testar.sh]
teste_integracao: Roda o despachante com as listas do hooks.json novo contra a fixture e confere que os sete hooks do grupo Write|Edit rodam num processo só e que o grupo PreToolUse Bash existe
teste_funcional: Dado python3 doctor.py, a tabela lista nove hooks e os três novos em aviso; dado hooks.json, existe um grupo PreToolUse com matcher Bash apontando para runx/arvore-limpa-antes-da-suite
criterio_aceite: testar.sh sai 0 falhas com pelo menos 79 casos; python3 -c com json.load valida os dois json; doctor.py lista nove hooks
depende_de: [T-02.10]
paralelizavel: false
status: concluida   # 2026-09-06 · testar.sh: 86 ok, 0 falhas; testar-falsos-positivos.sh: 43 ok; testar-conteudo.sh: 32 ok, 1 falha (so readme-mimocode, sprint-03). testar-espelho.sh passa a falhar ate T-03.05 (esperado — .opencode/ so e sincronizada no fechamento)
```

`hooks.json`: grupo `PreToolUse/Write|Edit` ganha `runx/uma-ocorrencia-por-arvore` e
`runx/task-reivindicada` no fim; grupo novo `PreToolUse/Bash` com
`runx/arvore-limpa-antes-da-suite`, `timeout: 15`. `hooks.exemplo.json` lista os nove.
`doctor.py::HOOKS` ganha as três linhas (`metodo`, `aviso`). O `install.sh` **não** é tocado
aqui — os grupos embutidos nele são atualizados em T-03.02, junto com a ponte.
