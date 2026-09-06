# Lacunas

Tudo que foi procurado e não encontrado, com onde se procurou e o impacto sobre o plano.

| # | Lacuna | Onde procurei | Impacto sobre o plano | Bloqueante |
|---|---|---|---|---|
| L-01 | O contrato canônico `expx-eventos` (repositório do expxdev) não declara as extras `sessao` e `harness`; o `doctor` do expxdev as reporta como aviso | `expxdev/dist/parser/esquema/evento.js` (`EXTRAS_EVENTO = ["hook","faixa"]`) | Nenhum sobre o funcionamento: o parser é `passthrough`. Declarar as duas chaves é mudança no repositório do expxdev, fora deste escopo | Não |
| L-02 | O painel/`watch` do expxdev lê `.expx/estado.json` e `docs/eventos/` "a partir da raiz do projeto" onde foi aberto; não sabe que existem worktrees | `expxdev/dist/watch/fontes/estado.js`, `observar.js` | O painel aberto no checkout principal não vê a ocorrência que vive num worktree. Aberto dentro do worktree, vê. Documentar; resolver é do CLI | Não |
| L-03 | Não verificado que `tool.execute.after` do OpenCode/MimoCode entrega o código de saída do `bash` em `output.metadata` | docs de plugins do OpenCode; `packages/plugin/src/index.ts` | `rastro-suite` já grava `nao_determinado` sem código. A ponte passa `metadata.exit` se for número; a verificação real fica para a instalação (L-06) | Não |
| L-04 | O E0 da mergex exige `git status --porcelain` vazio, contando `??`; os artefatos de `docs/manutencao/<OC>/` do E1/E2 são não rastreados nesse momento | `mergex/references/00-abertura.md` Passo 2 | Pré-existente: hoje já é assim no checkout único. O worktree não altera. Registrado para a mergex considerar retomar branch com só `docs/` não rastreado | Não |
| L-05 | Não há CI; as suítes rodam à mão | `.github/` | Igual ao plano anterior. Nenhuma task depende de CI | Não |
| L-06 | Não há como testar automaticamente que OpenCode e MimoCode **carregam** a ponte (exigiria subir os harnesses) | `.claude/hooks/testes/` | A ponte é testada com eventos falsos em `node`. A carga real é verificada à mão ao instalar: abrir cada harness num projeto instalado e provocar um aviso. Registrado como passo de verificação manual no ORQUESTRADOR §7 | Não |
| L-07 | No MimoCode, `output.cancel = true` está documentado e `throw` funciona por herança do OpenCode; não foi verificado ao vivo qual dos dois o núcleo honra primeiro | `MiMo-Code/packages/plugin/src/index.ts`, `hook-api.md` | A ponte faz os dois: seta `cancel` e lança. Sem efeito colateral no OpenCode (propriedade extra ignorada) | Não |
| L-08 | Não há medição de quantas vezes a suíte do E4 reprovou por contaminação de outra sessão; o relato é qualitativo | `docs/eventos/` de projetos reais (o rastro não registra `HEAD` nem arquivos sujos) | Nenhuma task pode afirmar redução medida. D-13 cria o dado para medir a partir de agora | Não |

Nenhuma lacuna bloqueante.
