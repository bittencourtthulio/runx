---
expx_schema: 1
expx_tool: sprintx
kind: tasks
trabalho_id: sessoes-paralelas
sprint_id: sprint-03
atualizado_em: 2026-09-06
tasks:
  - id: T-03.01
    titulo: A ponte runx-ponte.js para OpenCode e MimoCode
    fase: F-03.1
    status: concluida
    objetivo: Traduzir tool.execute.before, tool.execute.after e shell.env para o payload e o despachante que os hooks Python ja entendem
    arquivos:
      cria: [.claude/hooks/ponte/runx-ponte.js]
      altera: []
    teste_integracao: Roda testar-ponte.sh e confere que os dez casos passam, com o hooks.json real do repositorio decidindo as listas despachadas
    teste_funcional: Dado um evento before de write com filePath X e sessionID S, o despachante recebe tool_name Write, tool_input.file_path X e session_id S; dado exit 2, a promessa rejeita e output.cancel e true; dado shell.env de um arquivo em .mimocode, EXPX_HARNESS e mimocode
    criterio_aceite: bash .claude/hooks/testes/testar-ponte.sh sai 0 falhas; node --check no arquivo sai 0; o arquivo nao importa nenhum pacote alem de node:child_process, node:fs, node:path e node:os
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-03.02
    titulo: install.sh - flag --mimocode, ponte nas duas pastas e grupos novos
    fase: F-03.2
    status: concluida
    objetivo: Distribuir a ponte para .opencode/plugins e .mimocode/hooks e registrar o grupo PreToolUse Bash no settings.json do Claude Code
    arquivos:
      cria: []
      altera: [install.sh]
    teste_integracao: Roda testar-instalador.sh e confere que as quatro asercoes passam; roda install.sh de verdade num projeto temporario e confere que os arquivos existem e que o settings.json resultante e JSON valido com o grupo PreToolUse Bash
    teste_funcional: Dado --mimocode --dry-run, cita .mimocode/hooks/runx-ponte.js; dado --sem-hooks, nao instala ponte; dado --global com HOME temporario, grava em ~/.config/opencode/plugins e ~/.config/mimocode/hooks
    criterio_aceite: bash .claude/hooks/testes/testar-instalador.sh sai 0 falhas; rodar o instalador duas vezes no mesmo projeto temporario nao duplica nenhum grupo no settings.json
    depende_de: [T-03.01]
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
  - id: T-03.03
    titulo: README - tres harnesses, hooks novos, sessoes paralelas
    fase: F-03.2
    status: concluida
    objetivo: Documentar a coluna MimoCode, a flag --mimocode, os tres hooks e o trabalho em sessoes paralelas
    arquivos:
      cria: []
      altera: [README.md]
    teste_integracao: Roda testar-conteudo.sh e confere que readme-mimocode passa e que as demais 33 continuam passando
    teste_funcional: Dada a tabela de compatibilidade, ela tem as colunas Claude Code, OpenCode e MimoCode e a linha Hooks diz ponte JS nas duas ultimas; dada a tabela de flags, ela tem --mimocode
    criterio_aceite: A asercao passa; o README continua sem caminho absoluto; a secao de hooks lista nove hooks
    depende_de: []
    paralelizavel: true
    concluida_em: 2026-09-06
    suite: verde
  - id: T-03.04
    titulo: Registrar as decisoes de projeto na DECISOES-DA-SKILL
    fase: F-03.3
    status: concluida
    objetivo: Deixar na skill o porque de cada escolha desta feature, no formato DR que ela ja usa
    arquivos:
      cria: []
      altera: [.claude/skills/runx/DECISOES-DA-SKILL.md]
    teste_integracao: Roda testar-conteudo.sh e confere que nada regrediu; grep conta as DRs novas
    teste_funcional: Dado o arquivo, existem linhas DR para worktree irmao, raiz por .git arquivo, reivindicacao pelo rastro, extras sessao e harness, ponte unica e E4 sem veredito em arvore contaminada
    criterio_aceite: grep -c '^| DR-' aumenta em pelo menos 8 em relacao a HEAD; cada DR nova cita a decisao D-NN de docs/sessoes-paralelas/00-DECISOES.md que a originou
    depende_de: [T-03.01, T-03.02, T-03.03]
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
  - id: T-03.05
    titulo: Espelhar em .opencode e rodar as seis suites
    fase: F-03.3
    status: concluida
    objetivo: Fechar a entrega com as duas arvores identicas e tudo verde
    arquivos:
      cria: []
      altera: [.opencode/skills/runx/SKILL.md, .opencode/skills/runx/DECISOES-DA-SKILL.md, .opencode/skills/runx/references/00-schema.md, .opencode/skills/runx/references/01-investigacao.md, .opencode/skills/runx/references/02-plano.md, .opencode/skills/runx/references/03-fix.md, .opencode/skills/runx/references/04-qa.md, .opencode/skills/runx/references/05-relatorio.md, .opencode/skills/runx/references/06-estado.md, .opencode/skills/runx/assets/TEMPLATE-ocorrencia.md, .opencode/skills/runx/assets/TEMPLATE-ORQUESTRADOR.md]
    teste_integracao: Roda testar-espelho.sh e as outras cinco suites e confere 0 falhas em todas
    teste_funcional: Dado diff -rq .claude/skills/runx .opencode/skills/runx, nao ha saida; dado testar.sh, a contagem de casos e maior ou igual a 79
    criterio_aceite: As seis suites saem 0 falhas e diff -rq nao reporta diferenca nas duas arvores
    depende_de: [T-03.04]
    paralelizavel: false
    concluida_em: 2026-09-06
    suite: verde
