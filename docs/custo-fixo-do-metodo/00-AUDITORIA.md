# Auditoria — custo-fixo-do-metodo

**Data:** 2026-09-02

Auditoria do plano em `sprint-01/` e `sprint-02/` contra os 9 itens do Passo 2 da F5.
Verificação automática de campos, dependências, ciclos e colisões executada sobre o
frontmatter das duas `tasks.md`; verificação de julgamento feita por leitura.

## Achados

| severidade | arquivo | problema | correção sugerida |
|---|---|---|---|
| MÉDIA | sprint-02/tasks.md | T-02.06 altera `.claude/hooks/testes/testar.sh`, que é o mesmo arquivo que a suíte usa para se auto-verificar. Se a edição quebrar o script, a própria medição de "0 falhas" fica comprometida e o erro pode passar despercebido. | Ao editar `testar.sh`, rodar o script ANTES e DEPOIS e comparar a contagem de casos — o número de casos precisa aumentar, nunca diminuir. Registrar as duas contagens na conclusão da task. |
| MÉDIA | sprint-02/tasks.md | T-02.08 (espelhamento) depende de 4 tasks e é `paralelizavel: false`, concentrando todo o risco de esquecimento no fim da execução. Se ela for pulada por bloqueio, a entrega fica com as árvores divergentes e o `install.sh` distribui versão incompleta. | Nenhuma mudança de plano necessária: a definição de pronto global do ORQUESTRADOR já exige `testar-espelho.sh` em 0, o que trava a entrega se T-02.08 não rodar. Registrado como risco consciente. |
| BAIXA | sprint-01/tasks.md | T-01.01 cria um verificador cujas asserções cobrem conteúdo que ainda não existe (o formato condensado). A task é, por construção, um teste que falha — correto para TDD, mas exige que o executor não "conserte" o script para ele passar. | O `criterio_aceite` já diz explicitamente "sai com código 1 no estado atual", o que torna o vermelho o resultado esperado. Sem ação. |
| BAIXA | sprint-02/fases.md | As fases F-02.1, F-02.2 e F-02.3 são declaradas paralelas, mas 6 das 7 tasks dentro delas são `paralelizavel: false` por colisão de arquivo. O paralelismo real é menor do que a leitura das fases sugere. | Já documentado na nota do topo de `sprint-02/tasks.md` e na seção 3 do ORQUESTRADOR. Sem ação. |

## Verificações que passaram

1. **Task sem teste** — todas as 11 tasks têm `teste_integracao` e `teste_funcional` não vazios, com mais de 25 caracteres cada.
2. **Teste que passaria com implementação errada** — cada asserção do verificador é nomeada e casa estrutura específica (kind declarado, enum com 4 valores, caminho `sprint-NN/tasks.md`), não presença de palavra solta. T-01.02 exige que o script detecte divergência **introduzida**, não só ausência dela.
3. **Critério de aceite subjetivo** — nenhum adjetivo de juízo. Todos os 11 critérios citam código de saída, contagem ou presença estrutural verificável. (O único hit da varredura automática, em T-02.01, foi "também" casando com o padrão "bem" — falso positivo.)
4. **Dependência circular** — nenhuma. Verificado por travessia com detecção de ciclo sobre as 11 tasks.
5. **Paralelismo falso** — as 3 tasks `paralelizavel: true` (T-01.01, T-01.02, T-02.07) não compartilham nenhum arquivo entre si e nenhuma delas tem `depende_de` preenchido. Verificado por interseção de conjuntos.
6. **Sequencialidade desnecessária no caminho crítico** — a cadeia `T-02.01 → T-02.02 → T-02.03` é real: o template (T-02.02) precisa do kind declarado (T-02.01), e o E2 (T-02.03) precisa do template para apontar para ele.
7. **Task que exigiria decisão humana** — nenhuma ocorrência de "confirmar com", "a definir", "decidir depois" nos campos das tasks.
8. **Pré-requisito externo não declarado** — nenhum. A feature não usa segredo, conta, serviço externo nem dado de produção; o ORQUESTRADOR declara isso na seção 4.
9. **Base ignorada** — os três riscos ALTOS de `base/acoplamento-hooks.md` §9 estão endereçados: o caminho `sprint-NN/tasks.md` é preservado (D-02, refletido em T-02.03), o bloco YAML é único (D-04, verificado por T-02.02), e o hook aceita `parcial` (D-08, implementado por T-02.06). O risco ALTO de `base/arvores-espelhadas.md` §9 é endereçado por T-02.08 e T-01.02.

VEREDITO: SIM — o plano está pronto para execução autônoma.
