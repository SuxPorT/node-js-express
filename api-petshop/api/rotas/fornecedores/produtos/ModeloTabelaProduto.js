const Sequelize = require("sequelize");
const instancia = require("../../../banco-de-dados");

const colunas = {
  fornecedor: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require("../ModeloTabelaFornecedor"),
      key: "id",
    },
  },
  titulo: {
    type: Sequelize.STRING,
    alowNull: false,
  },
  preco: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  estoque: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
};

const opcoes = {
  freezeTableName: true,
  tableName: "produtos",
  timestamps: true,
  createdAt: "dataCriacao",
  updatedAt: "dataAtualizacao",
  version: "versao",
};

module.exports = instancia.define("produto", colunas, opcoes);
