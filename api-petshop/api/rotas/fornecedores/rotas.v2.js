const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const SerializadorFornecedor =
  require("../../Serializador").SerializadorFornecedor;

roteador.options("/", (_req, res) => {
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  res.status(204).end();
});

roteador.get("/", async (_req, res) => {
  const resultados = await TabelaFornecedor.listar();
  const serializador = new SerializadorFornecedor(
    res.getHeader("Content-Type")
  );

  res.status(200).send(serializador.serializar(resultados));
});

module.exports = roteador;
