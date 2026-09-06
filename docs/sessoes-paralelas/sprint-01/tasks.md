---
expx_schema: 1
expx_tool: sprintx
kind: tasks
trabalho_id: sessoes-paralelas
sprint_id: sprint-01
atualizado_em: 2026-09-06
tasks:
  - id: T-01.01
    titulo: Fixture git real em testar.sh e o caso raiz-em-worktree
    fase: F-01.1
    status: concluida
    objetivo: Transformar o diretorio .git vazio da fixture em repositorio real com um worktree derivado, e gravar o caso que prova que raiz_repo falha em worktree
    arquivos:
      cria: []
      altera: [.claude/hooks/testes/testar.sh]
    teste_integracao: Roda testar.sh inteiro e confere que os 59 casos anteriores continuam ok e que a fixture responde 0 a git rev-parse --is-inside-work-tree
    teste_funcional: Dado um worktree criado de $W, chamar expx_rastro.raiz_repo() com cwd no subdiretorio src do worktree devolve a raiz do worktree; hoje devolve o subdiretorio e o caso falha
    criterio_aceite: bash .claude/hooks/testes/testar.sh termina com 59 ok e exatamente 1 falha, nomeada raiz-em-worktree
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-01.02
    titulo: Asserções de conteúdo para tudo que o método vai passar a dizer
    fase: F-01.1
    status: concluida
    objetivo: Descrever em asercoes nomeadas o texto que SKILL.md, references, templates e README precisam ganhar, antes de ganharem
    arquivos:
      cria: []
      altera: [.claude/hooks/testes/testar-conteudo.sh]
    teste_integracao: Roda testar-conteudo.sh contra o repositorio real e confere que sai 1 com as 14 asercoes novas em FALHA e as 19 antigas ok (a regra-15 vira regra-16 e passa a compor as 14)
    teste_funcional: Dado o SKILL.md atual com 15 regras, a asercao regras-continuam-16 falha; dado o 01-investigacao.md atual sem git worktree add, a asercao e1-passo-worktree falha pelo nome
    criterio_aceite: bash .claude/hooks/testes/testar-conteudo.sh sai 1 no estado atual, lista 19 ok e 14 FALHA, e cada FALHA tem um dos 14 nomes declarados na prosa desta task
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-01.03
    titulo: Harness em node para a ponte JS
    fase: F-01.1
    status: concluida
    objetivo: Testar a ponte com eventos falsos de tool.execute.before, tool.execute.after e shell.env contra um despachante falso que devolve o stdin recebido
    arquivos:
      cria: [.claude/hooks/testes/testar-ponte.sh]
      altera: []
    teste_integracao: Roda testar-ponte.sh e confere que ele carrega .claude/hooks/ponte/runx-ponte.js com node, aponta o despachante para um script falso via RUNX_PONTE_DESPACHANTE e compara o JSON recebido campo a campo
    teste_funcional: Dado um evento before da ferramenta write com filePath X e sessionID S, o despachante falso recebe tool_name Write, tool_input.file_path X e session_id S; dado exit 2 do falso, a ponte lanca erro e seta output.cancel true
    criterio_aceite: bash .claude/hooks/testes/testar-ponte.sh sai 1 no estado atual dizendo que runx-ponte.js nao existe, e sai 1 nomeando a falta de node quando node nao esta no PATH
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-01.04
    titulo: Teste de dry-run do instalador
    fase: F-01.1
    status: concluida
    objetivo: Fixar o que install.sh --dry-run precisa listar para os tres harnesses antes de ensinar o instalador a fazer isso
    arquivos:
      cria: [.claude/hooks/testes/testar-instalador.sh]
      altera: []
    teste_integracao: Roda install.sh --dry-run num projeto temporario e confere que a saida cita .opencode/plugins/runx-ponte.js e .mimocode/hooks/runx-ponte.js
    teste_funcional: Dado install.sh --mimocode --dry-run, sai 0 e cita .mimocode/hooks/runx-ponte.js; dado --sem-hooks --dry-run, nao cita a ponte
    criterio_aceite: bash .claude/hooks/testes/testar-instalador.sh sai 1 no estado atual, com 3 das 4 asercoes em FALHA nomeada (a quarta, sem-hooks-omite-ponte, ja e verdadeira hoje porque a ponte ainda nao existe em lugar nenhum — nao e falso positivo, e o comportamento correto sendo detectado cedo)
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
---

