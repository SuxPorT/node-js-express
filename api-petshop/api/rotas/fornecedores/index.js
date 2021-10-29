const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const Fornecedor = require("./Fornecedor");
const SerializadorFornecedor =
  require("../../Serializador").SerializadorFornecedor;
const roteadorProdutos = require("./produtos");

roteador.options("/", (_requisicao, resposta) => {
  resposta.set("Access-Control-Allow-Methods", "GET, POST");
  resposta.set("Access-Control-Allow-Headers", "Content-Type");

  resposta.status(204).end();
});

roteador.get("/", async (_requisicao, resposta) => {
  const resultados = await TabelaFornecedor.listar();
  const serializador = new SerializadorFornecedor(
    resposta.getHeader("Content-Type"),
    ["empresa"]
  );

  resposta.status(200).send(serializador.serializar(resultados));
});

roteador.post("/", async (requisicao, resposta, proximo) => {
  try {
    const dadosRecebidos = requisicao.body;
    const fornecedor = new Fornecedor(dadosRecebidos);
    const serializador = new SerializadorFornecedor(
      resposta.getHeader("Content-Type"),
      ["empresa"]
    );

    await fornecedor.criar();

    resposta.status(201).send(serializador.serializar(fornecedor));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.options("/:idFornecedor", (_requisicao, resposta) => {
  resposta.set("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  resposta.set("Access-Control-Allow-Headers", "Content-Type");

  resposta.status(204).end();
});

roteador.get("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    const serializador = new SerializadorFornecedor(
      resposta.getHeader("Content-Type"),
      ["email", "empresa", "dataCriacao", "dataAtualizacao", "versao"]
    );

    await fornecedor.carregar();

    resposta.status(200).send(serializador.serializar(fornecedor));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.put("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const dadosRecebidos = requisicao.body;
    const dados = Object.assign({}, dadosRecebidos, { id: id });
    const fornecedor = new Fornecedor(dados);

    await fornecedor.atualizar();

    resposta.status(204).end();
  } catch (erro) {
    proximo(erro);
  }
});

roteador.delete("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });

    await fornecedor.carregar();
    await fornecedor.remover();

    resposta.status(204).end();
  } catch (erro) {
    proximo(erro);
  }
});

const verificarFornecedor = async (requisicao, _resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });

    await fornecedor.carregar();

    requisicao.fornecedor = fornecedor;

    proximo();
  } catch (erro) {
    proximo(erro);
  }
};

roteador.use("/:idFornecedor/produtos", verificarFornecedor, roteadorProdutos);

module.exports = roteador;
