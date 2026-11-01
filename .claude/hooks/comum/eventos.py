"""Adaptacao estrita do apply_patch, com conteudo proposto completo."""
import json
import os


def canonical(value, cwd):
    if not isinstance(value, str) or not value.strip() or '\x00' in value:
        raise ValueError('caminho vazio ou invalido')
    return os.path.normcase(os.path.realpath(os.path.join(cwd, value)))


def reconstruct(original, body):
    current = original.splitlines()
    cursor = 0
    output = []
    chunks = []
    for line in body:
        if line.startswith('@@'):
            if line != '@@' and not line.startswith('@@ '):
                raise ValueError('cabecalho de hunk invalido')
            chunks.append([])
        elif line == '*** End of File':
            continue
        elif not chunks:
            raise ValueError('update sem hunk')
        else:
            chunks[-1].append(line)
    if not chunks or any(not chunk for chunk in chunks):
        raise ValueError('hunk vazio')
    for chunk in chunks:
        old = [line[1:] for line in chunk if line.startswith((' ', '-'))]
        new = [line[1:] for line in chunk if line.startswith((' ', '+'))]
        if not old:
            # Insercao sem ancora so e inequivoca num arquivo vazio.
            if current:
                raise ValueError('insercao sem ancora')
            matches = [0]
        else:
            matches = [i for i in range(cursor, len(current)-len(old)+1) if current[i:i+len(old)] == old]
        if len(matches) != 1:
            raise ValueError('hunk nao corresponde unicamente ao arquivo')
        start = matches[0]
        output.extend(current[cursor:start])
        output.extend(new)
        cursor = start + len(old)
    output.extend(current[cursor:])
    return '\n'.join(output) + ('\n' if output else '')


def events(raw):
    event = json.loads(raw)
    if not isinstance(event, dict):
        raise ValueError('evento deve ser objeto')
    name = event.get('tool_name', '')
    if name not in ('apply_patch', 'functions.apply_patch'):
        if not isinstance(event.get('tool_input'), dict):
            raise ValueError('tool_input ausente ou invalido')
        if name in ('Write', 'Edit', 'MultiEdit'):
            data = event['tool_input']
            if not isinstance(data.get('file_path'), str) or not data['file_path']:
                raise ValueError('escrita sem caminho')
            if not any(isinstance(data.get(key), str) for key in ('content', 'new_string')) and not isinstance(data.get('edits'), list):
                raise ValueError('escrita sem conteudo')
        return [event]
    data = event.get('tool_input')
    if not isinstance(data, (str, dict)):
        raise ValueError('entrada de patch invalida')
    patch = data if isinstance(data, str) else data.get('command', data.get('patch', data.get('input')))
    if not isinstance(patch, str):
        raise ValueError('apply_patch sem patch textual')
    lines = patch.splitlines()
    if not lines or lines[0] != '*** Begin Patch' or lines[-1] != '*** End Patch':
        raise ValueError('delimitadores do patch invalidos')
    result, index, paths = [], 1, set()
    cwd = event.get('cwd') or os.getcwd()
    post = event.get('hook_event_name') == 'PostToolUse'
    def claim(value):
        resolved = canonical(value, cwd)
        if resolved in paths:
            raise ValueError('caminho repetido ou equivalente')
        paths.add(resolved)
        return resolved
    while index < len(lines) - 1:
        line = lines[index]
        kind = next((k for k in ('Add', 'Update', 'Delete') if line.startswith('*** ' + k + ' File: ')), None)
        if not kind:
            raise ValueError('operacao de patch ambigua')
        source = target = claim(line.split(': ', 1)[1])
        index += 1
        if index < len(lines) - 1 and lines[index].startswith('*** Move to: '):
            if kind != 'Update':
                raise ValueError('move sem update')
            target = claim(lines[index][13:])
            index += 1
        body = []
        while index < len(lines) - 1 and not lines[index].startswith(('*** Add File:', '*** Update File:', '*** Delete File:')):
            entry = lines[index]
            if kind == 'Delete' or (kind == 'Add' and not entry.startswith('+')):
                raise ValueError('corpo de patch invalido')
            if not entry.startswith(('+', '-', ' ', '@@')) and entry != '*** End of File':
                raise ValueError('linha de patch ambigua')
            body.append(entry)
            index += 1
        if kind != 'Delete' and not body:
            raise ValueError('patch sem corpo')
        if kind == 'Delete':
            content = ''
        elif post:
            with open(target, encoding='utf-8') as handle:
                content = handle.read()
        elif kind == 'Add':
            content = '\n'.join(line[1:] for line in body) + '\n'
        else:
            with open(source, encoding='utf-8') as handle:
                content = reconstruct(handle.read(), body)
        translated = dict(event)
        translated['tool_name'] = 'Write' if kind == 'Add' else 'Edit'
        translated['tool_input'] = {'file_path': target, 'content': content}
        translated['expx_codex_patch'] = True
        translated['expx_patch_operation'] = kind
        translated['expx_patch_source'] = source
        result.append(translated)
        # Move verifica tambem o caminho de origem com o conteudo proposto.
        if source != target:
            original_event = dict(translated)
            original_event['tool_input'] = {'file_path': source, 'content': content}
            original_event['expx_patch_operation'] = 'MoveSource'
            result.append(original_event)
    if not paths:
        raise ValueError('patch vazio')
    return result
