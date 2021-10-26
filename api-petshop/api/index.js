const express = require("express");
const app = express();
const config = require("config");
const roteador = require("./rotas/fornecedores");
const NaoEncontrado = require("./erros/NaoEncontrado");
const CampoInvalido = require("./erros/CampoInvalido");
const DadosNaoFornecidos = require("./erros/DadosNaoFornecidos");
const ValorNaoSuportado = require("./erros/ValorNaoSuportado");
const formatosAceitos = require("./Serializador").formatosAceitos;
const SerializadorErro = require("./Serializador").SerializadorErro;

app.use(express.json());

app.use((requisicao, resposta, proximo) => {
  let formatoRequisitado = requisicao.header("Accept");

  if (formatoRequisitado === "*/*") {
    formatoRequisitado = "application/json";
  }

  if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
    resposta.status(406).end();

    return;
  }

  resposta.setHeader("Content-Type", formatoRequisitado);
  proximo();
});

app.use("/api/fornecedores", roteador);

app.use((erro, _requisicao, resposta, _proximo) => {
  let status = 500;

  switch (erro.constructor) {
    case NaoEncontrado:
      status = 404;
    case CampoInvalido || DadosNaoFornecidos:
      status = 400;
    case ValorNaoSuportado:
      status = 406;
  }

  const serializador = new SerializadorErro(resposta.getHeader("Content-Type"));

  resposta
    .status(status)
    .send(serializador.serializar({ id: erro.idErro, mensagem: erro.message }));
});

app.listen(config.get("api.porta"), () => {
  console.log("A API está funcionando!");
});
