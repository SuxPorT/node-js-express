const { NiveisServices } = require("../services");
const niveisServices = new NiveisServices();

class NivelController {
  static async pegaTodosOsNiveis(_req, res) {
    try {
      const niveis = await niveisServices.pegaTodosOsRegistros();

      return res.status(200).json(niveis);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaNivel(req, res) {
    const { id } = req.params;

    try {
      const nivel = await niveisServices.pegaUmRegistro({ id });

      return res.status(200).json(nivel);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criaNivel(req, res) {
    const nivel = req.body;

    try {
      const nivelCriado = await niveisServices.criaRegistro(nivel);

      return res.status(200).json(nivelCriado);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizaNivel(req, res) {
    const { id } = req.params;
    const informacoes = req.body;

    try {
      await niveisServices.atualizaRegistro(informacoes, Number(id));

      return res.status(200).json({ mensagem: `id ${id} atualizado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async apagaNivel(req, res) {
    const { id } = req.params;

    try {
      await niveisServices.apagaRegistro(Number(id));

      return res.status(200).json({ mensagem: `id ${id} deletado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async restauraNivel(requisicao, resposta) {
    const { id } = requisicao.params;

    try {
      await niveisServices.restauraRegistro(Number(id));

      return resposta.status(200).json({ mensagem: `id ${id} restaurado` });
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }
}

module.exports = NivelController;
