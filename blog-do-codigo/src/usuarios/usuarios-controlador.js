const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");
const Usuario = require("./usuarios-modelo");
const allowlistRefreshToken = require("../../redis/allowlist-refresh-token");
const tokens = require("./tokens");
const { EmailVerificacao } = require("./emails");
const { InvalidArgumentError, InternalServerError } = require("../erros");

async function criaTokenOpaco(usuario) {
  const tokenOpaco = crypto.randomBytes(24).toString("hex");
  const dataExpiracao = moment().add(5, "d").unix();

  await allowlistRefreshToken.adiciona(tokenOpaco, usuario.id, dataExpiracao);

  return tokenOpaco;
}

function geraEndereco(rota, token) {
  const baseURL = process.env.BASE_URL;

  return `${baseURL}${rota}${token}`;
}

module.exports = {
  async adiciona(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
      });

      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      const token = tokens.verificacaoEmail.cria(usuario.id);
      const endereco = geraEndereco("/usuario/verifica_email", token);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);

      emailVerificacao.enviaEmail().catch(console.log);

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  async login(req, res) {
    const acessToken = tokens.access.cria(req.user.id);
    const refreshToken = await tokens.refresh.cria(req.user.id);

    res.set("Authorization", acessToken);

    res.status(200).json({ refreshToken });
  },

  async logout(req, res) {
    try {
      const token = req.token;

      await tokens.access.invalida(token);

      res.status(204).json();
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  async lista(_req, res) {
    const usuarios = await Usuario.lista();

    res.json(usuarios);
  },

  async verificaEmail(req, res) {
    try {
      const usuario = await Usuario.buscaPorId(req.params.id);

      await usuario.verificaEmail();

      res.status(200).json();
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  async deleta(req, res) {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();

      res.status(200).json();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },
};
