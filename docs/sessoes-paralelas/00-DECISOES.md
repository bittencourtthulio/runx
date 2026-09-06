---
expx_schema: 1
expx_tool: sprintx
kind: decisoes
trabalho_id: sessoes-paralelas
atualizado_em: 2026-09-06
decisoes:
  - id: D-01
    decisao: Regra inviolavel 16 - uma ocorrencia aberta por arvore de trabalho; com git, a ocorrencia nasce em worktree proprio no E1
    alternativa_descartada: Manter 15 regras e tratar o worktree como procedimento opcional do E1
    motivo: Hook precisa de regra para apontar; e mudanca de metodo, nao de custo, ao contrario do plano anterior
    status: fechada
    bloqueante: false
  - id: D-02
    decisao: Worktree em diretorio irmao ../<repo>--<OC-ID>-<slug>, na branch com nome e base calculados pela regra da mergex
    alternativa_descartada: Worktree aninhado em .claude/worktrees/ com branch runx/<OC-ID>
    motivo: Aninhado duplica cada teste e cada arquivo para runners e grep (harnesses.md s5); nome da mergex faz o E0 dela retomar em vez de criar
    status: fechada
    bloqueante: false
  - id: D-03
    decisao: O caminho do worktree e gravado na chave worktree do kind ocorrencia e na prosa do ORQUESTRADOR (secao 4, linha Area de trabalho)
    alternativa_descartada: Campo novo no YAML do orquestrador, ou em .expx/estado.json
    motivo: orquestrador e kind compartilhado com a sprintx; estado.json e somente exibicao; ocorrencia e exclusivo da runx
    status: fechada
    bloqueante: false
  - id: D-04
    decisao: O worktree herda o local do checkout principal - se .expx/ existe la, o E1 cria .expx/ no worktree copiando hooks.json e gravando estado.json do objeto padrao; copia tambem .claude/settings.local.json e os .env* da raiz
    alternativa_descartada: Nao criar .expx/ (leitura literal do 06-estado.md)
    motivo: A regra nao crie existe para nao inventar instalacao onde o CLI nao instalou; aqui o CLI instalou no principal. Sem .env a suite falha por configuracao; a skill copia sem ler nem imprimir
    status: fechada
    bloqueante: false
  - id: D-05
    decisao: Apos criar o worktree, o E1 instala dependencias pelo comando do CONVENCOES.md da stackx ou, sem ele, pelo lockfile detectado numa tabela fechada; sem lockfile conhecido registra lacuna e segue
    alternativa_descartada: Deixar a instalacao para a pessoa
    motivo: O E1 precisa rodar teste para provar a causa (evidencia teste_falho); worktree nasce sem node_modules (git-worktree-e-mergex.md s2)
    status: fechada
    bloqueante: false
  - id: D-06
    decisao: raiz_repo reconhece .git como arquivo (worktree) alem de diretorio
    alternativa_descartada: Chamar git rev-parse --show-toplevel em cada hook
    motivo: Um processo a mais por hook estoura o orcamento de 200 ms que motivou o despachante; ler um arquivo custa nada
    status: fechada
    bloqueante: false
  - id: D-07
    decisao: A pessoa pode pedir sem worktree na abertura (worktree null, comportamento atual); o E5 registra a area de trabalho no relatorio tecnico e nunca remove worktree nem branch
    alternativa_descartada: Remover o worktree no E5
    motivo: Regra 12 (nunca apaga); a mergex pode estar com PR aberto naquela branch; remocao e da pessoa
    status: fechada
    bloqueante: false
  - id: D-08
    decisao: Reivindicacao de task pelo rastro - o E3 emite task_iniciada ao abrir e task_concluida ou task_bloqueada ao fechar; o hook task-reivindicada avisa ao gravar em_andamento numa task cujo ultimo task_iniciada e de outra sessao sem fechamento posterior
    alternativa_descartada: Campo executor na task, ou arquivo de lock em .expx/
    motivo: tasks e kind compartilhado; lock envelhece e trava. O rastro ja e por raiz e por trabalho; o hook so avisa, entao evento perdido nunca bloqueia
    status: fechada
    bloqueante: false
  - id: D-09
    decisao: sessao = <harness>@<id>, descoberta nesta ordem - EXPX_SESSAO, session_id do payload, CLAUDE_CODE_SESSION_ID, ancestral de processo (<executavel>@<pid>); harness por EXPX_HARNESS, CLAUDECODE ou nome do ancestral
    alternativa_descartada: Exigir --sessao explicito em toda chamada
    motivo: Funciona nos tres harnesses sem cooperacao (deteccao-e-raiz.md s6); a ponte injeta EXPX_* via shell.env onde existe, e ai fica exato
    status: fechada
    bloqueante: false
  - id: D-10
    decisao: grava() acrescenta sessao e harness depois das doze chaves do contrato; rastro.py ganha --sessao opcional
    alternativa_descartada: Espremer a identidade dentro de detalhe
    motivo: O parser do expxdev e passthrough e o proprio comentario dele diz que espremer em detalhe perde o dado (hooks-e-rastro.md s6). Aviso do doctor ate declarar no contrato canonico (L-01)
    status: fechada
    bloqueante: false
  - id: D-11
    decisao: Hook novo arvore-limpa-antes-da-suite em PreToolUse Bash, mesmo regex SUITE - avisa se ha arquivo sujo fora de autorizados, LIVRE e TESTE, ou task em_andamento reivindicada por outra sessao
    alternativa_descartada: So instrucao no 04-qa.md
    motivo: Texto o modelo esquece; hook roda sempre. Cria o grupo PreToolUse Bash que hoje nao existe
    status: fechada
    bloqueante: false
  - id: D-12
    decisao: E4 com arvore contaminada nao roda a suite, nao grava QA.md e nao emite veredito - anuncia arquivos e sessao dona e encerra para ser reexecutado
    alternativa_descartada: REPROVADO com achado ALTA de escopo
    motivo: REPROVADO devolve ao E3 e polui a contagem de voltas, que o metodo usa como medida de qualidade do plano (suite-e-qa.md s3)
    status: fechada
    bloqueante: false
  - id: D-13
    decisao: rastro-suite grava em detalhe o HEAD curto e a contagem de sujos fora do escopo
    alternativa_descartada: Mais duas chaves extras no evento
    motivo: detalhe ja e a linha humana; duas extras (D-10) bastam para manter o aviso do doctor minimo
    status: fechada
    bloqueante: false
  - id: D-14
    decisao: Uma ponte unica runx-ponte.js serve OpenCode e MimoCode - le hooks.json ao lado do despachante, traduz tool.execute.before e after para o payload do Claude Code, bloqueia com cancel mais throw, entrega avisos do before no after por callID, e exporta EXPX_SESSAO e EXPX_HARNESS via shell.env
    alternativa_descartada: Reescrever os hooks em JS para cada harness
    motivo: Um motor, tres harnesses, um contrato testado uma vez (harnesses.md s2 - mesma assinatura e mesmos nomes nos dois)
    status: fechada
    bloqueante: false
  - id: D-15
    decisao: install.sh ganha --mimocode; sem flag instala nos tres; a ponte vai para .opencode/plugins/ e .mimocode/hooks/ (global - ~/.config/opencode/plugins/ e ~/.config/mimocode/hooks/); MimoCode nao recebe copia de skill, comandos nem agentes
    alternativa_descartada: Espelhar .claude/ inteiro em .mimocode/
    motivo: MimoCode le .claude/skills, .claude/commands e .claude/agents nativamente (harnesses.md s1)
    status: fechada
    bloqueante: false
  - id: D-16
    decisao: Hook novo uma-ocorrencia-por-arvore em PreToolUse sobre 00-OCORRENCIA.md - avisa quando outra ocorrencia aberta com id diferente existe na mesma raiz
    alternativa_descartada: Confiar so na regra 16 no texto
    motivo: E o unico ponto em que a regra 16 pode ser violada por escrita; nasce em aviso como todo hook de metodo
    status: fechada
    bloqueante: false
  - id: D-17
    decisao: Toda mudanca e espelhada em .opencode/ e conferida por testar-espelho.sh; DRs registradas; a sprintx nao e alterada
    alternativa_descartada: Aplicar so em .claude/
    motivo: DR-44 e DR-72; escopo declarado e a runx
    status: fechada
    bloqueante: false
