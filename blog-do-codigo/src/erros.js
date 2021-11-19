class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);

    this.name = "InvalidArgumentError";
  }
}

class InternalServerError extends Error {
  constructor(mensagem) {
    super(mensagem);

    this.name = "InternalServerError";
  }
}

class NotFoundError extends Error {
  constructor(entidade) {
    const mensagem = `Não foi possível encontrar ${entidade}`;

    super(mensagem);

    this.name = "NotFoundError";
  }
}

class NotAuthorizedError extends Error {
  constructor() {
    const mensagem = "Não foi possível acessar esse recurso";

    super(mensagem);

    this.name = "NotAuthorizedError";
  }
}

module.exports = {
  InvalidArgumentError,
  InternalServerError,
  NotFoundError,
  NotAuthorizedError,
};
