# Área — Suítes de teste do repositório

Esta área existe porque toda task deste plano precisa de um teste que falhe antes. As
suítes que existem definem onde cada teste novo entra.

## 1. O que existe e a linha de base (medida em 2026-09-06, HEAD `f2f7916`)

| Script | O que cobre | Linha de base |
|---|---|---|
| `.claude/hooks/testes/testar.sh` | os hooks Python contra uma ocorrência de mentira em `$W` | **59 ok, 0 falhas** |
| `.claude/hooks/testes/testar-falsos-positivos.sh` | escritas legítimas que os hooks não podem barrar | **38 ok, 0 falhas** |
| `.claude/hooks/testes/testar-conteudo.sh` | o markdown da skill diz o que o método exige (21 asserções nomeadas) | **20 ok, 0 falhas** |
| `.claude/hooks/testes/testar-espelho.sh` | `.claude/skills/runx` ≡ `.opencode/skills/runx`; `.claude/commands` ≡ `.opencode/command` | **2 ok, 0 falhas** |

Não há CI (`.github/workflows/` não existe); não há lint nem type check.

## 2. Como `testar.sh` monta a fixture (evidência)

Linhas 6-9: `W=$(mktemp -d)`, `mkdir -p "$OC/sprint-01" "$OC/base" "$W/.git" ...`. O `.git`
é um diretório vazio. `caso <nome> <exit esperado> <hook> <json>` roda o hook com `cd "$W"` e
o JSON no stdin. Os helpers `escreve_causa`, `escreve_tasks`, `w()` geram os artefatos.

Para hooks que consultem `git` (árvore suja, worktree), a fixture precisa virar um
repositório de verdade: `git init` + commit inicial, e um worktree derivado para os casos
de raiz. É a primeira task do plano (regra 13 da sprintx).

## 3. Como `testar-conteudo.sh` afirma (evidência)

`afirma <nome> <descrição> <predicado...>`; predicados `tem <arquivo> <regex>` e
`conta_ge <arquivo> <regex> <n>`. A asserção `regras-continuam-15` (linha 135) conta as
regras invioláveis do `SKILL.md`. Este plano acrescenta a regra 16 (D-01), então essa
asserção **muda para 16 antes** do `SKILL.md` mudar — é o vermelho esperado.

## 4. O que não tem teste hoje

- a ponte JS (não existe);
- o `install.sh` (nenhum teste, nem de `--dry-run`);
- o conteúdo do `README.md`.

## 5. Ferramentas disponíveis na máquina

`node v20.20.1`, `python3` 3.11, `git 2.50.1`, `bash`. A ponte JS é testada com `node`
carregando o arquivo e chamando os hooks com eventos falsos.
