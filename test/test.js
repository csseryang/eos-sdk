"use strict";
const eos_sdk = require('../src/index.js');
const expect = require('chai').expect;

describe('Test Random key generation: ', function () {
    it('Key should be valid', function () {
        eos_sdk.random_key((error, result) => {
            expect(result).to.be.a('string');
        })
    });

    it('Key transfer should be correct', function () {
        const pvk = "5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa";
        const puk = "EOS6WRTBxUmngRjc5Nxjpt9WnCYLb4eBaLxvdqmofmcB2VT3g59dJ";
        eos_sdk.pvk_to_puk(pvk, (error, result) => {
            expect(JSON.parse(result).publicKey).to.be.equal(puk);
        });
    });

    it('Sign should be correct', function () {
        const pvk = "5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa";
        const s = "abcdefg";
        const sig = "SIG_K1_JybL4Zh1gXGAiAN7a4y85m1DCZdK8w1XFRigafychYDChm7npdXDUtw1v783iNM69fmFSDj2GsFzZmskgSsBxVPkLmYGC8";
        eos_sdk.sign(s, pvk, (error, result) => {
            expect(JSON.parse(result).signature).to.be.equal(sig);
        });
    });

    it('User info should be correct', function () {
        const user = "cybchainsys1";
        eos_sdk.get_account(user, (error, result) => {
            expect(JSON.parse(result).account.account_name).to.be.equal(user);
        });
    });

    it('Balance should be correct', function () {
        const user = "cybchainsys1";
        eos_sdk.get_balance(user, 'eosio.token',  (error, result) => {
            expect(JSON.parse(result).balance[0].balance).to.be.contains("SYS");
        });
    });
});