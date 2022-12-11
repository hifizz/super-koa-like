const SuperKoa = require("./index");

const app = new SuperKoa();

app.use(async (ctx, next) => {
  console.log(1);
  ctx.body = "hello, one";
  await next();
  console.log(6);
});

app.use(async (ctx, next) => {
  console.log(2);
  ctx.body = "hello, two";
  await next();
  console.log(5);
});

app.use((ctx, next) => {
  console.log(3);
  ctx.body = "hello, world";
  next();
  console.log(4);
});

app.listen(1234);
