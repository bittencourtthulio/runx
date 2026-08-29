#!/usr/bin/env bash
# runx — instalador para Claude Code e OpenCode.
#
#   ./install.sh                  instala nos dois harnesses, no projeto atual
#   ./install.sh --global         instala nos dois, no diretorio global do usuario
#   ./install.sh --claude         só Claude Code
#   ./install.sh --opencode       só OpenCode
#   ./install.sh --global --claude   combinacoes valem
#   ./install.sh --force          sobrescreve instalacao existente sem perguntar
#   ./install.sh --dry-run        mostra o que faria, sem escrever nada
#   ./install.sh --sem-hooks      instala so a skill, sem hooks nem agentes
#
# Sem --claude/--opencode, instala nos dois.
#
# Hooks e agentes so vao para o Claude Code: o OpenCode tem sistema proprio,
# com formato diferente. La entra so a skill, que funciona igual.

set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# O repositorio ja segue a convencao dos harness: .claude/ e .opencode/.
SKILL_SRC="$SRC/.claude/skills/runx"
CMD_SRC="$SRC/.claude/commands"
HOOK_SRC="$SRC/.claude/hooks"
AGENT_SRC="$SRC/.claude/agents"
OC_SKILL_SRC="$SRC/.opencode/skills/runx"
OC_CMD_SRC="$SRC/.opencode/command"

GLOBAL=0; DO_CLAUDE=0; DO_OPENCODE=0; FORCE=0; DRY=0; NO_HOOKS=0

for arg in "$@"; do
  case "$arg" in
    --global)   GLOBAL=1 ;;
    --claude)   DO_CLAUDE=1 ;;
    --opencode) DO_OPENCODE=1 ;;
    --force)    FORCE=1 ;;
    --dry-run)  DRY=1 ;;
    --sem-hooks) NO_HOOKS=1 ;;
    -h|--help)  sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "opcao desconhecida: $arg (use --help)" >&2; exit 1 ;;
  esac
done

# sem alvo explicito, instala nos dois
if [ "$DO_CLAUDE" -eq 0 ] && [ "$DO_OPENCODE" -eq 0 ]; then DO_CLAUDE=1; DO_OPENCODE=1; fi

[ -f "$SKILL_SRC/SKILL.md" ] || { echo "erro: $SKILL_SRC/SKILL.md nao encontrado" >&2; exit 1; }

say()  { printf '%s\n' "$*"; }
run()  { if [ "$DRY" -eq 1 ]; then say "   [dry-run] $*"; else "$@"; fi; }

