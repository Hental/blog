console.log("eval entry");

import { foo, bar } from "./cjs/index.js";
import * as cjsExported from "./cjs/index.js";
import cjsExportDefault from "./cjs/index.js";
import 'data:text/javascript,console.log("eval import data");';

const res = await import("./esm/dynamic.js");

// esm
import { esm } from "./esm/index.js";

const meta = import.meta;
