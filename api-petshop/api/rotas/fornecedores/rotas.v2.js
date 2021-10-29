const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const SerializadorFornecedor =
  require("../../Serializador").SerializadorFornecedor;
const roteadorProdutos = require("./produtos");

roteador.options("/", (_requisicao, resposta) => {
  resposta.set("Access-Control-Allow-Methods", "GET");
  resposta.set("Access-Control-Allow-Headers", "Content-Type");

  resposta.status(204).end();
});

roteador.get("/", async (_requisicao, resposta) => {
  const resultados = await TabelaFornecedor.listar();
  const serializador = new SerializadorFornecedor(
    resposta.getHeader("Content-Type")
  );

  resposta.status(200).send(serializador.serializar(resultados));
});

module.exports = roteador;