install_target() {
  local harness="$1"
  local skills_dir="$2"
  local cmds_dir="$3"
  local origem_skill="${4:-$SKILL_SRC}"
  local origem_cmd="${5:-$CMD_SRC}"
  local skill_dest="$skills_dir/runx"

  say ""
  say "→ $harness"
  say "   skill:    $skill_dest"
  say "   commands: $cmds_dir"

  if [ -e "$skill_dest" ] && [ "$FORCE" -eq 0 ]; then
    if [ -t 0 ]; then
      printf '   já existe. sobrescrever? [s/N] '
      read -r ans </dev/tty
      case "$ans" in [sSyY]*) ;; *) say "   pulado."; return 0 ;; esac
    else
      say "   já existe — pulado (use --force para sobrescrever)."
      return 0
    fi
  fi

  run mkdir -p "$skills_dir" "$cmds_dir"
  run rm -rf "$skill_dest"
  run cp -R "$origem_skill" "$skill_dest"
  for f in "$origem_cmd"/*.md; do run cp "$f" "$cmds_dir/$(basename "$f")"; done

  if [ "$DRY" -eq 0 ]; then
    local n_ref n_asset n_cmd
    n_ref=$(find "$skill_dest/references" -name '*.md' | wc -l | tr -d ' ')
    n_asset=$(find "$skill_dest/assets" -name '*.md' | wc -l | tr -d ' ')
    n_cmd=$(find "$cmds_dir" -name 'runx*.md' | wc -l | tr -d ' ')
    say "   ok — SKILL.md + $n_ref references + $n_asset templates + $n_cmd comandos"
  fi
}

# Hooks e agentes: so no Claude Code. Copia os scripts e registra os hooks no
# settings.json, MESCLANDO — nunca sobrescrevendo o que o usuario ja tem la.
install_hooks() {
  # Uma atribuicao por linha: sob `set -u`, $base ainda nao existe na mesma
  # instrucao `local` em que e declarado.
  local base="$1"
  local hooks_dest="$base/runx-hooks"
  local agents_dest="$base/agents"
  local settings="$base/settings.json"

  say ""
  say "→ hooks e agentes (Claude Code)"
  say "   hooks:    $hooks_dest"
  say "   agentes:  $agents_dest"
  say "   registro: $settings"

  run mkdir -p "$hooks_dest" "$agents_dest"
  run rm -rf "$hooks_dest/comum" "$hooks_dest/runx"
  run cp -R "$HOOK_SRC/comum" "$HOOK_SRC/runx" "$hooks_dest/"
  for f in "$HOOK_SRC"/*.json; do run cp "$f" "$hooks_dest/$(basename "$f")"; done
  for f in "$AGENT_SRC"/*.md; do run cp "$f" "$agents_dest/$(basename "$f")"; done

  if [ "$DRY" -eq 1 ]; then say "   [dry-run] registraria os hooks em $settings"; return 0; fi

  # Caminho ABSOLUTO no settings: o harness pode rodar o hook de outro cwd, e
  # comando relativo ali falha silenciosamente.
  local hooks_abs
  hooks_abs="$(cd "$hooks_dest" && pwd)"

  python3 - "$settings" "$hooks_abs" <<'PY'
import json, os, sys

settings, raiz = sys.argv[1], sys.argv[2]

# Os mesmos grupos de hooks/hooks.json. Um processo por evento, nao um por
# hook: cada `python3` custa ~30 ms de partida, e o orcamento por chamada de
# ferramenta e de 200 ms.
GRUPOS = {
    ("PreToolUse", "Write|Edit"): [
        "comum/segredo-no-commit", "runx/causa-antes-do-plano",
        "runx/regressao-antes-do-fix", "runx/task-so-fecha-verde",
        "runx/escopo-da-ocorrencia",
    ],
    ("PostToolUse", "Write|Edit"): ["comum/rastro-arquivo", "runx/sem-jargao-no-uso"],
    ("PostToolUse", "Bash"): ["comum/rastro-suite"],
}
despachante = os.path.join(raiz, "comum", "despachante.py")

def handler(nomes):
    return {"type": "command",
            "command": 'python3 "%s" %s' % (despachante, " ".join(nomes)),
            "timeout": 15}

try:
    with open(settings, "r", encoding="utf-8") as fh:
        conf = json.load(fh)
except (OSError, json.JSONDecodeError):
    conf = {}

conf.setdefault("hooks", {})
novos = 0

def registra(evento, matcher, nomes):
    global novos
    entradas = conf["hooks"].setdefault(evento, [])
    alvo = next((e for e in entradas if e.get("matcher") == matcher), None)
    if alvo is None:
        alvo = {"matcher": matcher, "hooks": []}
        entradas.append(alvo)
    alvo.setdefault("hooks", [])
    cmd = handler(nomes)
    # Idempotente: tira registro antigo do runx (inclusive o formato de um
    # processo por hook) antes de por o atual.
    alvo["hooks"] = [h for h in alvo["hooks"]
                     if "runx-hooks" not in str(h.get("command", ""))]
    alvo["hooks"].append(cmd)
    novos += 1

for (evento, matcher), nomes in GRUPOS.items():
    registra(evento, matcher, nomes)

if os.path.exists(settings):
    backup = settings + ".runx-backup"
    if not os.path.exists(backup):
        with open(settings, "r", encoding="utf-8") as o, open(backup, "w", encoding="utf-8") as d:
            d.write(o.read())
        print(f"   backup do settings anterior: {os.path.basename(backup)}")

os.makedirs(os.path.dirname(settings) or ".", exist_ok=True)
with open(settings, "w", encoding="utf-8") as fh:
    json.dump(conf, fh, indent=2, ensure_ascii=False)
    fh.write("\n")

print(f"   ok — {novos} despachante(s) registrado(s), "
      f"{sum(len(v) for v in GRUPOS.values())} hooks no total")
PY

  if [ "$DRY" -eq 0 ]; then
    local n_ag; n_ag=$(find "$agents_dest" -name '*.md' | wc -l | tr -d ' ')
    say "   ok — $n_ag agentes (somente leitura)"
    say ""
    say "   Hooks de metodo nascem em AVISO: registram e deixam passar."
    say "   Veja o estado com:  python3 $hooks_dest/comum/doctor.py"
  fi
}

say "runx — instalando ($([ "$GLOBAL" -eq 1 ] && echo global || echo projeto))"

if [ "$DO_CLAUDE" -eq 1 ]; then
  if [ "$GLOBAL" -eq 1 ]; then
    install_target "Claude Code" "$HOME/.claude/skills" "$HOME/.claude/commands"
    if [ "$NO_HOOKS" -eq 0 ]; then install_hooks "$HOME/.claude"; fi
  else
    install_target "Claude Code" ".claude/skills" ".claude/commands"
    if [ "$NO_HOOKS" -eq 0 ]; then install_hooks ".claude"; fi
  fi
fi

if [ "$DO_OPENCODE" -eq 1 ]; then
  if [ "$GLOBAL" -eq 1 ]; then
    install_target "OpenCode" "$HOME/.config/opencode/skills" "$HOME/.config/opencode/command" "$OC_SKILL_SRC" "$OC_CMD_SRC"
  else
    install_target "OpenCode" ".opencode/skills" ".opencode/command" "$OC_SKILL_SRC" "$OC_CMD_SRC"
  fi
fi

say ""
say "Reinicie a sessao do seu harness para a skill ser carregada."
say "Depois, cole o relato do cliente — ou rode /runx."
