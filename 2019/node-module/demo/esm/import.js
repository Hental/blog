// flag --experimental-modules

import('./foo.mjs').then(foo => {
  console.log(foo);
});
