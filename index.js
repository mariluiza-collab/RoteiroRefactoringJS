const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }

  function calcularTotalApresentacao(apre) {
    const peca = getPeca(apre); // busca a peça aqui dentro
    let total = 0;
    switch (peca.tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) total += 1000 * (apre.audiencia - 30);
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) total += 10000 + 500 * (apre.audiencia - 20);
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
  }

  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    const pecaNome = getPeca(apre).nome; // usa a query diretamente
    const valor = calcularTotalApresentacao(apre); // sem "peca" como argumento
    faturaStr += `  ${pecaNome}: R$ ${(valor / 100).toFixed(2)} (${apre.audiencia} assentos)\n`;
  }

  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas   = JSON.parse(readFileSync('./pecas.json'));

const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
