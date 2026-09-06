---
expx_schema: 1
expx_tool: sprintx
kind: bloqueios
trabalho_id: sessoes-paralelas
atualizado_em: 2026-09-06
bloqueios: []
---

# Bloqueios

Nenhum bloqueio de execução. Uma observação registrada, prevista desde o plano (ORQUESTRADOR §7, L-06 da base):

**Verificação manual pendente, fora do escopo automatizável:** a ponte (`runx-ponte.js`) foi validada com um harness em `node` que reproduz fielmente o contrato de `tool.execute.before`/`after`/`shell.env` (10 casos verdes, `testar-ponte.sh`). O que essa suíte não prova — porque exigiria subir os harnesses de verdade — é que o OpenCode e o MimoCode efetivamente **carregam** o arquivo da pasta onde o instalador o colocou (`.opencode/plugins/runx-ponte.js` e `.mimocode/hooks/runx-ponte.js`). Isso pede abrir cada harness num projeto instalado e provocar um aviso de verdade (ex.: escrever fora do escopo de uma ocorrência aberta) e confirmar que ele aparece na resposta da ferramenta. Não bloqueia a entrega; fica como verificação de quem for usar em cada harness pela primeira vez.
