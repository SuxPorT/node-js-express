const database = require("../models");

class PessoaController {
  static async pegaTodasAsPessoas(_requisicao, resposta) {
    try {
      const pessoas = await database.Pessoas.findAll();

      return resposta.status(200).json(pessoas);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async pegaUmaPessoa(requisicao, resposta) {
    const { id } = requisicao.params;

    try {
      const pessoa = await database.Pessoas.findOne({
        where: {
          id: Number(id),
        },
      });

      return resposta.status(200).json(pessoa);
    } catch (error) {
      return resposta.status(500).sjon(error.message);
    }
  }

  static async criaPessoa(requisicao, resposta) {
    const pessoa = requisicao.body;

    try {
      const pessoaCriada = await database.Pessoas.create(pessoa);

      return resposta.status(201).json(pessoaCriada);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async atualizaPessoa(requisicao, resposta) {
    const { id } = requisicao.params;
    const informacoes = requisicao.body;

    try {
      await database.Pessoas.update(informacoes, {
        where: {
          id: Number(id),
        },
      });

      const pessoaAtualizada = await database.Pessoas.findOne({
        where: {
          id: Number(id),
        },
      });

      return resposta.status(200).json(pessoaAtualizada);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async apagaPessoa(requisicao, resposta) {
    const { id } = requisicao.params;

    try {
      await database.Pessoas.destroy({
        where: {
          id: Number(id),
        },
      });

      return resposta.status(200).json({ mensagem: `id ${id} deletado` });
    } catch (error) {
      resposta.status(500).json(error.message);
    }
  }

  static async pegaUmaMatricula(requisicao, resposta) {
    const { estudanteId, matriculaId } = requisicao.params;

    try {
      const matricula = await database.Matriculas.findOne({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        },
      });

      return resposta.status(200).json(matricula);
    } catch (error) {
      return resposta.status(500).sjon(error.message);
    }
  }

  static async criaMatricula(requisicao, resposta) {
    const { estudanteId } = requisicao.params;
    const matricula = { ...requisicao.body, estudante_id: Number(estudanteId) };

    try {
      const matriculaCriada = await database.Matriculas.create(matricula);

      return resposta.status(201).json(matriculaCriada);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async atualizaMatricula(requisicao, resposta) {
    const { estudanteId, matriculaId } = requisicao.params;
    const informacoes = requisicao.body;

    try {
      await database.Matriculas.update(informacoes, {
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        },
      });

      const matriculaAtualizada = await database.Matriculas.findOne({
        where: {
          id: Number(matriculaId),
        },
      });

      return resposta.status(200).json(matriculaAtualizada);
    } catch (error) {
      return resposta.status(500).json(error.message);
    }
  }

  static async apagaMatricula(requisicao, resposta) {
    const { estudanteId, matriculaId } = requisicao.params;

    try {
      await database.Matriculas.destroy({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        },
      });

      return resposta
        .status(200)
        .json({ mensagem: `id ${matriculaId} deletado` });
    } catch (error) {
      resposta.status(500).json(error.message);
    }
  }
}

module.exports = PessoaController;
