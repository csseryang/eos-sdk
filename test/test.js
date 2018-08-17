"use strict";
const eos_ecc = require('../src/index.js');
const expect = require('chai').expect;

describe('Test Random key generation: ', function () {
    it('Key should be valid', function () {
        eos_ecc.random_key((error, result) => {
            expect(result).to.be.a('string');
        })
    });

    it('Key transfer should be correct', function () {
        const pvk = "5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa";
        const puk = "EOS6WRTBxUmngRjc5Nxjpt9WnCYLb4eBaLxvdqmofmcB2VT3g59dJ";
        eos_ecc.pvk_to_puk(pvk, result => {
            expect(JSON.parse(result).publicKey).to.be.equal(puk);
        });

    });
});