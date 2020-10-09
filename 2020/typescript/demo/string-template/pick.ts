type PickProperty<T, Expression> = Expression extends `${infer Prop}.${infer Rest}`
  ? Prop extends keyof T
  ? PickProperty<T[Prop], Rest>
  : undefined
  : Expression extends keyof T
  ? T[Expression]
  : undefined;

type Dot<T extends string> = T extends '' ? '' : `.`;
type NestExpression<T extends any, Prefix extends string> = T extends { [key: string]: any }
  ? `${Prefix}.${Expression<T>}`
  : never;

type Expression<T extends { [key: string]: any }, Prefix extends string = ''> = {
  [P in keyof T]: P extends string
    ? `${Prefix}${Dot<Prefix>}${P}` | NestExpression<T[P], `${Prefix}${Dot<Prefix>}${P}`>
    : never;
}[keyof T];

function pick<T extends { [key: string]: any }, E extends Expression<T>>(obj: T, prop: E): PickProperty<T, E> {
  return prop
    .split('.')
    .reduce((prev, key) => prev?.[key], obj) as any;
}


// test
let obj = {
  foo: 'bar',
  children: {
    object: {
      prop: 'string',
    },
    nestObject: {
      someProp: true,
      nestChildren: {
        bar: 'foo',
      }
    },
    num: 1,
  }
}
let res = pick(obj, 'children.nestObject.nestChildren');
type AvailableExpressions = Expression<typeof obj>;
