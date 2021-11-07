const { TurmasServices } = require("../services");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const turmasServices = new TurmasServices();

class TurmaController {
  static async pegaTodasAsTurmas(req, res) {
    const { data_inicial, data_final } = req.query;
    const where = {};

    data_inicial || data_final ? (where.data_inicio = {}) : null;
    data_inicial ? (where.data_inicio[Op.gte] = data_inicial) : null;
    data_final ? (where.data_inicio[Op.lte] = data_final) : null;

    try {
      const turmas = await turmasServices.pegaTodosOsRegistros(where);

      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaTurma(req, res) {
    const { id } = req.params;

    try {
      const turma = await turmasServices.pegaUmRegistro({ id });

      return res.status(200).json(turma);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criaTurma(req, res) {
    const turma = req.body;

    try {
      const turmaCriada = await turmasServices.criaRegistro(turma);

      return res.status(200).json(turmaCriada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizaTurma(req, res) {
    const { id } = req.params;
    const informacoes = req.body;

    try {
      await turmasServices.atualizaRegistro(informacoes, Number(id));

      return res.status(200).json({ mensagem: `id ${id} atualizado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async apagaTurma(req, res) {
    const { id } = req.params;

    try {
      await turmasServices.apagaRegistro(Number(id));

      return res.status(200).json({ mensagem: `id ${id} deletado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async restauraTurma(req, res) {
    const { id } = req.params;

    try {
      await turmasServices.restauraRegistro(Number(id));

      return res.status(200).json({ mensagem: `id ${id} restaurado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = TurmaController;
