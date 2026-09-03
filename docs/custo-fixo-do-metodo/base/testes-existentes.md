# Área — Suíte de testes do repositório RunX

## 1. O que é e onde vive

- `.claude/hooks/testes/testar.sh` — banco de casos dos hooks
- `.claude/hooks/testes/testar-falsos-positivos.sh` — casos que NÃO podem disparar

Não existe suíte de testes para o conteúdo markdown das skills (SKILL.md, references,
assets). O que é testável hoje neste repositório são os hooks Python.

## 2. Contrato de entrada

`testar.sh` monta uma ocorrência de mentira em `$(mktemp -d)`:

```
$W/docs/manutencao/OC-2026-0142-calculo-frete/sprint-01/
$W/docs/manutencao/OC-2026-0142-calculo-frete/base/
$W/.git/
$W/src/frete/
$W/docs/relatorios/2026-08-29-OC-2026-0142-calculo-frete/
```

Cada caso é `caso <nome> <exit esperado> <hook> <json do evento>`, e o JSON é entregue
no stdin do hook, rodando com `cd "$W"`.

## 3. Contrato de saída

Imprime uma linha por caso (`ok` ou `FALHA`) e, ao final, `N ok, M falhas`.
Ao final também valida o rastro gravado: conta eventos e confere que toda linha tem as
12 chaves do contrato `expx-eventos`.

## 4. Estrutura de dados

Os arquivos de mentira que a suíte escreve, e que definem o formato que os hooks esperam:

- `$OC/01-CAUSA-RAIZ.md` (função `escreve_causa`)
- `$OC/sprint-01/tasks.md`
- `$OC/00-OCORRENCIA.md`
- `$OC/ORQUESTRADOR.md`

**`$OC/sprint-01/tasks.md` é escrito literalmente nesse caminho** — a suíte codifica a
mesma premissa que os hooks: o arquivo de tasks se chama `tasks.md` e vive em `sprint-NN/`.

## 5. Funções e trechos relevantes

```bash
caso() { # caso <nome> <esperado> <hook> <json>
  local nome="$1" esperado="$2" hook="$3" json="$4" saida real
  saida=$(printf '%s' "$json" | (cd "$W" && python3 "$hook") 2>&1); real=$?
```

```bash
w() { printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' "$W/$1" "$2"; }
```

## 6. Quem chama e quem é chamado

- Executado à mão: `bash .claude/hooks/testes/testar.sh`
- Chama todos os hooks em `.claude/hooks/comum/` e `.claude/hooks/runx/`
- Não há CI configurado que o rode: `.github/` contém apenas o que está registrado na área
  `arvores-espelhadas.md`

## 7. Testes existentes — resultado da linha de base

Execução em 2026-09-02, antes de qualquer mudança desta feature:

```
56 ok, 0 falhas
```

Grupos de casos observados na saída:
- `segredo-no-commit` (segurança, nasce em bloqueio)
- `causa-antes-do-plano`, `regressao-antes-do-fix`, `task-so-fecha-verde`,
  `escopo-da-ocorrencia`, `sem-jargao-no-uso` (método, nascem em aviso)
- robustez: stdin vazio e JSON quebrado para cada hook — todos exit 0
- despachante: mesma semântica em um processo
- rastro: 22 eventos, todas as linhas com as 12 chaves

## 8. Limites e regras de negócio conhecidas

- A suíte roda em `/tmp`, sem tocar o repositório real.
- Hook de método precisa sair 0 com entrada inválida — é caso de teste explícito.
- O `trap 'rm -rf "$W"' EXIT` limpa o diretório temporário ao fim.

## 9. Riscos para esta ocorrência

- **ALTO — é a única rede de proteção automatizada do repositório.** Qualquer mudança nos
  hooks ou no formato dos arquivos do plano precisa manter `testar.sh` verde, e a suíte
  precisa ganhar casos novos para o formato condensado; senão o formato novo fica sem
  cobertura nenhuma.
- **MÉDIO — a suíte escreve `sprint-01/tasks.md`.** Se o formato condensado mudar o nome do
  arquivo, os casos existentes continuam passando (testam o formato antigo) enquanto o
  formato novo passa despercebido. Falso verde.

## 10. Fonte

- `.claude/hooks/testes/testar.sh` — acessado em 2026-09-02
- `.claude/hooks/testes/testar-falsos-positivos.sh` — acessado em 2026-09-02
- Execução `bash .claude/hooks/testes/testar.sh` — 2026-09-02, saída "56 ok, 0 falhas"
