require("dotenv").config();
require("./database");
require("./redis/blocklist-access-token");
require("./redis/allowlist-refresh-token");

const jwt = require("jsonwebtoken");
const app = require("./app");
const routes = require("./rotas");
const port = 3000;
const {
  InvalidArgumentError,
  NotFoundError,
  NotAuthorizedError,
} = require("./src/erros");

routes(app);

app.use((_req, res, next) => {
  res.set({ "Content-Type": "application/json" });

  next();
});

app.use((erro, _req, _res, _next) => {
  let status;
  const corpo = {
    mensagem: erro.message,
  };

  switch (erro.constructor) {
    case InvalidArgumentError:
      status = 400;
      break;
    case NotAuthorizedError:
    case jwt.JsonWebTokenError:
      status = 401;
      break;
    case jwt.TokenExpiredError:
      status = 401;
      corpo.expiradoEm = erro.expiredAt;
    case NotFoundError:
      status = 404;
      break;
    default:
      status = 500;
      break;
  }

  resposta.status(status).json(corpo);
});

app.listen(port, () => console.log(`App listening on port ${port}`));
