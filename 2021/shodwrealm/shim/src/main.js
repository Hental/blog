import './shim';

async function test() {
  const r = new ShadowRealm();
  window.r = r;

  let res = r.evaluate('1 + 1');
  console.log('execute code result:', res);
  
  const fn = await r.importValue('./export.js', 'hello');
  console.log('execute import fn:', fn('foo'));

  const nestRealm = r.evaluate('new ShadowRealm();');
  console.log('nest ShadowRealm instance:', nestRealm);
  window.nr = nestRealm;

  //  throw SyntaxError
  r.evaluate('eval("")')
}

test();