---

# Tasks — Sprint 03

---

```yaml
id: T-03.01
titulo: A ponte runx-ponte.js para OpenCode e MimoCode
objetivo: Traduzir tool.execute.before, tool.execute.after e shell.env para o payload e o despachante que os hooks Python já entendem
arquivos:
  cria: [.claude/hooks/ponte/runx-ponte.js]
  altera: []
teste_integracao: Roda testar-ponte.sh e confere que os dez casos passam, com o hooks.json real do repositório decidindo as listas despachadas
teste_funcional: Dado um evento before de write com filePath X e sessionID S, o despachante recebe tool_name Write, tool_input.file_path X e session_id S; dado exit 2, a promessa rejeita e output.cancel é true; dado shell.env de um arquivo em .mimocode, EXPX_HARNESS é mimocode
criterio_aceite: bash .claude/hooks/testes/testar-ponte.sh sai 0 falhas; node --check no arquivo sai 0; o arquivo não importa nenhum pacote além de node:child_process, node:fs, node:path e node:os
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-ponte.sh: 10 ok, 0 falhas; node --check ok; imports require("child_process"|"fs"|"path"|"os") sem prefixo node: (equivalente, mais compativel)
```

Desenho (D-14; contrato fixado por T-01.03):

- **Forma:** CommonJS sem dependências. `module.exports.RunxPonte = async ({ directory, worktree }) => ({...})`.
  O OpenCode e o MimoCode importam qualquer export nomeado que seja função.
- **Harness:** pelo caminho do próprio arquivo (`__filename`): contém `/.mimocode/` ou
  `/mimocode/` → `mimocode`; senão `opencode`.
- **Localizar o motor**, nesta ordem, parando no primeiro que tiver `comum/despachante.py`:
  `RUNX_PONTE_DESPACHANTE` (só teste; aponta direto para o script), `<worktree>/.claude/runx-hooks`,
  `~/.claude/runx-hooks`, `<worktree>/.claude/hooks` (este repositório). Nenhum → toda
  função vira no-op (falha aberta). Quando `RUNX_PONTE_DESPACHANTE` está setado, despacha
  **direto** para ele com os argumentos vazios — sem ler `hooks.json` — porque nesse modo não
  existe um `hooks.json` real ao lado do script de mentira; fora de teste, os argumentos vêm
  sempre do grupo correspondente em `hooks.json`.
- **Grupos:** lê `hooks.json` ao lado do despachante; para cada grupo, matcher e a lista de
  argumentos do comando (`despachante.py <a> <b> ...`). Mapa de ferramenta:
  `write`→`Write`, `edit`→`Edit`, `bash`→`Bash`; outras não despacham.
