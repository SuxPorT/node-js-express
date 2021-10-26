const moment = require("moment");
const axios = require("axios");
const repositorio = require("../repositorios/atendimento");

class Atendimento {
  constructor() {
    this.dataEhValida = ({ data, dataCriacao }) =>
      moment(dataCriacao).isSameOrAfter(data);
    this.clienteEhValido = (tamanho) => tamanho >= 5;

    this.valida = (parametros) =>
      this.validacoes.filter((campo) => {
        const { nome } = campo;
        const parametro = parametros[nome];

        return campo.valido(parametro);
      });

    this.validacoes = [
      {
        nome: "data",
        valido: this.dataEhValida,
        mensagem: "Data deve ser maior ou igual a data atual",
      },
      {
        nome: "cliente",
        valido: this.clienteEhValido,
        mensagem: "Cliente deve ter pelo menos cinco caracteres",
      },
    ];
  }

  async adiciona(atendimento) {
    const dataCriacao = moment().format("YYYY-MM-DD HH:mm:mm");
    const data = moment(atendimento.data, "DD/MM/YYYY").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    const parametros = {
      data: { data, dataCriacao },
      cliente: { tamanho: atendimento.cliente.length },
    };

    const erros = this.valida(parametros);
    const existemErros = erros.length;

    if (existemErros) {
      return new Promise((_resolve, reject) => reject(erros));
    } else {
      const atendimentoDatado = { ...atendimento, dataCriacao, data };

      return repositorio.adiciona(atendimentoDatado).then((resultados) => {
        const id = resultados.insertId;

        return { id, ...atendimento };
      });
    }
  }

  async lista() {
    return repositorio.lista();
  }

  async buscaPorId(id) {
    return repositorio.buscaPorId(id).then(async (resultados) => {
      const atendimento = resultados[0];
      const cpf = atendimento.cliente;
      const { data } = await axios.get(`http://localhost:8082/${cpf}`);

      atendimento.cliente = data;

      return atendimento;
    });
  }

  async altera(id, valores) {
    if (valores.data) {
      valores.data = moment(valores.data, "DD/MM/YYYY").format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }

    return repositorio.altera(id, valores);
  }

  async deleta(id) {
    return repositorio.deleta(id);
  }
}

module.exports = new Atendimento();
