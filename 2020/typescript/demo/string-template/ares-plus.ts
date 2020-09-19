type AvailableAresURL<T> = {
  [Alias in keyof T]: Alias extends string
  ? keyof T[Alias] extends string
  ? `module://${Alias}/${keyof T[Alias]}`
  : never
  : never;
}[keyof T];

type AresModuleUrl<Path, Prefix extends string = '/<group>/<module>'> = Path extends string ? `https://<host>/modules${Prefix}/${Path}` : string;

type GetAresModulePathPrefix<Modules, Alias extends keyof Modules> = Modules[Alias] extends string
  ? Modules[Alias] extends `${infer Group}@${infer Package}:${infer Version}`
  ? `/${Group}/${Package}`
  : string
  : string;

type RealUrlString<Manifest, Modules, Url> = Url extends `module://${infer Alias}/${infer Path}`
  ? Alias extends keyof Manifest
  ? Path extends keyof Manifest[Alias]
  ? Alias extends keyof Modules
  ? AresModuleUrl<Manifest[Alias][Path], GetAresModulePathPrefix<Modules, Alias>>
  : AresModuleUrl<Manifest[Alias][Path]>
  : string
  : string
  : string;

interface GetUrl<M = Record<string, Record<string, string>>, C = Record<string, string>> {
  <P extends AvailableAresURL<M>>(path: P): RealUrlString<M, C, P>;
}


//  test
type MyAresModuleConfig = {
  moduleA: "groupA@nameA:*";
  moduleB: "groupB@nameB:*";
}

type MyAresManifest = {
  moduleA: {
    'path/to/imag': 'xxx.png',
    'path/to/js': 'xx.js',
    'path/to/css': 'xx.css',
  };
  moduleB: {
    'path/to/font': 'xxx.woff',
    'path/to/svg': 'xx.svg',
  };
};

let getUrl: GetUrl<MyAresManifest, MyAresModuleConfig> = (() => { }) as any;
let url = getUrl('module://moduleA/path/to/imag');

let getUrl2: GetUrl<MyAresManifest> = (() => { }) as any;
let url2 = getUrl2('module://moduleA/path/to/imag');

let getUrl3: GetUrl = (() => { }) as any;
let url3 = getUrl3('xxx');