# Tasks — Sprint 01

As quatro tasks são paralelas: arquivos distintos, sem dependência entre si.

---

```yaml
id: T-01.01
titulo: Fixture git real em testar.sh e o caso raiz-em-worktree
objetivo: Transformar o diretório .git vazio da fixture em repositório real com um worktree derivado, e gravar o caso que prova que raiz_repo falha em worktree
arquivos:
  cria: []
  altera: [.claude/hooks/testes/testar.sh]
teste_integracao: Roda testar.sh inteiro e confere que os 59 casos anteriores continuam ok e que a fixture responde 0 a git rev-parse --is-inside-work-tree
teste_funcional: Dado um worktree criado de $W, chamar expx_rastro.raiz_repo() com cwd no subdiretório src do worktree devolve a raiz do worktree; hoje devolve o subdiretório e o caso falha
criterio_aceite: bash .claude/hooks/testes/testar.sh termina com 59 ok e exatamente 1 falha, nomeada raiz-em-worktree
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar.sh: 59 ok antes, 59 ok + 1 falha (raiz-em-worktree) depois — vermelho esperado
```

O que muda na fixture (linhas 6-9 de `testar.sh`):

- `mkdir -p "$W/.git"` vira `git -C "$W" init -q -b main` + `git config user.email/name` locais
  + um commit inicial com `.gitignore` ignorando `.expx/` e `docs/eventos/`;
- um helper `worktree_de_mentira <nome> <branch>` que faz `git -C "$W" worktree add -q -b <branch> "$W/../<nome>" main`
  e devolve o caminho — o `trap` de limpeza passa a remover também o worktree;
- um helper `caso_py <nome> <cwd> <expressao python>` para casos que testam a biblioteca em
  vez de um hook: roda `python3 -c` com `sys.path` apontando para `comum/` e compara a saída.

O caso novo:

```
caso_py raiz-em-worktree "$WT/src" 'print(R.raiz_repo())'   # espera "$WT"
```

Hoje `raiz_repo()` só reconhece `.git` **diretório** (`base/deteccao-e-raiz.md` §3): de
`$WT/src`, devolve `$WT/src`. Vermelho esperado. Contar os casos antes e depois: eram 59 ok;
precisam ser 59 ok + 1 falha, nem um a menos.

---

```yaml
id: T-01.02
titulo: Asserções de conteúdo para tudo que o método vai passar a dizer
objetivo: Descrever em asserções nomeadas o texto que SKILL.md, references, templates e README precisam ganhar, antes de ganharem
arquivos:
  cria: []
  altera: [.claude/hooks/testes/testar-conteudo.sh]
teste_integracao: Roda testar-conteudo.sh contra o repositório real e confere que sai 1 com as 14 asserções novas em FALHA e as 19 antigas ok
teste_funcional: Dado o SKILL.md atual com 15 regras, a asserção regras-continuam-16 falha; dado o 01-investigacao.md atual sem `git worktree add`, a asserção e1-passo-worktree falha pelo nome
criterio_aceite: bash .claude/hooks/testes/testar-conteudo.sh sai 1 no estado atual, lista 19 ok e 14 FALHA, e cada FALHA tem um dos 14 nomes declarados na prosa desta task
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 19 ok, 14 falhas nomeadas (vermelho esperado)
```

As 14 asserções, com o que cada uma casa (estrutura, não palavra solta — `base/testes-existentes.md` §3):

