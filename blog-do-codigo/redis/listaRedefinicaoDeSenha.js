const redis = require("redis");
const conexao = redis.createClient({ prefix: "redfinicao-de-senha" });
const manipulaLista = require("./manipula-lista");

module.exports = manipulaLista(conexao);
