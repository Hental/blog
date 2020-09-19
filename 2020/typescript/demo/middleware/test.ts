import { Middleware  } from 'koa';

const mw: Middleware = (ctx) => {
  ctx.req.myRequestProp;
  ctx.res.myResponseProp;
};

