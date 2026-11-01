# Hooks portateis

O manifesto invoca `node comum/launcher.cjs`. O launcher verifica Python 3, nesta ordem: `python3`, `py -3`, `python`; preserva stdin, stdout, stderr e codigo de saida, com timeout. Sem Python, a escrita protegida pelo scanner e bloqueada com diagnostico; hooks exclusivamente de metodo avisam e seguem.

O despachante converte `apply_patch` do Codex em eventos por arquivo e roda o scanner em todos antes de metodo/rastro. Patch ambiguo e erro de importacao ou execucao do scanner bloqueiam a operacao inteira. O payload real Codex e aceito em `tool_input.command` (tambem patch/input e string). Add fornece conteudo completo; update e move reconstroem o arquivo proposto a partir da origem e de hunks com correspondencia unica, preservando frontmatter para as regras de metodo. Move inspeciona origem e destino, inclusive conteudo preservado vindo de .env. Caminhos equivalentes ou hunks sem cobertura confiavel bloqueiam o patch. Delete emite evento de remocao com conteudo vazio; nao introduz conteudo.

Claude conserva a semantica de PostToolUse. Codex exige `tool_response.success: true` e a ponte OpenCode exige `metadata.success: true` para registrar arquivo alterado; resposta desconhecida nao prova sucesso. O rastro de suites continua distinguindo exit code zero, falha e resultado desconhecido.

A ponte descobre o manifesto e o launcher no caminho instalado ou local; nao precisa de `RUNX_PONTE_DESPACHANTE`. O override antigo permanece apenas para compatibilidade de fixtures.

Validacao portatil: `node --test .claude/hooks/testes/portabilidade.test.cjs`.

## Suite historica no Windows

`bash .claude/hooks/testes/testar.sh` tambem usa a selecao validada do launcher. No Git Bash, converte os caminhos das fixtures para C:/... antes de inclui-los em JSON e codigo Python; em Linux mantem os caminhos originais. Subprocessos Python usam `sys.executable`, e apenas CRLF da saida e normalizado para as comparacoes shell. Nao modifica o PATH global nem ignora asserts.
