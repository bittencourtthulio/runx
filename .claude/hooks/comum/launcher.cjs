const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

function selectPython(run = spawnSync) {
  for (const [command, prefix] of [['python3', []], ['py', ['-3']], ['python', []]]) {
    const probe = run(command, [...prefix, '-c', 'import sys; print("expx-python-3" if sys.version_info.major == 3 else "unsupported")'], { encoding: 'utf8', timeout: 2000, windowsHide: true });
    if (!probe.error && probe.status === 0 && probe.stdout.trim() === 'expx-python-3') return { command, prefix };
  }
  throw new Error('Python 3 indisponivel: instale Python 3 e disponibilize python3, py -3 ou python no PATH.');
}
function dispatch(args, input, options = {}) {
  try {
    const python = selectPython();
    const result = spawnSync(python.command, [...python.prefix, path.join(__dirname, 'despachante.py'), ...args], {
      input, encoding: 'utf8', timeout: 9000, maxBuffer: 16 * 1024 * 1024, windowsHide: true, ...options,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8', ...options.env },
    });
    if (result.error || result.signal || result.status == null) throw new Error(result.error?.message || 'despachante interrompido');
    return { status: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
  } catch (error) {
    return { status: args.includes('comum/segredo-no-commit') ? 2 : 0, stdout: '', stderr: `[expx] Falha ao executar hooks: ${error.message}\n` };
  }
}
if (require.main === module) {
  const result = dispatch(process.argv.slice(2), fs.readFileSync(0, 'utf8'));
  process.stdout.write(result.stdout); process.stderr.write(result.stderr); process.exitCode = result.status;
}
module.exports = { selectPython, dispatch };
