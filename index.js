const http = require("http");

function compose(middlewares) {
  return (ctx) => {
    const dispatch = (i) => {
      if (i === middlewares.length) {
        return;
      }
      const middleware = middlewares[i];
      return middleware(ctx, () => {
        dispatch(i + 1);
      });
    };

    return dispatch(0);
  };
}

class Application {
  constructor() {
    this.middlewares = [];
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {

      const ctx = new Context(req, res);

      const fn = compose(this.middlewares);

      try {
        await fn(ctx);
      } catch (err) {
        console.error(err);
        ctx.res.statusCode = 500;
        ctx.res.end("Internel Server Error");
      }

      ctx.res.end(ctx.body);
    });
    server.listen(...args);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }
}

class Context {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
}

module.exports = Application;
