const database = require("../models");

class NivelController {
  static async pegaTodosOsNiveis(requisicao, resposta) {
    try {
      const todosOsNiveis = await database.Niveis.findAll();

      return resposta.status(200).json(todosOsNiveis);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async pegaUmNivel(requisicao, resposta) {
    const { id } = requisicao.params;

    try {
      const nivel = await database.Niveis.findOne({
        where: {
          id: Number(id),
        },
      });

      return resposta.status(200).json(nivel);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async criaNivel(requisicao, resposta) {
    const novoNivel = requisicao.body;

    try {
      const nivelCriado = await database.Niveis.create(novoNivel);

      return resposta.status(200).json(nivelCriado);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async atualizaNivel(requisicao, resposta) {
    const { id } = requisicao.params;
    const informacoes = requisicao.body;

    try {
      await database.Niveis.update(informacoes, {
        where: {
          id: Number(id),
        },
      });

      const nivelAtualizado = await database.Niveis.findOne({
        where: {
          id: Number(id),
        },
      });

      return resposta.status(200).json(nivelAtualizado);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async apagaNivel(requisicao, resposta) {
    const { id } = requisicao.params;

    try {
      await database.Niveis.destroy({
        where: {
          id: Number(id),
        },
      });

      return resposta.status(200).json({ mensagem: `id ${id} deletado` });
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }
}

module.exports = NivelController;
