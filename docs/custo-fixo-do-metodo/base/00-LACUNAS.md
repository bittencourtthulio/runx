# Lacunas

Tudo que foi procurado e não encontrado, com onde se procurou e o impacto sobre o plano.

| # | Lacuna | Onde procurei | Impacto sobre o plano | Bloqueante |
|---|---|---|---|---|
| L-01 | Não existe suíte de testes para o conteúdo markdown das skills (SKILL.md, references, assets) | `.claude/hooks/testes/`, `.github/`, raiz do repo | O TDD das tasks que alteram markdown precisa ser feito por teste executável escrito nesta feature (verificador de conteúdo), senão não há como satisfazer a regra 3 do sprintx | **Não** — resolvido criando o verificador como parte da entrega |
| L-02 | Não há CI configurado: `.github/` não contém `workflows/` | `.github/`, `ls .github/workflows/` | Os testes rodam à mão. Não impede o plano; impede garantia contínua | Não |
| L-03 | Não há verificação automática do espelhamento `.claude/` ↔ `.opencode/` | `install.sh`, `.claude/hooks/testes/` | O espelhamento fica por conta da disciplina humana; risco de esquecer | **Não** — resolvido criando o teste de espelhamento como parte da entrega |
| L-04 | O `rastro.py` não é executável pelo caminho que os references documentam (`.claude/runx-hooks/`) dentro deste repositório | `install.sh` linha 96, `.claude/hooks/` | Nenhum: é correto por desenho (o caminho existe no destino instalado). Registrado para não virar "correção" indevida | Não |
| L-05 | Não há medição de tokens por estágio; a evidência do custo é bytes de artefato do projeto leadiq | `docs/eventos/*.jsonl` do leadiq (só 2 de 17 ocorrências têm `estagio_iniciado`/`estagio_concluido` pareados) | Os números do plano são de bytes, não de tokens. Nenhuma task pode afirmar economia de tokens medida | Não |

Nenhuma lacuna bloqueante.
