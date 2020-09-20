type ParseStringParams<T extends string, Params = {}> = T extends `${infer Prefix}{${infer Param}}${infer Rest}`
  ? ParseStringParams<Rest, Merge<Params & ParamRecord<Param>>>
  : Params;

type ParamRecord<Keys extends keyof any> = {
  [P in Keys]: any;
}

type Merge<T> = {
  [P in keyof T]: T[P];
}

export interface ReplaceFn {
  <I extends string>(input: I, args: ParseStringParams<I>): string;
}

// test
let fn: ReplaceFn = (() => { }) as any;
fn('arg {foo} + {bar}', {
  foo: 'xxx',
  bar: 'xxx'
});

type Test = ParseStringParams<'{foo} + {bar}'>
