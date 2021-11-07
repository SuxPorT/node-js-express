const roteador = require("express").Router({ mergeParams: true });
const Tabela = require("./TabelaProduto");
const Produto = require("./Produto");
const Serializador = require("../../../Serializador").SerializadorProduto;

roteador.options("/", (_req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  res.status(204).end();
});

roteador.get("/", async (req, res) => {
  const produtos = await Tabela.listar(req.fornecedor.id);
  const serializador = new Serializador(res.getHeader("Content-Type"));

  res.send(serializador.serializar(produtos));
});

roteador.post("/", async (req, res, proximo) => {
  try {
    const idFornecedor = req.fornecedor.id;
    const corpo = req.body;
    const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });
    const produto = new Produto(dados);
    const serializador = new Serializador(res.getHeader("Content-Type"));

    await produto.criar(dados);

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    res.set("ETag", produto.versao);
    res.set("Last-Modified", timestamp);
    res.set(
      "Location",
      `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
    );

    res.status(201).send(serializador.serializar(produto));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.options("/:id", (_req, res) => {
  res.set("Access-Control-Allow-Methods", "HEAD, GET, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  res.status(204).end();
});

roteador.head("/:id", async (req, res, proximo) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    };

    const produto = new Produto(dados);

    await produto.carregar(produto);

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    res.set("ETag", produto.versao);
    res.set("Last-Modified", timestamp);

    res.status(200).end();
  } catch (erro) {
    proximo(erro);
  }
});

roteador.get("/:id", async (req, res, proximo) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    };

    const produto = new Produto(dados);
    const serializador = new Serializador(res.getHeader("Content-Type"), [
      "fornecedor",
      "preco",
      "estoque",
      "dataCriacao",
      "dataAtualizacao",
      "versao",
    ]);

    await produto.carregar(produto);

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    res.set("ETag", produto.versao);
    res.set("Last-Modified", timestamp);

    res.status(200).send(serializador.serializar(produto));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.put("/:id", async (req, res, proximo) => {
  try {
    const dados = Object.assign({}, req.body, {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    });

    const produto = new Produto(dados);

    await produto.atualizar();
    await produto.carregar();

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    res.set("ETag", produto.versao);
    res.set("Last-Modified", timestamp);

    res.status(204).end();
  } catch (erro) {
    proximo(erro);
  }
});

roteador.delete("/:idProduto", async (req, res) => {
  const dados = {
    id: req.params.idProduto,
    fornecedor: req.fornecedor.id,
  };

  const produto = new Produto(dados);

  await produto.remover();

  res.status(204).end();
});

roteador.options("/:id/diminuir-estoque", (_req, res) => {
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  res.status(204).end();
});

roteador.post(
  "/:id/diminuir-estoque",
  async (req, res, proximo) => {
    try {
      const produto = new Produto({
        id: req.params.id,
        fornecedor: req.fornecedor.id,
      });

      await produto.carregar();

      produto.estoque = produto.estoque - req.body.quantidade;

      await produto.diminuirEstoque();
      await produto.carregar();

      const timestamp = new Date(produto.dataAtualizacao).getTime();

      res.set("ETag", produto.versao);
      res.set("Last-Modified", timestamp);

      res.status(204).end();
    } catch (erro) {
      proximo(erro);
    }
  }
);

module.exports = roteador;