- **`tool.execute.before`:** monta `{hook_event_name: "PreToolUse", session_id, cwd: directory,
  tool_name, tool_input}` com `tool_input` em snake_case (`filePath`→`file_path`,
  `oldString`→`old_string`, `newString`→`new_string`, `replaceAll`→`replace_all`, `content`,
  `command`); roda `python3 despachante.py <lista>` com o JSON no stdin (`spawnSync`, timeout
  15 s). Exit 2 → `output.cancel = true; output.cancelReason = stderr; throw new Error(stderr)`.
  Exit 0 com stderr → grava o aviso em disco, **nunca em memória de processo**: cada chamada de
  hook do OpenCode/MimoCode é um `node` novo, e um `Map` module-level não sobrevive entre o
  `before` e o `after` da mesma ferramenta (bug real, achado e corrigido durante o rascunho de
  bancada da T-01.03 — reproduzido isoladamente com dois processos `node` separados). O arquivo
  vive em `os.tmpdir()/runx-ponte-aviso-<callID-saneado>.txt`.
- **`tool.execute.after`:** monta `PostToolUse` com `tool_response: { exit_code: metadata.exit }`
  quando `metadata.exit` é número; despacha o grupo `PostToolUse` correspondente; se o arquivo de
  aviso do `callID` existe, lê, anexa `"\n\n" + aviso` a `output.output` e apaga o arquivo.
- **`shell.env`:** `output.env.EXPX_HARNESS = harness; output.env.EXPX_SESSAO = harness + "@" + (input.sessionID || "sem-id")`.

---

```yaml
id: T-03.02
titulo: install.sh — flag --mimocode, ponte nas duas pastas e grupos novos
objetivo: Distribuir a ponte para .opencode/plugins e .mimocode/hooks e registrar o grupo PreToolUse Bash no settings.json do Claude Code
arquivos:
  cria: []
  altera: [install.sh]
teste_integracao: Roda testar-instalador.sh e confere que as quatro asserções passam; roda install.sh de verdade num projeto temporário e confere que os arquivos existem e que o settings.json resultante é JSON válido com o grupo PreToolUse Bash
teste_funcional: Dado --mimocode --dry-run, cita .mimocode/hooks/runx-ponte.js; dado --sem-hooks, não instala ponte; dado --global com HOME temporário, grava em ~/.config/opencode/plugins e ~/.config/mimocode/hooks
criterio_aceite: bash .claude/hooks/testes/testar-instalador.sh sai 0 falhas; rodar o instalador duas vezes no mesmo projeto temporário não duplica nenhum grupo no settings.json
depende_de: [T-03.01]
paralelizavel: false
status: concluida   # 2026-09-06 · testar-instalador.sh: 4 ok, 0 falhas; instalação real num projeto temporário confirmou os 4 grupos e os 3 arquivos de ponte; --global com HOME temporário gravou nos caminhos corretos; rodar duas vezes manteve 1 hook por grupo
```

- `--mimocode` entra ao lado de `--claude`/`--opencode`; sem flag, os três.
- `install_hooks()` (Claude Code): os grupos embutidos no `python3 - <<'PY'` ganham o
  `PreToolUse/Bash` e os dois hooks novos no `Write|Edit` — **os mesmos** do `hooks.json`.
- `install_ponte(harness)`: OpenCode → `<base>/.opencode/plugins/runx-ponte.js` (global:
  `~/.config/opencode/plugins/`); MimoCode → `<base>/.mimocode/hooks/runx-ponte.js` (global:
  `~/.config/mimocode/hooks/`). Só quando os hooks do Claude Code também são instalados (a ponte
  precisa deles) e sem `--sem-hooks`. `--dry-run` lista os destinos.
- MimoCode não recebe skill, comandos nem agentes (D-15); o cabeçalho do script diz isso.

---

