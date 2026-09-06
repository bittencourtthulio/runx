---
expx_schema: 1
expx_tool: sprintx
kind: orquestrador
trabalho_id: sessoes-paralelas
titulo: runx em sessoes paralelas com Claude Code, OpenCode e MimoCode
tipo_trabalho: feature
tipo_ocorrencia: null
estagio: f6
status: concluido
criado_em: 2026-09-06
atualizado_em: 2026-09-06
concluido_em: 2026-09-06
sprints: [sprint-01, sprint-02, sprint-03]
caminho_critico: [T-01.01, T-02.07, T-02.08, T-02.09, T-02.10, T-02.11, T-03.01, T-03.02, T-03.04, T-03.05]
---

# ORQUESTRADOR — sessoes-paralelas

## 1. Objetivo

Fazer o runx funcionar quando várias sessões, de harnesses diferentes (Claude Code, OpenCode,
MimoCode), trabalham ao mesmo tempo no mesmo projeto. Cada ocorrência nasce em worktree
próprio (regra 16); task se reivindica pelo rastro, que passa a dizer qual sessão fez o quê;
a suíte inteira só roda em árvore limpa, e árvore contaminada não gera REPROVADO falso. Os
hooks Python continuam sendo o único motor: no Claude Code direto, nos outros dois por uma
ponte JS que traduz os eventos.

## 2. Mapa e ordem de leitura

1. `ORQUESTRADOR.md` — este arquivo
2. `00-DECISOES.md` — as 17 decisões, a contradição resolvida e o que fica fora
3. `base/00-INDICE.md` — e os 6 arquivos de área que ele lista
4. `base/00-LACUNAS.md` — 8 lacunas, nenhuma bloqueante
5. `sprint-01/sprint.md` → `fases.md` → `tasks.md`
6. `sprint-02/sprint.md` → `fases.md` → `tasks.md`
7. `sprint-03/sprint.md` → `fases.md` → `tasks.md`
8. `00-BLOQUEIOS.md` — vazio no início

## 3. Rota de execução

```
sprint-01  capacidade de testar (tudo vermelho por construção)
  F-01.1   T-01.01 ∥ T-01.02 ∥ T-01.03 ∥ T-01.04     (arquivos disjuntos)

  ── portão real: sem os verificadores não há teste que falhe antes ──

sprint-02  método e motor
  F-02.1 ∥ F-02.2
    F-02.1  T-02.01 ∥ T-02.02 ∥ T-02.03 ∥ T-02.04 ∥ T-02.05 ∥ T-02.06   (só .claude/skills/runx/)
    F-02.2  T-02.07 → T-02.08 → T-02.09 → T-02.10 → T-02.11              (só .claude/hooks/; cadeia sobre testar.sh)

  ── portão real: a ponte lê o hooks.json, que só fecha em T-02.11 ──

sprint-03  pontes, instalador, fechamento
  F-03.1 ∥ F-03.2
    F-03.1  T-03.01
    F-03.2  T-03.03            (README, independente)
            T-03.01 → T-03.02  (instalador precisa da ponte)
  F-03.3   T-03.04 → T-03.05   (depende de tudo)
```

**Caminho crítico:** `T-01.01 → T-02.07 → T-02.08 → T-02.09 → T-02.10 → T-02.11 → T-03.01 → T-03.02 → T-03.04 → T-03.05`

**Atenção ao paralelismo declarado:** as seis tasks da F-02.1 são paralelas entre si **e**
com a F-02.2 inteira. A F-02.2 é uma cadeia estrita: quatro delas editam `testar.sh` e três
usam `sessao()` de T-02.07. Nunca abra duas tasks da F-02.2 ao mesmo tempo.

## 4. Ferramentas

| Ferramenta | Comando |
|---|---|
| Hooks (existente) | `bash .claude/hooks/testes/testar.sh` — linha de base 59 ok |
| Falsos positivos (existente) | `bash .claude/hooks/testes/testar-falsos-positivos.sh` — 38 ok |
| Conteúdo (existente) | `bash .claude/hooks/testes/testar-conteudo.sh` — 20 ok |
| Espelhamento (existente) | `bash .claude/hooks/testes/testar-espelho.sh` — 2 ok |
| Ponte (criado em T-01.03) | `bash .claude/hooks/testes/testar-ponte.sh` — exige `node` |
| Instalador (criado em T-01.04) | `bash .claude/hooks/testes/testar-instalador.sh` |
| Diagnóstico dos hooks | `python3 .claude/hooks/comum/doctor.py` |
| Sintaxe da ponte | `node --check .claude/hooks/ponte/runx-ponte.js` |
| Lint / Typecheck | NÃO EXISTE NO PROJETO |

