const postsControlador = require("./posts-controlador");
const autorizacao = require("../middlewares/autorizacao");
const tentarAutenticar = require("../middlewares/tentarAutenticar");
const tentarAutorizar = require("../middlewares/tentarAutorizar");
const { middlewaresAutenticacao } = require("../usuarios");

module.exports = (app) => {
  app
    .route("/post")
    .get(
      [tentarAutenticar, tentarAutorizar("post", "ler")],
      postsControlador.lista
    )
    .post(
      [middlewaresAutenticacao.bearer, autorizacao("post", "criar")],
      postsControlador.adiciona
    );

  app
    .route("/post/:id")
    .get(
      [middlewaresAutenticacao.bearer, autorizacao("post", "ler")],
      postsControlador.obterDetalhes
    )
    .delete(
      [
        middlewaresAutenticacao.bearer,
        middlewaresAutenticacao.local,
        autorizacao("post", "remover"),
      ],
      postsControlador.remover
    );
};
