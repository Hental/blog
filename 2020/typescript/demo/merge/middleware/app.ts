import Koa from 'koa';
import { middleware } from './middleware';

const app = new Koa();

app.use(middleware);
app.use(async (ctx) => {
  console.log(ctx.req.myRequestProp);  
  console.log(ctx.res.myResponseProp);
});
