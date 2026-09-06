# Área — Detecção da ocorrência atual e ancoragem da raiz

Esta área existe porque tudo no runx assume **uma sessão, um checkout, uma ocorrência por
vez**. Quando três ferramentas trabalham no mesmo checkout, as três suposições caem juntas, e
cada uma cai em silêncio: o hook fala de outra ocorrência, o rastro vai para o arquivo errado,
a raiz vira o diretório de trabalho corrente.

## 1. O que é e onde vive

- `.claude/hooks/comum/expx_rastro.py` — `raiz_repo()`, `pasta_ocorrencia()`, `trabalho_id()`
- `.claude/skills/runx/SKILL.md` — máquina de estados "detectada pelo disco em `docs/manutencao/<OC-ID>-<slug>/`"
- `.claude/skills/runx/references/06-estado.md` — `.expx/estado.json`, um por raiz, "somente exibição"
- `.claude/commands/runx-fix.md` e irmãos — "se houver mais de uma aberta, liste-as ... e peça que o usuário escolha"

## 2. Como a ocorrência atual é escolhida hoje (evidência)

`expx_rastro.pasta_ocorrencia()` (linhas 285-325):

1. lista `docs/manutencao/*/`;
2. para cada pasta, toma o `mtime` do `ORQUESTRADOR.md` (ou do `00-OCORRENCIA.md` antes do E2);
3. separa abertas de encerradas pelo frontmatter (`status: concluido` ou `concluido_em` preenchido);
4. **devolve a aberta mais recentemente modificada**.

Consequência direta para sessões paralelas: com as ocorrências A e B abertas no mesmo
checkout, o hook `escopo-da-ocorrencia` da sessão que trabalha em A passa a cobrar o escopo
de B assim que a sessão de B grava qualquer arquivo do plano. O aviso sai com o `trabalho_id`
errado e o rastro de B recebe eventos de A.

O comentário do próprio código já registra um sintoma dessa fragilidade: "Ocorrencia
encerrada nao volta a ser 'a atual' so porque um `git pull` mexeu no mtime". O mtime foi
remendado uma vez; ele não suporta duas ocorrências abertas.

## 3. Como a raiz é ancorada hoje (evidência)

`raiz_repo()` (linhas 27-40) sobe diretórios até encontrar **`os.path.isdir(".git")`**; sem
encontrar, devolve o diretório de partida.

Em um `git worktree`, `.git` **é um arquivo**, não um diretório — provado em bancada em
2026-09-06 com git 2.50.1:

```
$ cat .git
gitdir: /.../repo/.git/worktrees/repo--OC-1
```

Chamado da raiz do worktree, `raiz_repo()` devolve a raiz por acidente (o fallback é o cwd).
Chamado de um subdiretório (`src/`), devolve `src/` — e a partir daí `docs/manutencao/` não
é encontrado, `pasta_ocorrencia()` devolve `None` e **todos os hooks de método passam a sair
com 0 sem avaliar nada**. Falha aberta, invisível.

## 4. Onde cada arquivo de estado é ancorado

| Arquivo | Ancoragem | Versionado |
|---|---|---|
| `docs/manutencao/<OC>/` | raiz do repositório (`raiz_repo`) | sim |
| `docs/relatorios/` | raiz do repositório | sim |
| `docs/eventos/<id>.jsonl` (rastro) | raiz do repositório | não (`.gitignore` do projeto) |
| `.expx/estado.json` | raiz do repositório | não |
| `.expx/hooks.json` (modo dos hooks) | raiz do repositório | não |

Em um worktree, tudo que não é versionado **não existe** ao nascer: provado em bancada,
`ls .expx` no worktree recém-criado responde "No such file or directory". A regra do
`06-estado.md` — "`.expx/` ausente significa que o CLI não instalou o ecossistema; não crie"
— foi escrita para o checkout único e, lida literalmente num worktree, desliga a barra de
status e os modos de hook de toda ocorrência isolada.

## 5. O que a máquina de estados sabe sobre "mais de uma aberta"

Os seis comandos (`runx*.md`) preveem o caso: "se houver mais de uma aberta, liste-as com o
estágio de cada uma e peça que o usuário escolha". Ou seja, o método tolera duas ocorrências
abertas na mesma pasta, mas **os hooks não**: eles não têm como perguntar e escolhem pelo mtime.

## 6. Identidade de sessão — o que o ambiente oferece hoje (evidência)

Medido de dentro da ferramenta `Bash` do Claude Code em 2026-09-06:

- variáveis: `CLAUDECODE=1`, `CLAUDE_CODE_SESSION_ID=<uuid>`, `CLAUDE_PID=<pid>`,
  `CLAUDE_CODE_ENTRYPOINT=claude-vscode`;
- ancestralidade de processo: `zsh` → binário `claude` (pid = `CLAUDE_PID`) → VS Code.

O payload dos hooks do Claude Code traz `session_id` (contrato documentado do harness). O
runx **não lê nada disso**: `ler_evento()` (linha 67) devolve o JSON inteiro e nenhum hook
consulta `session_id`; `grava()` (linha 390) escreve as doze chaves do contrato e nada sobre
quem gravou.

Para OpenCode e MimoCode, ver `harnesses.md` §4: nenhum dos dois exporta id de sessão para o
shell, mas os dois têm hook `shell.env` que permite injetá-lo.

## 7. Riscos desta área para o plano

| Risco | Severidade | Onde é tratado |
|---|---|---|
| `raiz_repo` não reconhece `.git` arquivo: hooks falham abertos em worktree | ALTA | D-06 |
| `pasta_ocorrencia` por mtime com duas abertas: escopo e rastro trocados | ALTA | D-01, D-08 |
| `.expx/` inexistente no worktree desliga barra e modos de hook | MÉDIA | D-04 |
| Rastro sem identidade: não se sabe qual ferramenta fez o quê | MÉDIA | D-09, D-10 |
