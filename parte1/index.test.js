const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { analisarNumeros } = require('./index');

describe('analisarNumeros', () => {
  it('soma pares e calcula média dos ímpares', () => {
    const { somaPares, mediaImpares } = analisarNumeros([1, 2, 3, 4, 5]);
    assert.equal(somaPares, 6);
    assert.equal(mediaImpares, 3);
  });

  it('retorna zeros para lista vazia', () => {
    const { somaPares, mediaImpares } = analisarNumeros([]);
    assert.equal(somaPares, 0);
    assert.equal(mediaImpares, 0);
  });

  it('lança TypeError para entradas não-array', () => {
    for (const entrada of [42, 'texto', null, undefined]) {
      assert.throws(() => analisarNumeros(entrada), TypeError);
    }
  });
});
