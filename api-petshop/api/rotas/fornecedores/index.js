const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const Fornecedor = require("./Fornecedor");
const SerializadorFornecedor =
  require("../../Serializador").SerializadorFornecedor;
const roteadorProdutos = require("./produtos");

roteador.options("/", (_req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  res.status(204).end();
});

roteador.get("/", async (_req, res) => {
  const resultados = await TabelaFornecedor.listar();
  const serializador = new SerializadorFornecedor(
    res.getHeader("Content-Type"),
    ["empresa"]
  );

  res.status(200).send(serializador.serializar(resultados));
});

roteador.post("/", async (req, res, proximo) => {
  try {
    const dadosRecebidos = req.body;
    const fornecedor = new Fornecedor(dadosRecebidos);
    const serializador = new SerializadorFornecedor(
      res.getHeader("Content-Type"),
      ["empresa"]
    );

    await fornecedor.criar();

    res.status(201).send(serializador.serializar(fornecedor));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.options("/:idFornecedor", (_req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  res.status(204).end();
});

roteador.get("/:idFornecedor", async (req, res, proximo) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    const serializador = new SerializadorFornecedor(
      res.getHeader("Content-Type"),
      ["email", "empresa", "dataCriacao", "dataAtualizacao", "versao"]
    );

    await fornecedor.carregar();

    res.status(200).send(serializador.serializar(fornecedor));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.put("/:idFornecedor", async (req, res, proximo) => {
  try {
    const id = req.params.idFornecedor;
    const dadosRecebidos = req.body;
    const dados = Object.assign({}, dadosRecebidos, { id: id });
    const fornecedor = new Fornecedor(dados);

    await fornecedor.atualizar();

    res.status(204).end();
  } catch (erro) {
    proximo(erro);
  }
});

roteador.delete("/:idFornecedor", async (req, res, proximo) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });

    await fornecedor.carregar();
    await fornecedor.remover();

    res.status(204).end();
  } catch (erro) {
    proximo(erro);
  }
});

const verificarFornecedor = async (req, _res, proximo) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });

    await fornecedor.carregar();

    req.fornecedor = fornecedor;

    proximo();
  } catch (erro) {
    proximo(erro);
  }
};

roteador.use("/:idFornecedor/produtos", verificarFornecedor, roteadorProdutos);

module.exports = roteador;
