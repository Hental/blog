export type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;
type Test1 = Awaited<Promise<Promise<string>>>;


type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Test2 = ReturnType<(...args: any[]) => { foo: 'bar' }>;


type ArgumentsType<T> = T extends (...args: infer R) => any ? R : never;
type Test3 = ArgumentsType<(foo: string, bar: number, opt: { enable: boolean }) => any>;
