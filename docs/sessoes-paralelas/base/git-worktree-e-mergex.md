# Área — `git worktree` e a abertura de branch da mergex

Esta área existe porque o isolamento por worktree é a decisão que resolve a maior parte do
relato, e ela precisa nascer alinhada com quem já cuida da branch: a mergex.

## 1. O que é e onde vive

- `git worktree add [-b <branch>] <dir> [<base>]` — git 2.50.1 nesta máquina
- `mergex/references/00-abertura.md` — E0 da mergex: nome da branch, base, retomada, árvore limpa
- `mergex/references/integracao/runx.md` — quando a mergex entra no fluxo da runx
- `runx/references/03-fix.md` — hoje só cita `git worktree` como meio de o revisor provar a regressão contra o código anterior

## 2. Bancada (2026-09-06, scratchpad, git 2.50.1)

Repositório com `.gitignore` ignorando `.expx/` e `docs/eventos/`, um commit, um arquivo
não rastreado em `docs/`, `.expx/hooks.json` presente. Depois de
`git worktree add -b fix/OC-1 ../repo--OC-1 main`:

| Pergunta | Resultado |
|---|---|
| `.git` no worktree é | **arquivo** com `gitdir: <principal>/.git/worktrees/repo--OC-1` |
| `git rev-parse --git-common-dir` | `<principal>/.git` |
| `git rev-parse --show-toplevel` | a raiz do worktree |
| arquivo não rastreado do principal aparece? | **não** (`docs/` não existe no worktree) |
| `.expx/` (ignorado) aparece? | **não** |
| `git stash` feito no principal afeta o worktree? | **não** — `git status --porcelain` do worktree continua vazio |
| `git worktree list` | lista os dois, com branch de cada um |

Os dois últimos são o que resolve o relato: stash e checkout de uma sessão **não alcançam**
a árvore da outra. O terceiro e o quarto são o custo: tudo que é local e não versionado
(`.expx/`, `.env`, `settings.local.json`, `node_modules/`) **não nasce** no worktree.

## 3. O que a mergex faz na abertura (evidência)

`00-abertura.md`, acionada "pela runx no início do E3, antes da primeira task":

1. Passo 2 — `git status --porcelain` **precisa estar vazio**; arquivo não rastreado (`??`)
   também conta. Caso contrário PARA e avisa. (Hoje, no checkout único, os artefatos de
   `docs/manutencao/<OC>/` do E1/E2 já estão não rastreados neste momento — a restrição é
   pré-existente e não muda com o worktree. Registrada em L-04.)
2. Passo 3 — branch base, nesta ordem: `CONVENCOES.md` da stackx → `git symbolic-ref
   refs/remotes/origin/HEAD` → a branch atual se for `main`/`master`/`develop`.
3. Passo 4 — nome: `fix/<OC-ID>-<slug>` para `bug`, `chore/<OC-ID>-<slug>` para os demais
   tipos; convenção do repositório ou do `CONVENCOES.md` vence. **Se a branch já existe,
   retoma nela** (`git switch <nome>`) e registra a retomada. Se não, `git switch -c`.
4. Passo 5 — uma linha no `ORQUESTRADOR.md` ("Branch do trabalho: ..."), cria
   `docs/entregas/<id>/ENTREGA.md`, grava `branch` no `.expx/estado.json`.

Consequência: se o runx criar o worktree **já na branch com o nome que a mergex vai
calcular**, a mergex retoma em vez de criar, e nada duplica. O cálculo do nome e da base
precisa ser o mesmo — copiado, não reinterpretado.

## 4. O `branch` do `estado.json` é da mergex

`06-estado.md`, tabela de donos: `branch` e `pr_estado` pertencem à mergex. A runx **não
grava `branch`** mesmo tendo criado a branch; ela grava o caminho do worktree no kind
`ocorrencia` (D-03), que é exclusivo dela.

## 5. `EnterWorktree` do Claude Code — o que aceita (evidência, schema da ferramenta)

- `name` → cria em `.claude/worktrees/<name>` numa branch nova (base governada por `worktree.baseRef`);
- `path` → **entra em worktree existente**, desde que apareça em `git worktree list`
  ("on first entry from the launch directory"). Trocando de dentro de outro worktree, o alvo
  precisa estar em `.claude/worktrees/`;
- a sessão passa a ter o worktree como diretório de trabalho; caches dependentes do cwd
  (CLAUDE.md, memória) são recarregados.

Logo, o runx cria o worktree onde quiser e o Claude Code entra nele com `path`. OpenCode e
MimoCode entram sendo abertos no diretório.

## 6. Riscos desta área para o plano

| Risco | Severidade | Onde é tratado |
|---|---|---|
| Worktree sem dependências instaladas: E1 não consegue provar a causa com teste | ALTA | D-05 |
| Worktree sem `.env`: suíte falha por configuração, não por defeito | ALTA | D-05 |
| Branch criada pelo runx com nome diferente do que a mergex calcula → duas branches | MÉDIA | D-02 copia a regra de nome e de base da mergex |
| Worktree órfão depois do E5 (pasta irmã fica no disco) | BAIXA | D-07: E5 registra e não remove; remoção é da pessoa |
