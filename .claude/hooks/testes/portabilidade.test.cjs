const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const { selectPython } = require('../comum/launcher.cjs');
const secret = 'sk-' + 'A'.repeat(45);
function invoke(event, args = ['comum/segredo-no-commit'], base = root, env = {}) {
  return spawnSync(process.execPath, [path.join(base, 'comum/launcher.cjs'), ...args], { input: JSON.stringify(event), encoding: 'utf8', cwd: event.cwd || process.cwd(), env: { ...process.env, ...env } });
}
function patch(body) { return { tool_name: 'functions.apply_patch', tool_input: { command: '*** Begin Patch\n' + body + '\n*** End Patch' } }; }
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'expx hooks com espacos '));
  const base = path.join(dir, '.claude/hooks'); fs.cpSync(root, base, { recursive: true });
  return { dir, base };
}
test('Python 3: verifica versao, fallback py -3, indisponibilidade', () => {
  const calls = [];
  const result = selectPython((cmd, args) => { calls.push([cmd,args]); return cmd === 'py' ? { status: 0, stdout: 'expx-python-3\n' } : { status: 0, stdout: 'unsupported' }; });
  assert.equal(result.command, 'py'); assert.equal(calls[1][1][0], '-3');
  assert.throws(() => selectPython(() => ({status:1,stdout:''})), /indisponivel/);
});
test('patch multi: segredo no segundo arquivo bloqueia operacao inteira', () => {
  assert.equal(invoke(patch('*** Add File: first.ts\n+ok\n*** Add File: second.ts\n+' + secret)).status, 2);
});
test('add update move e linhas longas', () => {
  for (const body of ['*** Add File: a.ts\n+' + secret, '*** Update File: a.ts\n@@\n-old\n+' + secret, '*** Update File: a.ts\n*** Move to: b.ts\n@@\n-old\n+' + secret, '*** Add File: a.ts\n+' + 'z'.repeat(5000) + secret]) assert.equal(invoke(patch(body)).status, 2, body.slice(0,60));
  assert.equal(invoke(patch('*** Add File: a.ts\n+ok')).status, 0);
});
test('payload e patch ambiguos fecham scanner', () => {
  for (const event of [{}, patch('*** Update File: a.ts\ntexto'), patch('*** Add File: a.ts\n+ok\n*** Add File: a.ts\n+outro')]) assert.equal(invoke(event).status, 2);
});
test('scanner import, main ausente e excecao falham fechados; metodo continua aberto', () => {
  const { base, dir } = fixture();
  try {
    for (const code of ['raise RuntimeError("import")', 'x=1', 'def main():\n    raise RuntimeError("main")']) {
      fs.writeFileSync(path.join(base,'comum/segredo-no-commit.py'),code);
      assert.equal(invoke({tool_name:'Write',tool_input:{file_path:'a.ts',content:'ok'}},undefined,base).status,2);
      fs.writeFileSync(path.join(base,'runx/causa-antes-do-plano.py'),code);
      assert.equal(invoke({tool_name:'Write',tool_input:{file_path:'a.ts',content:'ok'}},['runx/causa-antes-do-plano'],base).status,0);
    }
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
test('Python ausente: bloqueio de seguranca e aviso de metodo', () => {
  const event={tool_name:'Write',tool_input:{file_path:'a.ts',content:'ok'}};
  assert.equal(invoke(event,undefined,root,{PATH:''}).status,2);
  const result=invoke(event,['runx/causa-antes-do-plano'],root,{PATH:''});
  assert.equal(result.status,0); assert.match(result.stderr,/Python 3 indisponivel/);
});
test('ponte real descobre manifesto com launcher, bloqueia segredo e aceita Bash Pre/Post', async () => {
  const {base,dir}=fixture();
  try {
    const {RunxPonte}=require(path.join(base,'ponte/runx-ponte.js'));
    const bridge=await RunxPonte({directory:dir});
    await assert.rejects(bridge['tool.execute.before']({tool:'write',callID:'secret'},{args:{filePath:path.join(dir,'a.ts'),content:secret}}),/Credencial/);
    await bridge['tool.execute.before']({tool:'bash',callID:'bash'},{args:{command:'echo ok'}});
    await bridge['tool.execute.after']({tool:'bash',callID:'bash',args:{command:'npm test'}},{metadata:{exit:0},output:'ok'});
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});

test('rastro Codex: somente sucesso explicito registra cada arquivo', () => {
  const python=selectPython();
  const code=`import importlib.util, sys
sys.path.insert(0, sys.argv[1] + '/comum')
spec=importlib.util.spec_from_file_location('rastro_test',sys.argv[1]+'/comum/rastro-arquivo.py')
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
m.R.caminho_da_ferramenta=lambda e: 'a.ts'
m.R.pasta_ocorrencia=lambda: 'occ'
m.R.frontmatter=lambda p: {}
m.R.trabalho_id=lambda p: 'OC-1'
m.task_aberta=lambda p: (None,None)
recorded=[]
m.R.grava=lambda *a,**k: recorded.append(a)
for response in ({}, {'success':False}, {'error':'failed'}, {'success':True}):
 m.R.ler_evento=lambda: {'expx_codex_patch':True,'tool_response':response}
 try: m.main()
 except SystemExit: pass
assert len(recorded)==1, recorded
`;
  const result=spawnSync(python.command,[...python.prefix,'-c',code,root],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
});

test('Update reconstrui frontmatter: Write e patch barram task sem suite', () => {
  const {dir,base}=fixture();
  try {
    fs.mkdirSync(path.join(dir,'.git'));
    fs.mkdirSync(path.join(dir,'.expx'));
    fs.writeFileSync(path.join(dir,'.expx/hooks.json'),JSON.stringify({hooks:{'task-so-fecha-verde':'bloqueio'}}));
    const relative='docs/manutencao/OC-2026-0001/sprint-01/tasks.md';
    const full=path.join(dir,relative);
    fs.mkdirSync(path.dirname(full),{recursive:true});
    const old='---\ntasks:\n  - id: T-01.01\n    status: em_andamento\n    suite: nao_executada\n---\n';
    fs.writeFileSync(full,old);
    const args=['comum/segredo-no-commit','runx/task-so-fecha-verde'];
    const write=invoke({cwd:dir,tool_name:'Write',tool_input:{file_path:full,content:old.replace('em_andamento','concluida')}},args,base);
    assert.equal(write.status,2,write.stderr);
    const event=patch('*** Update File: '+relative+'\n@@\n-    status: em_andamento\n+    status: concluida'); event.cwd=dir;
    const update=invoke(event,args,base);
    assert.equal(update.status,2,update.stderr); assert.match(update.stderr,/Task marcada/);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
test('move inspeciona conteudo preservado da origem, delete emite evento, aliases bloqueiam', () => {
  const {dir,base}=fixture();
  try {
    fs.writeFileSync(path.join(dir,'.env'),secret+'\nkeep\n');
    const moved=patch('*** Update File: .env\n*** Move to: tracked.ts\n@@\n keep'); moved.cwd=dir;
    const result=invoke(moved,undefined,base);
    assert.equal(result.status,2); assert.match(result.stderr,/Credencial/);
    const repeated=patch('*** Add File: a.ts\n+ok\n*** Add File: sub/../a.ts\n+ok'); repeated.cwd=dir;
    assert.equal(invoke(repeated,undefined,base).status,2);
    const python=selectPython();
    const code="import sys,json;sys.path.insert(0,sys.argv[1]+'/comum');from eventos import events;e=events(json.dumps({'tool_name':'apply_patch','tool_input':{'command':'*** Begin Patch\\n*** Delete File: a.ts\\n*** End Patch'}}));assert len(e)==1 and e[0]['expx_patch_operation']=='Delete'";
    const deleted=spawnSync(python.command,[...python.prefix,'-c',code,base],{encoding:'utf8',cwd:dir});
    assert.equal(deleted.status,0,deleted.stderr);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});

test('Update e move validos passam com conteudo completo; origem com segredo bloqueia', () => {
  const {dir,base}=fixture();
  try {
    fs.writeFileSync(path.join(dir,'a.ts'),'before\nkeep\n');
    for (const move of ['', '*** Move to: b.ts\n']) {
      const event=patch('*** Update File: a.ts\n'+move+'@@\n-before\n+after\n keep'); event.cwd=dir;
      const result=invoke(event,undefined,base); assert.equal(result.status,0,result.stderr);
    }
    fs.writeFileSync(path.join(dir,'a.ts'),secret+'\nbefore\n');
    const event=patch('*** Update File: a.ts\n@@\n-before\n+after'); event.cwd=dir;
    const result=invoke(event,undefined,base); assert.equal(result.status,2); assert.match(result.stderr,/Credencial/);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
