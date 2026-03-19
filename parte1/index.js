function analisarNumeros(lista) {
  if (!Array.isArray(lista)) {
    throw new TypeError('A entrada precisa ser um array.');
  }

  let somaPares = 0;
  let somaImpares = 0;
  let qtdImpares = 0;

  for (const item of lista) {
    if (typeof item !== 'number' || Number.isNaN(item) || !Number.isInteger(item)) {
      continue;
    }

    if (item % 2 === 0) {
      somaPares += item;
    } else {
      somaImpares += item;
      qtdImpares += 1;
    }
  }

  return {
    somaPares,
    mediaImpares: qtdImpares > 0 ? somaImpares / qtdImpares : 0,
  };
}

// Exemplo de uso
const entrada = [1, 2, 3, 4, 5, 'a', null, undefined];
console.log(analisarNumeros(entrada));

module.exports = { analisarNumeros };
