# Área — As duas árvores de skill e a distribuição

## 1. O que é e onde vive

O repositório mantém DUAS cópias da skill, hoje byte a byte idênticas:

- `.claude/skills/runx/` — Claude Code
- `.opencode/skills/runx/` — OpenCode

Confirmado em 2026-09-02: `diff -rq .claude/skills/runx .opencode/skills/runx` não
reporta diferença.

Também duplicados:
- `.claude/commands/*.md` (6 arquivos) e `.opencode/command/*.md` (6 arquivos)

Não duplicados (só Claude Code): `.claude/hooks/`, `.claude/agents/`.

## 2. Contrato de entrada

`install.sh` recebe as flags `--sem-hooks`, `--dry-run` (e outras registradas no cabeçalho
do arquivo) e instala a skill no diretório do usuário.

## 3. Contrato de saída

O que o instalador copia, de `install.sh`:

| Origem no repo | Destino instalado |
|---|---|
| `.claude/skills/runx` | `<base>/skills/runx` |
| `.claude/commands/*.md` | `<base>/commands/` |
| `.claude/hooks/comum` e `.claude/hooks/runx` | **`<base>/runx-hooks/`** |
| `.claude/hooks/*.json` | `<base>/runx-hooks/` |
| `.claude/agents/*.md` | `<base>/agents/` |
| `.opencode/skills/runx` | destino OpenCode |

## 4. Estrutura de dados — a discrepância de caminho, explicada

O `SKILL.md` e os references instruem a rodar:

```
python3 .claude/runx-hooks/comum/rastro.py ...
```

No repositório o arquivo está em `.claude/hooks/comum/rastro.py` — caminho diferente.

**Não é erro nos references.** `install.sh` linha 96 define
`local hooks_dest="$base/runx-hooks"`, e as linhas 107-109 copiam `comum/` e `runx/`
para lá. Ou seja: no ambiente INSTALADO o caminho documentado existe; no repositório de
desenvolvimento, não. Os references descrevem o destino, não a origem.

**Consequência:** rodar `rastro.py` pelo caminho do SKILL.md dentro deste repositório
falha. Como o `rastro.py` sai com 0 em qualquer erro, a falha é silenciosa.

## 5. Funções e trechos relevantes

`install.sh`, linhas 106-110:

```bash
run mkdir -p "$hooks_dest" "$agents_dest"
run rm -rf "$hooks_dest/comum" "$hooks_dest/runx"
run cp -R "$HOOK_SRC/comum" "$HOOK_SRC/runx" "$hooks_dest/"
for f in "$HOOK_SRC"/*.json; do run cp "$f" "$hooks_dest/$(basename "$f")"; done
for f in "$AGENT_SRC"/*.md; do run cp "$f" "$agents_dest/$(basename "$f")"; done
```

## 6. Quem chama e quem é chamado

- `install.sh` → lê `.claude/` e `.opencode/`, escreve no diretório do usuário
- `README.md` documenta a instalação (26.505 bytes)
- Não há workflow de CI que rode `install.sh` nem `testar.sh`: `.github/` não contém
  `workflows/` (verificado em 2026-09-02)

## 7. Testes existentes

`NÃO DETERMINADO` — não há teste automatizado que verifique o espelhamento entre
`.claude/skills/runx/` e `.opencode/skills/runx/`. A conferência é manual, por
`diff -rq`. Registrado em `00-LACUNAS.md`.

## 8. Limites e regras de negócio conhecidas

Decisão DR-44 do `DECISOES-DA-SKILL.md`:

> Todo arquivo criado ou alterado foi espelhado na `.opencode/`, e o espelhamento foi
> conferido com `diff -rq`. [...] Deixar a `.opencode/` para trás faria a skill se
> comportar diferente nos dois harnesses, e o `install.sh` distribuiria a versão sem a
> barra de status.

DR-45: a skill grava o `.expx/estado.json` igual nos dois harnesses e não tenta detectar
qual está rodando.

## 9. Riscos para esta ocorrência

- **ALTO — toda mudança precisa ser espelhada.** Uma melhoria aplicada só em
  `.claude/skills/runx/` faz a skill se comportar diferente nos dois harnesses, e o
  `install.sh` distribui a versão incompleta para OpenCode. DR-44 é explícita.
- **MÉDIO — o espelhamento não tem verificação automática.** É o tipo de passo que se
  esquece. Um teste de espelhamento seria barato e evitaria a classe inteira de erro.
- **BAIXO — a discrepância `.claude/runx-hooks/` vs `.claude/hooks/`** é correta por
  desenho, mas confunde quem lê o repositório. Vale uma linha de nota, não uma correção.

## 10. Fonte

- `install.sh` — acessado em 2026-09-02
- `diff -rq .claude/skills/runx .opencode/skills/runx` — executado em 2026-09-02, sem diferenças
- `.claude/skills/runx/DECISOES-DA-SKILL.md`, DR-44 e DR-45 — acessado em 2026-09-02
- `ls .github/` — executado em 2026-09-02
