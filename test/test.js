"use strict";
const EosSdk = require('../src/index.js');
const expect = require('chai').expect;

describe('Test Random key generation: ', function () {
    it('Key should be valid', function () {
        EosSdk.random_key((error, result) => {
            expect(result).to.be.a('string');
        })
    });

    it('Key transfer should be correct', function () {
        const pvk = "5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa";
        const puk = "EOS6WRTBxUmngRjc5Nxjpt9WnCYLb4eBaLxvdqmofmcB2VT3g59dJ";
        EosSdk.pvk_to_puk(pvk, (error, result) => {
            expect(JSON.parse(result).publicKey).to.be.equal(puk);
        });
    });

    it('Sign should be correct', function () {
        const pvk = "5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa";
        const s = "abcdefg";
        const sig = "SIG_K1_JybL4Zh1gXGAiAN7a4y85m1DCZdK8w1XFRigafychYDChm7npdXDUtw1v783iNM69fmFSDj2GsFzZmskgSsBxVPkLmYGC8";
        EosSdk.sign(s, pvk, (error, result) => {
            expect(JSON.parse(result).signature).to.be.equal(sig);
        });
    });

    it('User info should be correct', function () {
        const user = "cybchainsys1";
        EosSdk.get_account(user, (error, result) => {
            expect(JSON.parse(result).account.account_name).to.be.equal(user);
        });
    });

    it('Balance should be correct', function () {
        const user = "cybchainsys1";
        EosSdk.get_balance(user, 'eosio.token', (error, result) => {
            expect(JSON.parse(result).balance[0].balance).to.be.contains("SYS");
        });
    });

    // const user_a = "g1fciq4auixg";
    // const pk_a = '5KJH24PhJrWvQxugGfVYnbeiBEAbzKUpreDmHNfCi3EyPyAZfmP';
    // const user_b = "xzvbupxsbeam";
    // const pk_b = '5JA8ghMZ8gNpoFre8CqFjbLS2rQtynpjCGueAH6RXz7SC5MTrRk';
    // const relation = EosSdk.relation('cybchain');
    //
    // it('Test relation: apply', function () {
    //     relation.apply(user_a, user_b, pk_a, (error, result) => {
    //         expect(JSON.parse(error)).to.be.equal(null);
    //
    //         it('Test relation: get apply and pending info', function () {
    //             relation.get_apply(user_a, (error, result) => {
    //                 expect(JSON.parse(result).result[0].applies).to.contains(user_b);
    //             });
    //         });
    //
    //         it('Test relation: get apply and pending info', function () {
    //             relation.get_pending(user_a, (error, result) => {
    //                 expect(JSON.parse(result).result[0].pendings).to.contains(user_b);
    //             });
    //         });
    //
    //         it('Test relation: get apply and pending info', function () {
    //             relation.get_apply(user_b, (error, result) => {
    //                 expect(JSON.parse(result).result[0].pendings).to.contains(user_a);
    //             });
    //         });
    //
    //         it('Test relation: get apply and pending info', function () {
    //             relation.get_pending(user_b, (error, result) => {
    //                 expect(JSON.parse(result).result[0].pendings).to.contains(user_a);
    //             });
    //         });
    //
    //         it('Test relation: get apply and pending info', function () {
    //             relation.get_relation(user_a, (error, result) => {
    //                 expect(JSON.parse(result).result[0].pendings).to.not.contains(user_a);
    //             });
    //         });
    //
    //         it('Test relation: get apply and pending info', function () {
    //             relation.get_relation(user_b, (error, result) => {
    //                 expect(JSON.parse(result).result[0].pendings).to.not.contains(user_a);
    //             });
    //         });
    //     });
    // });
    //
    // it('Test relation: reject', function () {
    //     relation.reject(user_b, user_a, pk_b, (error, result) => {
    //         expect(JSON.parse(error)).to.be.equal(null);
    //     });
    // });

    //
    // it('Test relation: delete', function () {
    //     relation.delete(user_b, user_a, pk_b, (error, result) => {
    //         console.log(error);
    //         expect(JSON.parse(error)).to.be.equal(null);
    //     });
    // });

    // it('Test relation: apply', function () {
    //     relation.apply(user_a, user_b, pk_a, (error, result) => {
    //         expect(JSON.parse(error)).to.be.equal(null);
    //     });
    // });
    //
    // it('Test relation: accept', function () {
    //     relation.accept(user_b, user_a, pk_b, (error, result) => {
    //         expect(JSON.parse(error)).to.be.equal(null);
    //     });
    // });
    //
    // it('Test relation: get_apply', function () {
    //     relation.get_apply(user_a, (error, result) => {
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].applies).to.not.contains(user_b);
    //     });
    // });
    //
    // it('Test relation: get_pending', function () {
    //     relation.get_pending(user_b, (error, result) => {
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].pendings).to.not.contains(user_a);
    //     });
    // });
    //
    // it('Test relation: get_relation', function () {
    //     relation.get_apply(user_a, (error, result) => {
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].relations).to.be.contains(user_b);
    //     });
    // });
    //
    // it('Test relation: get_relation', function () {
    //     relation.get_pending(user_b, (error, result) => {
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].pendings).to.be.contains(user_a);
    //     });
    // });
});