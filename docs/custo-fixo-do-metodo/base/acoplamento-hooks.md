# Área — Acoplamento dos hooks e do rastro aos arquivos do plano

Esta área existe porque as três melhorias mexem em arquivos que scripts determinísticos
leem por caminho fixo. Diferente da prosa das skills, um script que não encontra o arquivo
não avisa: ele falha aberta (sai com 0) e o portão simplesmente deixa de existir.

## 1. O que é e onde vive

- `.claude/hooks/comum/expx_rastro.py` — biblioteca comum, parser de frontmatter e rastro
- `.claude/hooks/comum/despachante.py` — roda vários hooks em um processo
- `.claude/hooks/comum/rastro-arquivo.py` — `PostToolUse`, grava `arquivo_alterado`
- `.claude/hooks/comum/rastro-suite.py` — `PostToolUse` em Bash, grava `suite_executada`
- `.claude/hooks/runx/task-so-fecha-verde.py` — `PreToolUse`, barra conclusão sem suíte verde
- `.claude/hooks/runx/escopo-da-ocorrencia.py` — `PreToolUse`, barra escrita fora do escopo
- `.claude/hooks/runx/regressao-antes-do-fix.py` — `PreToolUse`, barra código antes do teste
- `.claude/hooks/hooks.json` — registro dos hooks no harness

## 2. Contrato de entrada

Cada hook recebe o evento JSON do harness no stdin, com `tool_name`, `tool_input`
(contendo `file_path`, `content` ou `old_string`/`new_string`) e, no `PostToolUse`,
`tool_response`.

## 3. Contrato de saída

- exit 0 = permite (silencioso)
- exit 2 = bloqueia, com a mensagem no stderr voltando ao modelo
- Hook de método falha ABERTA: qualquer exceção sai com 0

## 4. Estrutura de dados — os caminhos fixos (evidência)

Levantado por `grep -rn "tasks\.md" .claude/` em 2026-09-02:

| Arquivo | Linha | Como acessa |
|---|---|---|
| `.claude/hooks/runx/task-so-fecha-verde.py` | 19 | `ALVO = re.compile(r"(?:^\|/)docs/manutencao/([^/]+)/sprint-[^/]+/tasks\.md$")` |
| `.claude/hooks/runx/escopo-da-ocorrencia.py` | 77 | `R.frontmatter(os.path.join(pasta, sprint, "tasks.md"))` |
| `.claude/hooks/runx/regressao-antes-do-fix.py` | 62 | `R.frontmatter(os.path.join(pasta, sprint, "tasks.md"))` |
| `.claude/hooks/comum/rastro-arquivo.py` | 28 | `R.frontmatter(os.path.join(pasta, sprint, "tasks.md"))` |

Os três últimos iteram sobre `sorted(d for d in os.listdir(pasta) if d.startswith("sprint-"))`.

**Consequência dura:** os quatro leem o frontmatter de UM arquivo cujo nome é literalmente
`tasks.md`, dentro de uma pasta que começa com `sprint-`. O `task-so-fecha-verde` é o mais
rígido: casa por regex sobre o caminho completo do arquivo sendo escrito.

## 5. Funções e trechos relevantes

`expx_rastro.py`, função `frontmatter(caminho)`: lê APENAS o primeiro bloco YAML do
arquivo, delimitado pelo primeiro `---` na primeira linha e o `---` seguinte:

```python
if fh.readline().strip() != "---":
    return {}
linhas = []
for linha in fh:
    if linha.strip() == "---":
        break
    linhas.append(linha.rstrip("\n"))
```

**Consequência dura:** um arquivo condensado com TRÊS blocos YAML em sequência teria
apenas o PRIMEIRO lido. As chaves `tasks:` de um segundo ou terceiro bloco seriam
invisíveis para os quatro hooks e para o rastro.

`expx_rastro.py`, função `pasta_ocorrencia(raiz)`: descobre a ocorrência em andamento
pelo `ORQUESTRADOR.md` mais recente cujo `status` não é `concluido`.

## 6. Quem chama e quem é chamado

- `hooks.json` → `despachante.py` → cada hook, importado como módulo
- Cada hook → `expx_rastro.py` (parser, modo, rastro)
- `doctor.py` → lê `.expx/hooks.json` e mostra o modo de cada hook
- Testes: `.claude/hooks/testes/testar.sh` e `testar-falsos-positivos.sh`

## 7. Testes existentes

Existem `.claude/hooks/testes/testar.sh` e `.claude/hooks/testes/testar-falsos-positivos.sh`.
O que exatamente cobrem está registrado na área `testes-existentes.md`.

## 8. Limites e regras de negócio conhecidas

- `SKILL.md`, seção "Hooks e agentes": "Hook de método **nasce em modo aviso**"
- "Um hook de método que quebra nunca trava o trabalho: registra o erro e sai com 0."
- "**Hook que dá falso positivo é desinstalado, e junto com ele vão os que funcionavam**"
- Orçamento declarado em `hooks.json`: "cada python3 custa ~30 ms de partida, e cinco processos estourariam o orcamento de 200 ms por chamada de ferramenta"

## 9. Riscos para esta ocorrência

- **ALTO — o andaime condensado pode desligar 4 hooks em silêncio.** Se o plano condensado
  não gravar um arquivo literalmente chamado `sprint-NN/tasks.md` com a lista `tasks:` no
  PRIMEIRO bloco YAML, os quatro hooks acima param de encontrar as tasks. Nenhum deles dá
  erro: todos falham abertos. O método perde os portões sem ninguém perceber.
- **ALTO — múltiplos blocos YAML no mesmo arquivo não funcionam.** O parser lê só o primeiro.
- **MÉDIO — a suíte parcial (melhoria 2) interage com `task-so-fecha-verde`**, que hoje exige
  `suite: verde` para permitir `status: concluida`. Se `suite` passar a admitir um valor novo
  (ex.: `parcial`), o hook precisa aceitá-lo, senão barra toda conclusão de task.
- **MÉDIO — `rastro-suite.py` classifica a suíte por código de saída**, não distingue suíte
  parcial de completa. O rastro perderia a distinção sem um campo novo.

## 10. Fonte

- `.claude/hooks/comum/expx_rastro.py` — acessado em 2026-09-02
- `.claude/hooks/runx/task-so-fecha-verde.py` — acessado em 2026-09-02
- `.claude/hooks/runx/escopo-da-ocorrencia.py` — acessado em 2026-09-02
- `.claude/hooks/runx/regressao-antes-do-fix.py` — acessado em 2026-09-02
- `.claude/hooks/comum/rastro-arquivo.py` — acessado em 2026-09-02
- `.claude/hooks/hooks.json` — acessado em 2026-09-02
- `grep -rn "tasks\.md" .claude/` — executado em 2026-09-02
