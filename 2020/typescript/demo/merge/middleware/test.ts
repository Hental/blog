import { Middleware } from 'koa';
import './declare';

const mw: Middleware = (ctx) => {
  ctx.req.myRequestProp;
  ctx.res.myResponseProp;
};