| Nome | Arquivo | Casa |
|---|---|---|
| `regras-continuam-16` | `SKILL.md` | 16 linhas numeradas na seção "Regras invioláveis" (substitui `regras-continuam-15`) |
| `regra-16-cita-worktree` | `SKILL.md` | a linha `16.` contém `worktree` |
| `skill-secao-sessoes-paralelas` | `SKILL.md` | cabeçalho `## Sessões paralelas` |
| `skill-tabela-hooks-novos` | `SKILL.md` | as três linhas de tabela `uma-ocorrencia-por-arvore`, `task-reivindicada`, `arvore-limpa-antes-da-suite` |
| `skill-rastro-sessao-harness` | `SKILL.md` | a seção "O rastro" cita `sessao` e `harness` como chaves depois das doze |
| `schema-ocorrencia-worktree` | `references/00-schema.md` | o bloco do `kind: ocorrencia` tem a chave `worktree:` |
| `template-ocorrencia-worktree` | `assets/TEMPLATE-ocorrencia.md` | frontmatter tem `worktree:` |
| `e1-passo-worktree` | `references/01-investigacao.md` | contém literalmente `git worktree add -b` e a tabela de lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `requirements.txt`) |
| `e1-uma-por-arvore` | `references/01-investigacao.md` | contém `uma ocorrência aberta por árvore` e a frase de opt-out `sem worktree` |
| `e3-task-iniciada` | `references/03-fix.md` | contém `rastro.py --evento task_iniciada` **e** `--evento task_concluida` **e** `--evento task_bloqueada`, todos com `--task` |
| `e3-reivindicacao` | `references/03-fix.md` | contém `reivindicad` e `outra sessão` |
| `e4-portao-arvore` | `references/04-qa.md` | um passo antes do Passo 2 contém `git status --porcelain` e `não grave` (o `QA.md` não é gravado com árvore contaminada) |
| `e2-orq-area-de-trabalho` | `assets/TEMPLATE-ORQUESTRADOR.md` | seção 4 contém `Área de trabalho:` |
| `readme-mimocode` | `README.md` | a tabela de compatibilidade tem coluna `MimoCode` e o instalador documenta `--mimocode` |

Também: a asserção existente `regras-continuam-15` é **renomeada**, não duplicada — o total
passa de 21 para 34 asserções declaradas. `readme-hooks-novos` não é asserção separada: cai
dentro de `readme-mimocode` (mesma tabela).

---

```yaml
id: T-01.03
titulo: Harness em node para a ponte JS
objetivo: Testar a ponte com eventos falsos de tool.execute.before, tool.execute.after e shell.env contra um despachante falso que devolve o stdin recebido
arquivos:
  cria: [.claude/hooks/testes/testar-ponte.sh]
  altera: []
teste_integracao: Roda testar-ponte.sh e confere que ele carrega .claude/hooks/ponte/runx-ponte.js com node, aponta o despachante para um script falso via RUNX_PONTE_DESPACHANTE e compara o JSON recebido campo a campo
teste_funcional: Dado um evento before da ferramenta write com filePath X e sessionID S, o despachante falso recebe tool_name Write, tool_input.file_path X e session_id S; dado exit 2 do falso, a ponte lança erro e seta output.cancel true
criterio_aceite: bash .claude/hooks/testes/testar-ponte.sh sai 1 no estado atual dizendo que runx-ponte.js não existe, e sai 1 nomeando a falta de node quando node não está no PATH
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-ponte.sh: sem a ponte, "ponte-nao-existe"; com PATH sem node, "node-ausente". Achado e corrigido durante o rascunho de validação: aviso do before precisa persistir em disco (não em Map de processo) para sobreviver ao after, que roda em outro `node` — nota deixada em sprint-03/tasks.md para T-03.01
```

O contrato que o harness fixa (é o contrato da ponte, D-14 — `base/harnesses.md` §2):

