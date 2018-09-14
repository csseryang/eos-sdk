/* eslint-disable no-unused-expressions */
'use strict';

const EosSdk = require('../src/index.js');
const expect = require('chai').expect;

describe('Test ECC functions: ', function () {
    it('Key should be valid', function () {
        EosSdk.ecc.random_key((error, result) => {
            expect(error).to.be.equal(null);
            expect(result).to.be.a('string');
        });
    });

    it('Key transfer should be correct', function () {
        const pvk = '5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa';
        const puk = 'EOS6WRTBxUmngRjc5Nxjpt9WnCYLb4eBaLxvdqmofmcB2VT3g59dJ';
        EosSdk.ecc.pvk_to_puk(pvk, (error, result) => {
            expect(error).to.be.equal(null);
            expect(JSON.parse(result).publicKey).to.be.equal(puk);
        });
    });

    it('Sign should be correct', function () {
        const pvk = '5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa';
        const s = 'abcdefg';
        const sig = 'SIG_K1_JybL4Zh1gXGAiAN7a4y85m1DCZdK8w1XFRigafychYDChm7npdXDUtw1v783iNM69fmFSDj2GsFzZmskgSsBxVPkLmYGC8';
        EosSdk.ecc.sign(s, pvk, (error, result) => {
            expect(error).to.be.equal(null);
            expect(JSON.parse(result).signature).to.be.equal(sig);
        });
    });
});
