'use strict';

const EosSdk = require('../src/index.js');
const expect = require('chai').expect;
const bigInt = require("big-integer");

describe('Test Random key generation: ', function () {
    it('Key should be valid', function () {
        EosSdk.random_key((error, result) => {
            expect(result).to.be.a('string');
        });
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

    it('Transfer should success', function () {
        const user_a = "g1fciq4auixg";
        const user_b = "xzvbupxsbeam";
        const pk_a = '5KJH24PhJrWvQxugGfVYnbeiBEAbzKUpreDmHNfCi3EyPyAZfmP';
        EosSdk.transfer(user_a, user_b, '0.0001 SYS', '', pk_a, (error, result) => {
            expect(error).to.be.equal(null);
        });
    });

    // const relation = EosSdk.relation('dating111111').promisified();
    //
    // it('Test relation', async function () {
    //     this.timeout(5000000);
    //
    //     const user_a = "w25nw1hbutpm";
    //     const pk_a = '5KX6bssCsfgrPX3vrHqnbg87dKZzAiQhL5crq8a9nnk4RPj8PKd';
    //
    //     const user_b = "xnswwo4fpqnz";
    //     const pk_b = '5KSXtJtNTxtGLr4VZ98kaQo5bgQNYed3Z7aNqHFMPDvJrsukMoF';
    //
    //     // const user_a = "12345tester4";
    //     // const pk_a = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
    //     //
    //     // const user_b = "12345tester5";
    //     // const pk_b = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
    //
    //     try {
    //         await relation.register(user_a, 1, 'uri1', 'extra1', pk_a);
    //         await relation.register(user_b, 1, 'uri2', 'extra2', pk_b);
    //
    //
    //     } catch (e) {
    //         console.error(e);
    //         let r1 = await relation.get_info(user_a);
    //         console.log(r1);
    //
    //         let r2 = await relation.get_info(user_b);
    //         console.log(r2);
    //
    //     }
    //
    //     try {
    //         let type = Math.floor(Math.random() * 2);
    //         let uri = Math.random().toString();
    //         let extra = Math.random().toString();
    //
    //         await relation.set_type(user_a, type, pk_a);
    //         await relation.set_uri(user_a, uri, pk_a);
    //         await relation.set_extra(user_a, extra, pk_a);
    //
    //         let result = await relation.get_info(user_a);
    //
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].uri).to.be.equal(uri);
    //         expect(JSON.parse(result).result[0].type).to.be.equal(type);
    //         expect(JSON.parse(result).result[0].extra).to.be.equal(extra);
    //         console.log("update uri success");
    //
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    //     try {
    //         await relation.delete(user_a, user_b, pk_a);
    //     } catch (error) {
    //         console.log("relation starts from strangers")
    //     }
    //
    //     try {
    //         let result = await relation.apply(user_a, user_b, pk_a);
    //         expect(result).to.be.not.equal(null);
    //         console.log('apply successful');
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    //     try {
    //         let result = await relation.get_apply(user_a);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].applies).to.contains(user_b);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    //     try {
    //         let result = await relation.get_pending(user_b);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].pendings).to.contains(user_a);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    //     try {
    //         let result = await relation.reject(user_b, user_a, pk_b);
    //         expect(result).to.be.not.equal(null);
    //         console.log('reject successful');
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    //     try {
    //         let result = await relation.get_apply(user_a);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].applies).to.not.contains(user_b);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    //     try {
    //         let result = await relation.get_pending(user_b);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].pendings).to.not.contains(user_a);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    //     try {
    //         let result = await relation.apply(user_a, user_b, pk_a);
    //         expect(result).to.be.not.equal(null);
    //         console.log('apply successful');
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    //     try {
    //         let result = await relation.accept(user_b, user_a, pk_b);
    //         expect(result).to.be.not.equal(null);
    //         console.log('accept successful');
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    //     try {
    //         let result = await relation.get_confirmed(user_a);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].confirms).to.contains(user_b);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    //     try {
    //         let result = await relation.get_confirmed(user_b);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].confirms).to.contains(user_a);
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    //     try {
    //         await relation.send_message(user_a, user_b, 'hello', pk_a);
    //
    //         let outbox_content = await relation.get_outbox(user_a);
    //         let inbox_content = await relation.get_inbox(user_b);
    //
    //         console.log(outbox_content);
    //         console.log(inbox_content);
    //         expect(JSON.parse(outbox_content).result[0].sendmsgs).to.be.not.empty;
    //         expect(JSON.parse(inbox_content).result[0].receivemsgs).to.be.not.empty;
    //         console.log('send message successful');
    //
    //         let out_id = JSON.parse(outbox_content).result[0].msgid.substring(2);
    //         const r = out_id.match(/../g).reverse().join('');
    //         const out_max = bigInt(r, 16).toString(10);
    //
    //         let in_id = JSON.parse(inbox_content).result[0].msgid.substring(2);
    //         const r2 = in_id.match(/../g).reverse().join('');
    //         const in_max = bigInt(r2, 16).toString(10);
    //
    //         await relation.delete_outbox(user_a, out_max, pk_a);
    //         await relation.delete_inbox(user_b, in_max, pk_b);
    //
    //         outbox_content = await relation.get_outbox(user_a);
    //         inbox_content = await relation.get_inbox(user_b);
    //         console.log(outbox_content);
    //         console.log(inbox_content);
    //
    //         expect(JSON.parse(outbox_content).result[0].sendmsgs).to.be.empty;
    //         expect(JSON.parse(inbox_content).result[0].receivemsgs).to.be.empty;
    //         console.log('delete message successful');
    //
    //     } catch (error) {
    //         console.log(error);
    //         expect(error).to.be.equal(null);
    //     }
    //     try {
    //         let result = await relation.delete(user_a, user_b, pk_a);
    //         expect(result).to.be.not.equal(null);
    //         console.log('delete contact successful');
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    //     try {
    //         let result = await relation.get_confirmed(user_a);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].confirms).to.not.contains(user_b);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    //     try {
    //         let result = await relation.get_confirmed(user_b);
    //         console.log(result);
    //         expect(JSON.parse(result).result[0].confirms).to.not.contains(user_a);
    //     } catch (error) {
    //         expect(error).to.be.equal(null);
    //     }
    //
    // });
});