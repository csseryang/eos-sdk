'use strict';

const EosSdk = require('../src/index.js');
const expect = require('chai').expect;

describe('Test Random key generation: ', function () {
    it('Key should be valid', function () {
        EosSdk.random_key((error, result) => {
            expect(result).to.be.a('string');
        });
    });

    it('Key transfer should be correct', function () {
        const pvk = '5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa';
        const puk = 'EOS6WRTBxUmngRjc5Nxjpt9WnCYLb4eBaLxvdqmofmcB2VT3g59dJ';
        EosSdk.pvk_to_puk(pvk, (error, result) => {
            expect(JSON.parse(result).publicKey).to.be.equal(puk);
        });
    });

    it('Sign should be correct', function () {
        const pvk = '5JSWcuJu9ECEXqk3BCYkuK98A8QnrVSZZfzudw6hD2rNrpfPSVa';
        const s = 'abcdefg';
        const sig = 'SIG_K1_JybL4Zh1gXGAiAN7a4y85m1DCZdK8w1XFRigafychYDChm7npdXDUtw1v783iNM69fmFSDj2GsFzZmskgSsBxVPkLmYGC8';
        EosSdk.sign(s, pvk, (error, result) => {
            expect(JSON.parse(result).signature).to.be.equal(sig);
        });
    });

    it('User info should be correct', function () {
        const user = 'cybchainsys1';
        EosSdk.get_account(user, (error, result) => {
            expect(JSON.parse(result).account.account_name).to.be.equal(user);
        });
    });

    it('Balance should be correct', function () {
        const user = 'cybchainsys1';
        EosSdk.get_balance(user, 'eosio.token', (error, result) => {
            expect(JSON.parse(result).balance[0].balance).to.be.contains('SYS');
        });
    });

    it('Transfer should success', function () {
        const user_a = 'g1fciq4auixg';
        const user_b = 'xzvbupxsbeam';
        const pk_a = '5KJH24PhJrWvQxugGfVYnbeiBEAbzKUpreDmHNfCi3EyPyAZfmP';
        EosSdk.transfer(user_a, user_b, '0.0001 SYS', '', pk_a, (error, result) => {
            expect(error).to.be.equal(null);
        });
    });

    const relation = EosSdk.relation('family111112').promisified();

    it('Test relation', async function () {
        this.timeout(5000000);

        const user_a = 'e4zrp3lxow3h';
        const pk_a = '5KckAqraw3PNGpkN12iTiNBC9hTgjtm9jifCp135baorvincXbr';

        const user_b = 'kjnz5u3yqbld';
        const pk_b = '5J846ZRnpmKJfJtm1tDxT98Y193ihmuAqiEitAfFuMry6YZ7p7k';

        const res = await relation.get_info_list([user_a, user_b]);
        console.log(res);

        try {
            await relation.register(user_a, 1, 'uri1', 'extra1', pk_a);
            await relation.register(user_b, 1, 'uri2', 'extra2', pk_b);

        } catch (e) {
            let r1 = await relation.get_info(user_a);
            // console.log(r1);

            let r2 = await relation.get_info(user_b);
            // console.log(r2);
        }

        try {
            let type = Math.floor(Math.random() * 2);
            let uri = Math.random().toString();
            let extra = Math.random().toString();

            await relation.set_type(user_a, type, pk_a);
            await relation.set_uri(user_a, uri, pk_a);
            await relation.set_extra(user_a, extra, pk_a);

            let result = await relation.get_info(user_a);

            // console.log(result);
            expect(JSON.parse(result).result[0].uri).to.be.equal(uri);
            expect(JSON.parse(result).result[0].type).to.be.equal(type);
            expect(JSON.parse(result).result[0].extra).to.be.equal(extra);
            console.log('update uri success');

        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            await relation.delete(user_a, user_b, pk_a);
        } catch (error) {
            console.log('relation starts from strangers');
        }

        try {
            let result = await relation.apply(user_a, user_b, pk_a);
            expect(result).to.be.not.equal(null);
            console.log('apply successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = await relation.get_apply(user_a);
            // console.log(result);
            expect(JSON.parse(result).result[0].applies).to.contains(user_b);
        } catch (error) {
            // console.log(error);
        }

        try {
            let result = await relation.get_pending(user_b);
            // console.log(result);
            expect(JSON.parse(result).result[0].pendings).to.contains(user_a);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = await relation.reject(user_b, user_a, pk_b);
            expect(result).to.be.not.equal(null);
            console.log('reject successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = await relation.get_apply(user_a);
            // console.log(result);
            expect(JSON.parse(result).result[0].applies).to.not.contains(user_b);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = await relation.get_pending(user_b);
            // console.log(result);
            expect(JSON.parse(result).result[0].pendings).to.not.contains(user_a);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = await relation.apply(user_a, user_b, pk_a);
            expect(result).to.be.not.equal(null);
            console.log('apply successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = await relation.accept(user_b, user_a, pk_b);
            expect(result).to.be.not.equal(null);
            console.log('accept successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = await relation.get_confirmed(user_a);
            // console.log(result);
            expect(JSON.parse(result).result[0].confirms).to.contains(user_b);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = await relation.get_confirmed(user_b);
            // console.log(result);
            expect(JSON.parse(result).result[0].confirms).to.contains(user_a);
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            // Send 3 messages
            await relation.send_message(user_a, user_b, 'hello1', pk_a);
            await relation.send_message(user_a, user_b, 'hello2', pk_a);
            await relation.send_message(user_a, user_b, 'hello3', pk_a);

            let outbox_content = await relation.get_outbox(user_a);
            let inbox_content = await relation.get_inbox(user_b);
            // console.log(outbox_content);
            // console.log(inbox_content);

            expect(JSON.parse(outbox_content).result[0].sendmsgs).to.be.not.empty;
            expect(JSON.parse(inbox_content).result[0].receivemsgs).to.be.not.empty;

            console.log('send message successful');

            // Delete the last message
            let out_id = JSON.parse(outbox_content).result[0].msgid;
            let in_id = JSON.parse(inbox_content).result[0].msgid;

            await relation.delete_out_message(user_a, out_id, pk_a);
            await relation.delete_in_message(user_b, in_id, pk_b);

            outbox_content = await relation.get_outbox(user_a);
            inbox_content = await relation.get_inbox(user_b);
            // console.log(outbox_content);
            // console.log(inbox_content);

            // expect(JSON.parse(outbox_content).result[0].sendmsgs).to.be.not.empty;
            // expect(JSON.parse(inbox_content).result[0].receivemsgs).to.be.not.empty;

            console.log('delete message successful');

            // Delete all messages
            out_id = JSON.parse(outbox_content).result[0].msgid;
            in_id = JSON.parse(inbox_content).result[0].msgid;

            await relation.delete_outbox(user_a, out_id, pk_a);
            await relation.delete_inbox(user_b, in_id, pk_b);

            outbox_content = await relation.get_outbox(user_a);
            inbox_content = await relation.get_inbox(user_b);

            expect(JSON.parse(outbox_content).result[0].sendmsgs).to.be.empty;
            expect(JSON.parse(inbox_content).result[0].receivemsgs).to.be.empty;
            console.log('delete box successful');

        } catch (error) {
            console.log(error);
            expect(error).to.be.equal(null);
        }
        try {
            let result = await relation.delete(user_a, user_b, pk_a);
            expect(result).to.be.not.equal(null);
            console.log('delete contact successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = await relation.get_confirmed(user_a);
            // console.log(result);
            expect(JSON.parse(result).result[0].confirms).to.not.contains(user_b);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = await relation.get_confirmed(user_b);
            // console.log(result);
            expect(JSON.parse(result).result[0].confirms).to.not.contains(user_a);
        } catch (error) {
            expect(error).to.be.equal(null);
        }

    });

    it('Test concurrency', async function () {
        this.timeout(5000000);

        const user_a = 'v3tvinwkueop';
        const pk_a = '5JPQoMWsvkoJ2xwW8ngfikVEJpBx4vnYH8s5eL6UKdYpdavwDVv';

        let users = {
            'ezinktpzywqy': '5K6wfQxLwCEPZkj82mwhYDq98tADKoCaiAo2wCBLK3tZCtG2V1u',
            '3mp5okrqkzh5': '5HsUryEvampY4ydxw3deZVG6TBfYNd8v9WhWJJ2R49Wm27FMbig',
            'czluipsldaqn': '5Hw3KvnRZtvDdEvRMntg7oYZq4MiU3q3Mqfspb4EcPtJg7s4Tsj',
            'fodrqvu4hrvc': '5Jgaiixf97p88HySqi7ZXz8AXpgXmUexL4Lzz6oiwPCYjxJ5yj8',
            '5quyg4k5xs3a': '5JycYV8EXNTrbCjbZ66xvVkksJyhc4sNFm45MZ5SjYmGgb1UA2S'
        };

        let keys = Object.keys(users);

        for (let key of keys) {
            try {
                await relation.register(key, 1, 'uri_' + key, 'extra_' + key, users[key]);
            } catch (e) {
                console.log('user ' + key + ' registered');
            }
        }

        for (let key of keys) {
            try {
                await relation.delete(user_a, key, users[key]);
            } catch (e) {
                console.log('user ' + key + ' is a friend of ' + user_a);
            }
        }

        for (let key of keys) {
            try {
                await relation.apply(key, user_a, users[key]);
            } catch (e) {
                console.log('user ' + key + ' applies to be friend with ' + user_a);
            }
        }

        for (let key of keys) {
            try {
                await relation.accept(user_a, key, pk_a);
            } catch (e) {
                console.log('user ' + key + ' is a friend of ' + user_a);
            }
        }

        // Send messages
        let tasks = [];
        for (let key of keys) {
            tasks.push(relation.send_message(key, user_a, 'hello', users[key]));
        }

        try {
            await Promise.all(tasks);
        } catch (e) {
            console.log(e);
        }

        let inbox_content = await relation.get_inbox(user_a);

        // console.log(inbox_content);
        for (let key of keys) {
            expect(inbox_content).to.be.contains(key);
        }

        let in_id = JSON.parse(inbox_content).result[0].msgid;
        await relation.delete_inbox(user_a, in_id, pk_a);

        for (let key of keys) {
            try {
                let outbox_content = await relation.get_outbox(key);
                // console.log(outbox_content);
                expect(outbox_content).to.be.contains(key);

                let out_id = JSON.parse(outbox_content).result[0].msgid;
                await relation.delete_outbox(key, out_id, users[key]);
            } catch (e) {
                console.log(e);
            }
        }

        console.log('send message successful');

        for (let key of keys) {
            try {
                await relation.delete(user_a, key, pk_a);
            } catch (e) {
                console.log(e);
            }
        }
    });

    it('Test group msg', async function () {
        this.timeout(5000000);

        const user_a = 'v3tvinwkueop';
        const pk_a = '5JPQoMWsvkoJ2xwW8ngfikVEJpBx4vnYH8s5eL6UKdYpdavwDVv';

        let users = {
            'ezinktpzywqy': '5K6wfQxLwCEPZkj82mwhYDq98tADKoCaiAo2wCBLK3tZCtG2V1u',
            '3mp5okrqkzh5': '5HsUryEvampY4ydxw3deZVG6TBfYNd8v9WhWJJ2R49Wm27FMbig',
            'czluipsldaqn': '5Hw3KvnRZtvDdEvRMntg7oYZq4MiU3q3Mqfspb4EcPtJg7s4Tsj',
            'fodrqvu4hrvc': '5Jgaiixf97p88HySqi7ZXz8AXpgXmUexL4Lzz6oiwPCYjxJ5yj8',
            '5quyg4k5xs3a': '5JycYV8EXNTrbCjbZ66xvVkksJyhc4sNFm45MZ5SjYmGgb1UA2S'
        };

        let keys = Object.keys(users);

        for (let key of keys) {
            try {
                await relation.register(key, 1, 'uri_' + key, 'extra_' + key, users[key]);
            } catch (e) {
                console.log('user ' + key + ' registered');
            }
        }

        for (let key of keys) {
            try {
                await relation.delete(user_a, key, users[key]);
            } catch (e) {
                console.log('user ' + key + ' is a friend of ' + user_a);
            }
        }

        for (let key of keys) {
            try {
                await relation.apply(key, user_a, users[key]);
            } catch (e) {
                console.log('user ' + key + ' applies to be friend with ' + user_a);
            }
        }


        for (let key of keys) {
            try {
                await relation.accept(user_a, key, pk_a);
            } catch (e) {
                console.log('user ' + key + ' is a friend of ' + user_a);
            }
        }

        // Send messages
        let tasks = [];
        for (let key of keys) {
            tasks.push(relation.send_message(user_a, key, 'hello', pk_a));
        }

        try {
            await Promise.all(tasks);
        } catch (e) {
            console.log(e);
        }

        let outbox_content = await relation.get_outbox(user_a);

        // console.log(outbox_content);
        for (let key of keys) {
            expect(outbox_content).to.be.contains(key);
        }

        let out_id = JSON.parse(outbox_content).result[0].msgid;
        await relation.delete_outbox(user_a, out_id, pk_a);

        for (let key of keys) {
            try {
                let inbox_content = await relation.get_inbox(key);
                // console.log(inbox_content);
                expect(inbox_content).to.be.contains(user_a);

                let in_id = JSON.parse(inbox_content).result[0].msgid;
                await relation.delete_inbox(key, in_id, users[key]);
            } catch (e) {
                console.log(e);
            }
        }

        console.log('send message successful');

        for (let key of keys) {
            try {
                await relation.delete(user_a, key, pk_a);
            } catch (e) {
                console.log(e);
            }
        }
    });


});