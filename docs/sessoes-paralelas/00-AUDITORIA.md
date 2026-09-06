# Auditoria — sessoes-paralelas

**Data:** 2026-09-06

Auditoria do plano em `sprint-01/`, `sprint-02/` e `sprint-03/` contra os 9 itens do Passo 2
da F5. Verificação automática executada sobre o frontmatter das três `tasks.md` **com o
parser dos próprios hooks** (`expx_rastro.frontmatter`): 20 tasks, 6 fases; campos, tamanho
dos testes, dependências, ciclos, colisões de arquivo entre tasks na mesma janela paralela,
tasks listadas em fase, adjetivos, decisão humana, caminho absoluto, caminho crítico.
Verificação de julgamento feita por leitura.

## Achados

| severidade | arquivo | problema | correção sugerida |
|---|---|---|---|
| MÉDIA | sprint-02/tasks.md | `pasta_ocorrencia()` continua escolhendo por mtime. O plano torna a escolha exata pela regra 16 (uma aberta por árvore) e avisa na violação (T-02.08), mas **não muda a heurística**: sem git, ou com opt-out "sem worktree" e duas ocorrências abertas, os hooks continuam podendo cobrar o escopo da ocorrência errada. | Nenhuma mudança de plano: é o comportamento atual, agora com aviso na origem (T-02.08) e pergunta no E1 Passo 0.a (T-02.03). Registrado como risco consciente. Se aparecer em uso real, vira ocorrência própria: ponteiro `.expx/ocorrencia` por raiz. |
| MÉDIA | sprint-02/tasks.md | T-02.03 é a maior task de texto do plano (seis passos, três comportamentos por harness) e sua rede é a asserção `e1-passo-worktree`, que casa três literais. Um Passo 0.b incompleto passaria. | Sem mudança de plano: a prosa de T-02.03 lista os seis passos e o `criterio_aceite` exige a frase "sem git nada muda". Ao executar T-01.02, incluir em `e1-passo-worktree` também os literais `EnterWorktree` e `git worktree list` — está dentro do escopo daquela task. |
| BAIXA | sprint-02/tasks.md | A varredura automática de adjetivos acusou "limpa" em T-02.11 (`teste_funcional`). É o nome do hook `arvore-limpa-antes-da-suite`, não um juízo. | Falso positivo. Sem ação. |
| BAIXA | sprint-03/tasks.md | O `criterio_aceite` de T-03.04 é contagem (`grep -c '^| DR-'` +8), que DRs vazias satisfariam. | A segunda cláusula do critério ("cada DR nova cita a D-NN que a originou") é de leitura, e o revisor de testes do §5 do ORQUESTRADOR a cobra. Sem ação. |
| BAIXA | sprint-03/tasks.md | T-03.05 enumera onze arquivos de `.opencode/` a espelhar. Se uma task da sprint-02 tocar um arquivo da skill fora dessa lista, o espelhamento o perde — mas `testar-espelho.sh` acusa. | O `criterio_aceite` de T-03.05 exige `diff -rq` sem saída, que pega o esquecimento. Sem ação. |

## Verificações que passaram

1. **Task sem teste** — as 20 tasks têm `teste_integracao`, `teste_funcional`, `criterio_aceite` e `objetivo` com mais de 25 caracteres; `arquivos` sempre com `cria` e `altera`; `status: pendente`; `paralelizavel` booleano.
2. **Teste que passaria com implementação errada** — cada asserção de conteúdo (T-01.02) casa estrutura: contagem de regras, chave no bloco YAML, comando literal com flag, seção nomeada. Os casos de hook (T-02.08 a T-02.10) cobrem o positivo **e** os falsos positivos, com o exit code e o stderr conferidos. A ponte (T-01.03) é testada campo a campo do JSON, com o `hooks.json` real decidindo as listas.
3. **Critério de aceite subjetivo** — nenhum adjetivo de juízo; todos os 20 critérios citam código de saída, contagem, presença estrutural ou `diff` vazio. (Único hit automático: "limpa", falso positivo — achado BAIXA acima.)
4. **Dependência circular** — nenhuma; travessia com detecção de ciclo sobre as 20 tasks. Toda dependência aponta para task existente.
5. **Paralelismo falso** — as 12 tasks `paralelizavel: true` não compartilham arquivo com nenhuma outra task da mesma janela (mesma fase, ou fases declaradas `paralela_com`). Verificado por interseção de conjuntos; F-02.1 (6 tasks) e F-02.2 (5 tasks) são disjuntas por diretório (`.claude/skills/` vs `.claude/hooks/`).
6. **Sequencialidade desnecessária no caminho crítico** — a cadeia da F-02.2 é real: quatro tasks editam `testar.sh` e três usam `sessao()` de T-02.07. T-03.02 depende de T-03.01 porque instala o arquivo que ela cria. Os dois portões entre sprints são reais: verificadores antes de conteúdo (regra 13); `hooks.json` fechado antes da ponte que o lê.
7. **Task que exigiria decisão humana** — nenhuma ocorrência de "confirmar com", "a definir", "decidir depois" ou "perguntar ao usuário" em campo de task. As três escolhas reversíveis pelo usuário (D-01, D-02, D-04) são decisões **fechadas** em `00-DECISOES.md`; revertê-las é mudar o plano antes da execução, não perguntar durante.
8. **Pré-requisito externo não declarado** — `node` (para `testar-ponte.sh`) está declarado e o script sai 1 nomeando a falta; `git` está declarado. Nenhum segredo, conta ou serviço. `HOME` temporário no teste do instalador evita tocar a máquina de quem testa.
9. **Base ignorada** — cada risco ALTA das tabelas da base tem task: `raiz_repo` em worktree (deteccao-e-raiz §7 → T-01.01, T-02.07); escopo/rastro trocados entre ocorrências (→ D-01, T-02.03, T-02.08; ver achado MÉDIA); suíte contaminada e volta falsa (suite-e-qa §6 → T-02.05, T-02.10); ponte traduzindo errado (hooks-e-rastro §9 → T-01.03, T-03.01); worktree sem dependências ou sem `.env` (git-worktree-e-mergex §6 → T-02.03). Os riscos MÉDIA de harnesses §7 estão em T-03.01 (aviso por `callID`, `metadata.exit`) e na verificação manual do ORQUESTRADOR §7.

VEREDITO: SIM — o plano está pronto para execução autônoma.