**Segredos:** nenhum. A feature altera markdown, Python, um JS sem dependências e um script
shell. Nenhuma variável de ambiente nova além de `EXPX_SESSAO`/`EXPX_HARNESS` (identidade,
não segredo) e `RUNX_PONTE_DESPACHANTE` (só em teste).

**Área de trabalho:** checkout principal — este repositório é a própria skill; a regra 16 vale
para projetos que a usam, e a feature ainda não existe aqui.

**Nota de caminho:** os references documentam `.claude/runx-hooks/`, o caminho no ambiente
instalado; neste repositório os scripts vivem em `.claude/hooks/`. Correto por desenho (L-04
do plano anterior). A ponte procura os dois (T-03.01).

## 5. Agentes

Três papéis, assumidos em sequência pelo mesmo agente quando não houver outros:

- **Implementador** — escreve (ou destrava) a asserção da task, vê o vermelho, e só então o conteúdo.
- **Revisor de testes** — responde: essa asserção passaria com o conteúdo errado? `grep` de
  palavra solta não discrimina; a asserção casa estrutura (contagem, chave, comando literal,
  ordem de chaves no JSON).
- **Auditor de aceite** — roda o comando do `criterio_aceite` e confere a contagem exata
  antes de marcar `concluida`.

## 6. Regras de autonomia

1. Não perguntar nada durante a execução; não pedir autorização.
2. Teste antes do conteúdo. Na sprint-01 o vermelho **é** o critério de aceite; nas outras, a
   asserção ou o caso correspondente precisa estar vermelho antes da edição.
3. Dúvida nova → `00-BLOQUEIOS.md`, pular a task, seguir para a próxima cujas dependências
   estão satisfeitas. Nunca parar para esperar.
4. Critério de aceite não atendido = task não avança. Não existe "concluído com ressalva".
5. Escopo travado: não tocar arquivo fora do `arquivos` das tasks. Em particular: **não
   tocar `.claude/agents/`, `install.sh` antes de T-03.02, nem `.opencode/` antes de T-03.05**.
6. Contagem de casos nunca cai: toda task que edita `testar.sh` ou `testar-conteudo.sh`
   registra a contagem antes e depois na linha de conclusão.
7. Atualizar `status` em `tasks.md` — frontmatter **e** prosa — a cada transição.
8. Espelhar em `.opencode/` é a T-03.05, não um passo avulso no meio.
9. Nenhum caminho absoluto em nenhum artefato; nenhum segredo lido ou impresso (a cópia de
   `.env*` do E1 é `cp`, nunca `cat`).

## 7. Definição de pronto global

- [ ] `bash .claude/hooks/testes/testar.sh` sai com **0 falhas** e pelo menos 79 casos.
- [ ] `bash .claude/hooks/testes/testar-falsos-positivos.sh` sai 0 falhas, pelo menos 45 casos.
- [ ] `bash .claude/hooks/testes/testar-conteudo.sh` sai **0 falhas**, 34 asserções.
- [ ] `bash .claude/hooks/testes/testar-espelho.sh` sai 0.
- [ ] `bash .claude/hooks/testes/testar-ponte.sh` sai 0 falhas.
- [ ] `bash .claude/hooks/testes/testar-instalador.sh` sai 0 falhas.
- [ ] `diff -rq .claude/skills/runx .opencode/skills/runx` sem saída.
- [ ] O `SKILL.md` tem 16 regras invioláveis; a 16ª cita worktree (D-01).
- [ ] `python3 .claude/hooks/comum/doctor.py` lista nove hooks.
- [ ] Nenhum `{{marcador}}` vazado em arquivo de instrução.
- [ ] `DECISOES-DA-SKILL.md` com pelo menos 8 DRs novas citando as D-NN desta feature.
- [ ] **Verificação manual (L-06), registrada em `00-BLOQUEIOS.md` como observação, não como
      bloqueio:** num projeto de teste instalado com `./install.sh`, abrir OpenCode e MimoCode e
      provocar uma escrita fora do escopo de uma ocorrência aberta; o aviso do
      `escopo-da-ocorrencia` precisa aparecer na resposta da ferramenta nos dois.
- [ ] Commit e push no `main`.

## 8. Como retomar uma sessão interrompida

1. Leia este arquivo inteiro.
2. Leia o `status` de cada task em `sprint-01/tasks.md`, `sprint-02/tasks.md` e `sprint-03/tasks.md`.
3. Leia `00-BLOQUEIOS.md`.
4. Continue da primeira task `pendente` ou `em_andamento` cujas dependências estão todas
   `concluida`, seguindo a rota da seção 3. Na F-02.2, confira antes que nenhuma outra task da
   cadeia está `em_andamento`.
