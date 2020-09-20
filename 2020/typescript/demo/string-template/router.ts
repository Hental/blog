type ParseParams<P extends string, Params = {}> = P extends `${infer Prefix}:${infer Param}/${infer Rest}`
  ? ParseParams<Rest, Merge<Params & ParamRecord<Param>>>
  : P extends `${infer Prefix}:${infer Param}`
  ? Merge<Params & ParamRecord<Param>>
  : Params;

type ParamRecord<Keys extends keyof any> = {
  [P in Keys]: any;
}

type Merge<T> = {
  [P in keyof T]: T[P];
}


interface Context<P extends string> {
  params: ParseParams<P>;
}

type Callback<P extends string> = (ctx: Context<P>) => Promise<any> | any;

interface Router {
  get<P extends string>(path: P, cb: Callback<P>): Router;
}


// test
let router: Router = null as any;
router
  .get('/:id', ctx => ctx.params.id)
  .get('/path/:uuid/some', ctx => ctx.params.uuid)
  .get('/:foo/:bar', ctx => ctx.params.foo && ctx.params.bar);