```yaml
id: T-03.03
titulo: README — três harnesses, hooks novos, sessões paralelas
objetivo: Documentar a coluna MimoCode, a flag --mimocode, os três hooks e o trabalho em sessões paralelas
arquivos:
  cria: []
  altera: [README.md]
teste_integracao: Roda testar-conteudo.sh e confere que readme-mimocode passa e que as demais 33 continuam passando
teste_funcional: Dada a tabela de compatibilidade, ela tem as colunas Claude Code, OpenCode e MimoCode e a linha Hooks diz "ponte JS" nas duas últimas; dada a tabela de flags, ela tem --mimocode
criterio_aceite: A asserção passa; o README continua sem caminho absoluto; a seção de hooks lista nove hooks
depende_de: []
paralelizavel: true
status: concluida   # 2026-09-06 · testar-conteudo.sh: 33 ok, 0 falhas — todas as asercoes de conteudo verdes
```

Tabela "Compatibilidade" ganha a coluna MimoCode (skill, comandos e agentes: "lê `.claude/`";
hooks: `.mimocode/hooks/runx-ponte.js`). Tabela de flags ganha `--mimocode`. Seção nova
"Sessões paralelas" com o resumo do `SKILL.md`. Badge de harness: fora de escopo (é SVG em
`.github/assets/`, não listado nesta task).

---

```yaml
id: T-03.04
titulo: Registrar as decisões de projeto na DECISOES-DA-SKILL
objetivo: Deixar na skill o porquê de cada escolha desta feature, no formato DR que ela já usa
arquivos:
  cria: []
  altera: [.claude/skills/runx/DECISOES-DA-SKILL.md]
teste_integracao: Roda testar-conteudo.sh e confere que nada regrediu; grep conta as DRs novas
teste_funcional: Dado o arquivo, existem linhas DR para worktree irmão, raiz por .git arquivo, reivindicação pelo rastro, extras sessao e harness, ponte única e E4 sem veredito em árvore contaminada
criterio_aceite: grep -c '^| DR-' aumenta em pelo menos 8 em relação a HEAD; cada DR nova cita a decisão D-NN de docs/sessoes-paralelas/00-DECISOES.md que a originou
depende_de: [T-03.01, T-03.02, T-03.03]
paralelizavel: false
status: concluida   # 2026-09-06 · 10 DRs novas (DR-74 a DR-83), de 73 para 83; testar-conteudo.sh: 33 ok, 0 falhas
```

---

```yaml
id: T-03.05
titulo: Espelhar em .opencode e rodar as seis suítes
objetivo: Fechar a entrega com as duas árvores idênticas e tudo verde
arquivos:
  cria: []
  altera: [.opencode/skills/runx/SKILL.md, .opencode/skills/runx/DECISOES-DA-SKILL.md, .opencode/skills/runx/references/00-schema.md, .opencode/skills/runx/references/01-investigacao.md, .opencode/skills/runx/references/02-plano.md, .opencode/skills/runx/references/03-fix.md, .opencode/skills/runx/references/04-qa.md, .opencode/skills/runx/references/05-relatorio.md, .opencode/skills/runx/references/06-estado.md, .opencode/skills/runx/assets/TEMPLATE-ocorrencia.md, .opencode/skills/runx/assets/TEMPLATE-ORQUESTRADOR.md]
teste_integracao: Roda testar-espelho.sh e as outras cinco suítes e confere 0 falhas em todas
teste_funcional: Dado diff -rq .claude/skills/runx .opencode/skills/runx, não há saída; dado testar.sh, a contagem de casos é maior ou igual a 79
criterio_aceite: As seis suítes saem 0 falhas e diff -rq não reporta diferença nas duas árvores
depende_de: [T-03.04]
paralelizavel: false
status: concluida   # 2026-09-06 · testar.sh 86, testar-falsos-positivos.sh 43, testar-conteudo.sh 33, testar-espelho.sh 2, testar-ponte.sh 10, testar-instalador.sh 4 — todas 0 falhas, 178 casos no total; diff -rq vazio nas duas árvores
```

Cópia byte a byte (`cp`) de cada arquivo alterado nas sprints 02 e 03; nunca edição manual
do lado `.opencode/`. Os comandos em `.opencode/command/` não mudam nesta feature.
