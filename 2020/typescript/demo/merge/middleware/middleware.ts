import { Context, Next } from 'koa';

declare module 'http' {
  interface IncomingMessage {
    myRequestProp: number;
  }

  interface ServerResponse {
    myResponseProp: string;
  }
}

export async function middleware(ctx: Context, next: Next) { 
  ctx.req.myRequestProp = 1;
  ctx.res.myResponseProp = '';
  await next();
}