- **Carga:** `node -e` importa `.claude/hooks/ponte/runx-ponte.js` e chama o plugin com
  `{ directory, worktree, project: {}, client: {}, $: null }`; o retorno é o objeto de hooks.
- **Despachante falso:** `RUNX_PONTE_DESPACHANTE=<script>` — o script grava o stdin em
  `$W/recebido.json`, grava `$@` em `$W/argv`, escreve `$RUNX_FAKE_STDERR` no stderr e sai
  com `$RUNX_FAKE_EXIT`. O `hooks.json` lido pela ponte é o real do repositório.
- **Casos (nome → o que confere):**
  - `before-write-traduz` — `{tool:"write", args:{filePath, content}}` → `tool_name: "Write"`, `tool_input.file_path`, `tool_input.content`, `session_id`, `hook_event_name: "PreToolUse"`; `argv` = a lista do grupo `PreToolUse/Write|Edit` do `hooks.json`.
  - `before-edit-traduz` — `oldString`/`newString`/`replaceAll` → `old_string`/`new_string`/`replace_all`.
  - `before-bash-traduz` — `{tool:"bash", args:{command}}` → `tool_name: "Bash"`, `tool_input.command`; `argv` = grupo `PreToolUse/Bash`.
  - `before-ignora-outras` — `tool: "read"` → despachante **não** é chamado.
  - `before-exit-2-bloqueia` — `RUNX_FAKE_EXIT=2` → a promessa rejeita com a mensagem do stderr e `output.cancel === true`.
  - `before-aviso-vai-no-after` — `RUNX_FAKE_EXIT=0` com stderr → `before` resolve sem erro; o `after` do mesmo `callID` recebe `output.output` terminando com o texto do aviso.
  - `after-bash-exit-code` — `after` com `metadata.exit = 1` → `tool_response.exit_code === 1`; `argv` = grupo `PostToolUse/Bash`.
  - `shell-env-opencode` — ponte carregada de um caminho contendo `/.opencode/` → `shell.env` devolve `EXPX_HARNESS=opencode` e `EXPX_SESSAO=opencode@<sessionID>`.
  - `shell-env-mimocode` — caminho contendo `/.mimocode/` → `EXPX_HARNESS=mimocode`.
  - `despachante-ausente-nao-quebra` — sem despachante encontrável e sem override → `before` resolve, nada lançado (falha aberta).
- Sem `node` no PATH: imprime `FALHA node-ausente` e sai 1.

---

```yaml
id: T-01.04
titulo: Teste de dry-run do instalador
objetivo: Fixar o que install.sh --dry-run precisa listar para os três harnesses antes de ensinar o instalador a fazer isso
arquivos:
  cria: [.claude/hooks/testes/testar-instalador.sh]
  altera: []
teste_integracao: Roda install.sh --dry-run num projeto temporário e confere que a saída cita .opencode/plugins/runx-ponte.js e .mimocode/hooks/runx-ponte.js
teste_funcional: Dado install.sh --mimocode --dry-run, sai 0 e cita .mimocode/hooks/runx-ponte.js; dado --sem-hooks --dry-run, não cita a ponte
criterio_aceite: bash .claude/hooks/testes/testar-instalador.sh sai 1 no estado atual, com 3 das 4 asserções em FALHA nomeada — a quarta (sem-hooks-omite-ponte) já é verdadeira hoje porque a ponte ainda não existe em lugar nenhum, o que não é falso positivo
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-instalador.sh: 1 ok, 3 falhas nomeadas (vermelho esperado)
```

Quatro asserções: `dry-run-cita-ponte-opencode`, `dry-run-cita-ponte-mimocode`,
`flag-mimocode-aceita` (hoje o instalador sai com "opção desconhecida"),
`sem-hooks-omite-ponte`. O `--global --dry-run` roda com `HOME` apontado para um diretório
temporário, para nunca tocar a máquina de quem testa.
