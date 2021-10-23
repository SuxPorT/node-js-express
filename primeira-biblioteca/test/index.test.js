const { expect, it } = require("@jest/globals");
const pegaArquivo = require("../index");
const path = require("path");

const arrayResult = [
  {
    FileList: "https://developer.mozilla.org/pt-BR/docs/Web/API/FileList",
  },
];

describe("pegaArquivo::", () => {
  it("Deve ser uma função", () => {
    expect(typeof pegaArquivo).toBe("function");
  });

  it("Deve retornar array com resultados", async () => {
    const caminho = __dirname + "/arquivos/texto1.md";
    const resultado = await pegaArquivo(caminho);

    expect(resultado).toEqual(arrayResult);
  });

  it('Deve retornar mensagem "não há links"', async () => {
    const caminho = __dirname + "/arquivos/texto1_semlinks.md";
    const resultado = await pegaArquivo(caminho);

    expect(resultado).toBe("não há links");
  });

  it("Deve lançar um erro na falta de arquivo", () => {
    async function capturaErro() {
      const caminho = __dirname + "/arquivos/";
      await pegaArquivo(caminho);

      expect(capturaErro).toThrowError(/não há arquivo no caminho/);
    }
  });
});

test("deve ser uma função", () => {
  expect(typeof pegaArquivo).toBe("function");
});
