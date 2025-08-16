const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }

  function calcularTotalApresentacao(apre) {
    const peca = getPeca(apre);
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

  function calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }

  function formatarMoeda(valorEmCentavos) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valorEmCentavos / 100);
  }

  let totalFatura = 0;
  let creditosTotais = 0;

  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    const valor = calcularTotalApresentacao(apre);
    totalFatura += valor;
    creditosTotais += calcularCredito(apre);

    faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(valor)} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${creditosTotais} \n`;

  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas   = JSON.parse(readFileSync('./pecas.json'));

const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
