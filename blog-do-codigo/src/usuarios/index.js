module.exports = {
  rotas: require("./usuarios-rotas"),
  controlador: require("./usuarios-controlador"),
  modelo: require("./usuarios-modelo"),
  estrategiasAutenticacao: require("./estrategia-autenticacao"),
  middlewaresAutenticacao: require("./middlewares-autenticacao"),
};
