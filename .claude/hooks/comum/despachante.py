#!/usr/bin/env python3
"""Executa hooks em um processo; adapta apply_patch antes de inspecionar arquivos.

Scanner de seguranca falha fechado inclusive em import/main/payload.
Hooks exclusivamente de metodo preservam falha aberta.
"""

import json
import io
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def roda(nome, evento_bruto):
    """Roda um hook. Devolve (codigo, stderr). Nunca levanta excecao."""
    import contextlib
    import importlib.util

    caminho = os.path.join(RAIZ, nome + ".py")
    security = nome == "comum/segredo-no-commit"
    failure = (2, "[expx] Scanner de seguranca indisponivel ou com erro. Escrita bloqueada.\n")
    if not os.path.isfile(caminho):
        return failure if security else (0, "")

    erro = io.StringIO()
    codigo = 0
    try:
        spec = importlib.util.spec_from_file_location(
            "runx_hook_" + nome.replace("/", "_").replace("-", "_"), caminho
        )
        modulo = importlib.util.module_from_spec(spec)
        # Cada hook le o proprio stdin; entregamos o mesmo texto a todos.
        with contextlib.redirect_stderr(erro):
            sys.stdin = io.StringIO(evento_bruto)
            try:
                # Importado como modulo, o `if __name__ == "__main__"` do hook
                # nao dispara: chamamos `main()` na mao. `SystemExit` e o jeito
                # normal de o hook responder, e precisa ser tratado AQUI, dentro
                # do redirect, senao o codigo se perde.
                spec.loader.exec_module(modulo)
                if not callable(getattr(modulo, "main", None)):
                    raise ValueError("hook sem main")
                modulo.main()
            except SystemExit as saida:
                codigo = saida.code if isinstance(saida.code, int) else (2 if security else 0)
                if security and codigo not in (0, 2):
                    return failure
            except Exception:
                # Hook de metodo falha ABERTA. O de seguranca tem o proprio
                # tratamento fail-closed dentro do `main()` dele.
                if security:
                    return failure
                codigo = 0
    except Exception:
        return failure if security else (0, "")
    return codigo, erro.getvalue()


def main():
    alvos = sys.argv[1:]
    if not alvos:
        return 0

    try:
        bruto = sys.stdin.read()
    except OSError:
        return 0

    real = sys.stdin
    try:
        try:
            from eventos import events
            adapted = events(bruto)
        except Exception:
            if "comum/segredo-no-commit" in alvos:
                sys.stderr.write("[expx] Payload ou patch invalido; escrita bloqueada.\n")
                return 2
            return 0
        # Todos os arquivos passam pelo scanner antes dos hooks de metodo/rastro.
        ordered = sorted(alvos, key=lambda name: name != "comum/segredo-no-commit")
        for nome in ordered:
            for event in adapted:
                codigo, texto = roda(nome, json.dumps(event))
                if texto.strip():
                    sys.stderr.write(texto)
                if codigo == 2:
                    return 2
    finally:
        sys.stdin = real
    return 0


if __name__ == "__main__":
    try:
        _codigo = main()
    except SystemExit as _saida:  # um hook que escapou do `roda`
        _codigo = _saida.code if isinstance(_saida.code, int) else 0
    except Exception:
        _codigo = 2 if "comum/segredo-no-commit" in sys.argv else 0
        sys.stderr.write("[expx] Erro interno do despachante.\n")
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(_codigo if isinstance(_codigo, int) else 0)
