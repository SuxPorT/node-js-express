const express = require("express");
const app = express();
const config = require("config");
const roteador = require("./rotas/fornecedores");
const roteadorV2 = require("./rotas/fornecedores/rotas.v2");
const NaoEncontrado = require("./erros/NaoEncontrado");
const CampoInvalido = require("./erros/CampoInvalido");
const DadosNaoFornecidos = require("./erros/DadosNaoFornecidos");
const ValorNaoSuportado = require("./erros/ValorNaoSuportado");
const formatosAceitos = require("./Serializador").formatosAceitos;
const SerializadorErro = require("./Serializador").SerializadorErro;

app.use(express.json());

app.use((req, res, proximo) => {
  let formatoRequisitado = req.header("Accept");

  if (formatoRequisitado === "*/*") {
    formatoRequisitado = "application/json";
  }

  if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
    res.status(406).end();

    return;
  }

  res.setHeader("Content-Type", formatoRequisitado);
  proximo();
});

app.use((_req, res, proximo) => {
  res.set("Access-Control-Allow-Origin", "*");

  proximo();
});

app.use("/api/fornecedores", roteador);

app.use("/api/v2/fornecedores", roteadorV2);

app.use((erro, _req, res, _proximo) => {
  let status = 500;

  switch (erro.constructor) {
    case NaoEncontrado:
      status = 404;
      break;
    case CampoInvalido:
    case DadosNaoFornecidos:
      status = 400;
      break;
    case ValorNaoSuportado:
      status = 406;
      break;
  }

  const serializador = new SerializadorErro(res.getHeader("Content-Type"));

  res
    .status(status)
    .send(serializador.serializar({ id: erro.idErro, mensagem: erro.message }));
});

app.listen(config.get("api.porta"), () => {
  console.log("A API está funcionando!");
});