---

# Decisões — sessoes-paralelas

Decisões que fecham o desenho. O pedido veio em uma linha ("monta o plano para fazer o melhor
em todos os 3 harness") e o usuário não estava disponível para blocos de entrevista; por isso
cada decisão traz a alternativa descartada e o arquivo da base que a sustenta, e **três delas
são escolhas que o usuário pode reverter em uma linha antes da execução**: D-01 (regra 16),
D-02 (diretório irmão) e D-04 (copiar `.env*` para o worktree).

## Decisões fechadas

```
D-01 | Regra 16: uma ocorrência aberta por árvore; com git, nasce em worktree próprio no E1 | Manter 15 regras | Hook precisa de regra para apontar; é mudança de método
D-02 | Worktree irmão ../<repo>--<OC-ID>-<slug>, branch e base pela regra da mergex | .claude/worktrees/ aninhado | Aninhado duplica testes para runners (harnesses.md §5); nome da mergex → E0 retoma
D-03 | Caminho do worktree em `ocorrencia.worktree` e na prosa do ORQUESTRADOR §4 | YAML do orquestrador; estado.json | orquestrador é compartilhado; estado.json é só exibição
D-04 | Worktree herda .expx/ (hooks.json + estado padrão), settings.local.json e .env* | Não criar .expx/ | O CLI instalou no principal; sem .env a suíte falha por configuração
D-05 | E1 instala dependências por CONVENCOES.md ou lockfile (tabela fechada) | Deixar para a pessoa | E1 precisa rodar teste para provar a causa
D-06 | raiz_repo reconhece .git arquivo | git rev-parse por hook | Orçamento de 200 ms (deteccao-e-raiz.md §3)
D-07 | "sem worktree" na abertura → worktree: null; E5 registra e nunca remove | Remover no E5 | Regra 12; PR da mergex pode estar aberto
D-08 | Reivindicação pelo rastro: task_iniciada/concluida/bloqueada + hook task-reivindicada | Campo executor; lock em .expx/ | tasks é compartilhado; lock envelhece; hook só avisa
D-09 | sessao = <harness>@<id>: EXPX_SESSAO → payload → CLAUDE_CODE_SESSION_ID → ancestral | --sessao obrigatório | Funciona nos três sem cooperação (deteccao-e-raiz.md §6)
D-10 | sessao e harness como extras depois das doze chaves | Dentro de detalhe | Parser passthrough; "espremer em detalhe perde o dado" (hooks-e-rastro.md §6)
D-11 | Hook arvore-limpa-antes-da-suite, PreToolUse Bash | Só texto no 04-qa | Texto esquece; cria o grupo PreToolUse/Bash
D-12 | E4 contaminado: não roda, não grava QA.md, não emite veredito | REPROVADO | REPROVADO polui a contagem de voltas (suite-e-qa.md §3)
D-13 | rastro-suite grava HEAD e sujos fora do escopo em detalhe | Mais extras | detalhe é a linha humana; aviso do doctor mínimo
D-14 | Ponte única runx-ponte.js para OpenCode e MimoCode, lendo hooks.json | Reescrever hooks em JS | Um motor, três harnesses (harnesses.md §2)
D-15 | install.sh --mimocode; ponte em .opencode/plugins e .mimocode/hooks; sem cópia de skill | Espelhar .mimocode/ | MimoCode lê .claude/* (harnesses.md §1)
D-16 | Hook uma-ocorrencia-por-arvore sobre 00-OCORRENCIA.md | Só a regra 16 no texto | Único ponto de violação por escrita
D-17 | Espelhar em .opencode/, DRs, sprintx intocada | Só .claude/ | DR-44, DR-72
```

## Contradição apontada e resolvida

D-04 contradiz a leitura literal do `06-estado.md`: "`.expx/` ausente significa que o CLI não
instalou o ecossistema neste projeto. Não crie". No worktree, `.expx/` está ausente porque é
**ignorado pelo git**, não porque o CLI não instalou — o checkout principal tem o diretório.

**Resolvida sem voltar ao usuário:** o E1 só cria `.expx/` no worktree **se ele existir no
checkout principal**, copiando o `hooks.json` de lá. A regra "não crie" continua valendo no
seu sentido original (não inventar instalação); a ausência genuína continua sendo respeitada.
O `06-estado.md` ganha uma frase dizendo exatamente isso (T-02.02).

## O que fica fora

- Declarar `sessao` e `harness` no contrato canônico `expx-eventos` — repositório do expxdev (L-01).
- Ensinar o painel/`watch` a enxergar worktrees — CLI (L-02).
- Retomada de branch pela mergex com só `docs/` não rastreado — mergex (L-04).
- Tradução do campo de restrição de ferramentas dos agentes para `permission`/`tool_allowlist` — os agentes não mudam nesta feature.
- A skill `sprintx`.

## Pendências

Nenhuma. Nenhum PENDENTE bloqueante — a F3 está liberada.

## Cobertura dos sete eixos

| Eixo | Onde foi coberto |
|---|---|
| 1. Escopo de negócio | D-01, D-07, D-15, D-17 — o que entra (runx, três harnesses), opt-out, o que fica fora |
| 2. Arquitetura | D-02, D-06, D-14 — worktree irmão, raiz por `.git` arquivo, uma ponte lendo o `hooks.json` |
| 3. Contrato de dados | D-03, D-10, D-13 — `worktree` em kind exclusivo; extras no rastro; `detalhe` do `suite_executada` |
| 4. Estado e observabilidade | D-08, D-09, D-13 — reivindicação visível no rastro; quem fez o quê; suíte auditável por `HEAD` |
| 5. Resiliência e política de erro | D-08, D-11, D-12, D-16 — todo hook novo nasce em aviso e falha aberto; E4 contaminado não gera volta falsa |
| 6. Ambiente e segredos | D-04, D-05 — o que o worktree herda (lista fechada), `.env*` copiado sem ser lido; `segredo-no-commit` continua vigiando |
| 7. Definição de pronto | seis suítes em 0 falhas (`testar`, `falsos-positivos`, `conteudo`, `espelho`, `ponte`, `instalador`), 16 regras, verificação manual de carga da ponte nos dois harnesses (L-06) |
