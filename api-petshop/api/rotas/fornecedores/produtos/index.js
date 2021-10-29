const roteador = require("express").Router({ mergeParams: true });
const Tabela = require("./TabelaProduto");
const Produto = require("./Produto");
const Serializador = require("../../../Serializador").SerializadorProduto;

roteador.options("/", (_requisicao, resposta) => {
  resposta.set("Access-Control-Allow-Methods", "GET, POST");
  resposta.set("Access-Control-Allow-Headers", "Content-Type");

  resposta.status(204).end();
});

roteador.get("/", async (requisicao, resposta) => {
  const produtos = await Tabela.listar(requisicao.fornecedor.id);
  const serializador = new Serializador(resposta.getHeader("Content-Type"));

  resposta.send(serializador.serializar(produtos));
});

roteador.post("/", async (requisicao, resposta, proximo) => {
  try {
    const idFornecedor = requisicao.fornecedor.id;
    const corpo = requisicao.body;
    const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });
    const produto = new Produto(dados);
    const serializador = new Serializador(resposta.getHeader("Content-Type"));

    await produto.criar(dados);

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    resposta.set("ETag", produto.versao);
    resposta.set("Last-Modified", timestamp);
    resposta.set(
      "Location",
      `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
    );

    resposta.status(201).send(serializador.serializar(produto));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.options("/:id", (_requisicao, resposta) => {
  resposta.set("Access-Control-Allow-Methods", "HEAD, GET, PUT, DELETE");
  resposta.set("Access-Control-Allow-Headers", "Content-Type");

  resposta.status(204).end();
});

roteador.head("/:id", async (requisicao, resposta, proximo) => {
  try {
    const dados = {
      id: requisicao.params.id,
      fornecedor: requisicao.fornecedor.id,
    };

    const produto = new Produto(dados);

    await produto.carregar(produto);

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    resposta.set("ETag", produto.versao);
    resposta.set("Last-Modified", timestamp);

    resposta.status(200).end();
  } catch (erro) {
    proximo(erro);
  }
});

roteador.get("/:id", async (requisicao, resposta, proximo) => {
  try {
    const dados = {
      id: requisicao.params.id,
      fornecedor: requisicao.fornecedor.id,
    };

    const produto = new Produto(dados);
    const serializador = new Serializador(resposta.getHeader("Content-Type"), [
      "fornecedor",
      "preco",
      "estoque",
      "dataCriacao",
      "dataAtualizacao",
      "versao",
    ]);

    await produto.carregar(produto);

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    resposta.set("ETag", produto.versao);
    resposta.set("Last-Modified", timestamp);

    resposta.status(200).send(serializador.serializar(produto));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.put("/:id", async (requisicao, resposta, proximo) => {
  try {
    const dados = Object.assign({}, requisicao.body, {
      id: requisicao.params.id,
      fornecedor: requisicao.fornecedor.id,
    });

    const produto = new Produto(dados);

    await produto.atualizar();
    await produto.carregar();

    const timestamp = new Date(produto.dataAtualizacao).getTime();

    resposta.set("ETag", produto.versao);
    resposta.set("Last-Modified", timestamp);

    resposta.status(204).end();
  } catch (erro) {
    proximo(erro);
  }
});

roteador.delete("/:idProduto", async (requisicao, resposta) => {
  const dados = {
    id: requisicao.params.idProduto,
    fornecedor: requisicao.fornecedor.id,
  };

  const produto = new Produto(dados);

  await produto.remover();

  resposta.status(204).end();
});

roteador.options("/:id/diminuir-estoque", (_requisicao, resposta) => {
  resposta.set("Access-Control-Allow-Methods", "POST");
  resposta.set("Access-Control-Allow-Headers", "Content-Type");

  resposta.status(204).end();
});

roteador.post(
  "/:id/diminuir-estoque",
  async (requisicao, resposta, proximo) => {
    try {
      const produto = new Produto({
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id,
      });

      await produto.carregar();

      produto.estoque = produto.estoque - requisicao.body.quantidade;

      await produto.diminuirEstoque();
      await produto.carregar();

      const timestamp = new Date(produto.dataAtualizacao).getTime();

      resposta.set("ETag", produto.versao);
      resposta.set("Last-Modified", timestamp);

      resposta.status(204).end();
    } catch (erro) {
      proximo(erro);
    }
  }
);

module.exports = roteador;
