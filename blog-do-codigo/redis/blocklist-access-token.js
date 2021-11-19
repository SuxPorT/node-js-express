const redis = require("redis");
const jwt = require("jsonwebtoken");
const blocklist = redis.createClient({ prefix: "blocklist-access-token:" });
const manipulaLista = require("./manipula-lista");
const manipulaBlocklist = manipulaLista(blocklist);
const { promisify } = require("util");
const { createHash } = require("crypto");

function geraTokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

module.exports = {
  async adiciona(token) {
    const dataExpiracao = jwt.decode(token).exp;
    const tokenHash = geraTokenHash(token);

    await manipulaBlocklist.adiciona(tokenHash, "", dataExpiracao);
  },

  async contemToken(token) {
    const tokenHash = geraTokenHash(token);

    return manipulaBlocklist.contemChave(tokenHash);
  },
};
