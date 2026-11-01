const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const repo = path.resolve(__dirname, '../../..');
const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash';

test('instalacao real mescla hooks, migra para launcher e permanece idempotente sem python3', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'runx installer spaces '));
  try {
    const base = path.join(temp, '.claude');
    fs.mkdirSync(base);
    const settings = path.join(base, 'settings.json');
    const original = { permissions: { allow: ['Read'] }, hooks: { PreToolUse: [
      { matcher: 'Write|Edit', hooks: [{ type: 'command', command: 'echo unrelated' }, { type: 'command', command: 'python3 /old/runx-hooks/comum/despachante.py antigo' }] },
      { matcher: 'Read', hooks: [{ type: 'command', command: 'echo read' }] },
    ] } };
    fs.writeFileSync(settings, JSON.stringify(original));
    // python3 falha deliberadamente; o instalador usa Node e o launcher escolhe py/python.
    const bin = path.join(temp, 'bin'); fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'python3'), '#!/usr/bin/env bash\nexit 99\n', { mode: 0o755 });
    if (process.platform !== 'win32') {
      const python = spawnSync(bash, ['-c', 'command -v python3'], { encoding: 'utf8' });
      assert.equal(python.status, 0, 'Python 3 necessario para executar os hooks');
      fs.symlinkSync(python.stdout.trim(), path.join(bin, 'python'));
    }
    const env = { ...process.env, HOME: temp, PATH: bin + path.delimiter + process.env.PATH };
    const args = [path.join(repo, 'install.sh').replace(/\\/g, '/'), '--global', '--claude', '--force'];
    function install() {
      const result = spawnSync(bash, args, { cwd: temp, env, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      return fs.readFileSync(settings, 'utf8');
    }
    const first = install(); assert.equal(install(), first);
    const conf = JSON.parse(first);
    assert.deepEqual(conf.permissions, original.permissions);
    assert.deepEqual(conf.hooks.PreToolUse[1], original.hooks.PreToolUse[1]);
    assert.deepEqual(JSON.parse(fs.readFileSync(settings + '.runx-backup', 'utf8')), original);
    const handlers = Object.values(conf.hooks).flat().flatMap(group => group.hooks);
    assert.ok(handlers.some(hook => hook.command === 'echo unrelated'));
    const installed = handlers.filter(hook => hook.command.includes('runx-hooks'));
    assert.equal(installed.length, 4);
    assert.ok(installed.every(hook => /^node ".*\/comum\/launcher\.cjs" /.test(hook.command)));
    const hook = installed.find(hook => hook.command.includes('segredo-no-commit'));
    const event = { tool_name: 'Write', tool_input: { file_path: path.join(temp, 'safe.ts'), content: 'const value = 1;' }, cwd: temp };
    function invoke() { return spawnSync(bash, ['-c', hook.command], { cwd: temp, env, input: JSON.stringify(event), encoding: 'utf8' }); }
    const safe = invoke(); assert.equal(safe.status, 0, safe.stderr);
    event.tool_input.content = 'sk-' + 'A'.repeat(45);
    const secret = invoke(); assert.equal(secret.status, 2, secret.stdout + secret.stderr);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
