const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  // função auxiliar pedida na etapa 1
  function calcularTotalApresentacao(apre, peca) {
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

  // aqui montamos a string de saída
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    const peca = pecas[apre.id];
    faturaStr += `  ${peca.nome}: R$ ${(calcularTotalApresentacao(apre, peca)/100).toFixed(2)} (${apre.audiencia} assentos)\n`;
  }

  return faturaStr;
}

// leitura dos arquivos JSON
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas   = JSON.parse(readFileSync('./pecas.json'));

// gera e imprime
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
