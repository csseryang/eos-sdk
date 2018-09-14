/* eslint-disable no-unused-expressions */
'use strict';

const EosSdk = require('../src/index.js');
const expect = require('chai').expect;

let end_point = 'http://52.8.73.95:8000';
let chain_id = '0cab93bc5577841792732d919fb0f0afdde744af8be98403975a5d6320c3c347';

let contract_name = 'family111111';

let users = {
    '3mp5okrqkzh5': '5HsUryEvampY4ydxw3deZVG6TBfYNd8v9WhWJJ2R49Wm27FMbig',
    'czluipsldaqn': '5Hw3KvnRZtvDdEvRMntg7oYZq4MiU3q3Mqfspb4EcPtJg7s4Tsj',
    'fodrqvu4hrvc': '5Jgaiixf97p88HySqi7ZXz8AXpgXmUexL4Lzz6oiwPCYjxJ5yj8',
    '5quyg4k5xs3a': '5JycYV8EXNTrbCjbZ66xvVkksJyhc4sNFm45MZ5SjYmGgb1UA2S'
};

let testers = Object.keys(users);
let relations = [];

for (let name of testers) {
    let pvk = users[name];
    let client = EosSdk.use(end_point, chain_id, pvk).relation(contract_name);
    relations.push(client);
}

describe('Test Relation Contract: ', function () {
    this.timeout(5000000);

    it('Test relation', async function () {
        const res = await relations[0].get_info_list(testers, null);
        console.log(res);

        let user_a = 'v3tvinwkueop';
        let user_b = 'ezinktpzywqy';
        let relation_a = EosSdk.use(end_point, chain_id, '5JPQoMWsvkoJ2xwW8ngfikVEJpBx4vnYH8s5eL6UKdYpdavwDVv').relation(contract_name);
        let relation_b = EosSdk.use(end_point, chain_id, '5K6wfQxLwCEPZkj82mwhYDq98tADKoCaiAo2wCBLK3tZCtG2V1u').relation(contract_name);

        try {
            let [type, uri, extra] = [Math.floor(Math.random() * 2), Math.random().toString(), Math.random().toString()];

            await relation_a.set_type(user_a, type, null);
            await relation_a.set_uri(user_a, uri, null);
            await relation_a.set_extra(user_a, extra, null);

            let result = JSON.parse(await relation_a.get_info(user_a, null));
            console.log(result);
            expect(result.result.uri).to.be.equal(uri);
            expect(result.result.type).to.be.equal(type);
            expect(result.result.extra).to.be.equal(extra);
            console.log('update uri success');
        } catch (error) {
            console.error(error);
            expect(error).to.be.equal(null);
        }

        try {
            await relation_a.delete(user_a, user_b, null);
        } catch (error) {
            console.log('relation starts from strangers');
        }

        try {
            await relation_b.reject(user_b, user_a);
        } catch (error) {
            console.log('relation starts from rejection');
        }

        try {
            let result = await relation_a.apply(user_a, user_b, null);
            expect(result).to.be.not.equal(null);
            console.log('apply successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = JSON.parse(await relation_a.get_apply(user_a, null));
            console.log(result);
            expect(result.result.applies).to.contains(user_b);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = JSON.parse(await relation_a.get_pending(user_b, null));
            console.log(result);
            expect(result.result.pendings).to.contains(user_a);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = await relation_b.reject(user_b, user_a, null);
            expect(result).to.be.not.equal(null);
            console.log('reject successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = JSON.parse(await relation_a.get_apply(user_a, null));
            console.log(result);
            expect(result.result.applies).to.not.contains(user_b);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = JSON.parse(await relation_b.get_pending(user_b, null));
            console.log(result);
            expect(result.result.pendings).to.not.contains(user_a);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = await relation_a.apply(user_a, user_b, null);
            expect(result).to.be.not.equal(null);
            console.log('apply successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = await relation_b.accept(user_b, user_a, null);
            expect(result).to.be.not.equal(null);
            console.log('accept successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = JSON.parse(await relation_a.get_confirmed(user_a, null));
            console.log(result);
            expect(result.result.confirms).to.contains(user_b);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = JSON.parse(await relation_b.get_confirmed(user_b, null));
            console.log(result);
            expect(result.result.confirms).to.contains(user_a);
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            // Send 3 messages
            await relation_a.send_message(user_a, user_b, 'hello1', null);
            await relation_a.send_message(user_a, user_b, 'hello2', null);
            await relation_a.send_message(user_a, user_b, 'hello3', null);

            let outbox_content = JSON.parse(await relation_a.get_outbox(user_a, null));
            let inbox_content = JSON.parse(await relation_b.get_inbox(user_b, null));

            let out_messages = JSON.parse(outbox_content.result.sendmsgs);
            let in_messages = JSON.parse(inbox_content.result.receivemsgs);

            console.log(out_messages);
            console.log(in_messages);

            expect(out_messages).to.be.not.empty;
            expect(in_messages).to.be.not.empty;

            console.log('send message successful');

            // // Delete the last message
            // let out_id = out_messages[out_messages.length - 1].id;
            // let in_id = in_messages[in_messages.length - 1].id;
            //
            // await relation_a.delete_out_message(user_a, out_id, null);
            // await relation_b.delete_in_message(user_b, in_id, null);
            //
            // outbox_content = JSON.parse(await relation_a.get_outbox(user_a, null));
            // inbox_content = JSON.parse(await relation_b.get_inbox(user_b, null));
            //
            // console.log(outbox_content);
            // console.log(inbox_content);
            //
            // expect(outbox_content.result.sendmsgs).to.be.not.empty;
            // expect(inbox_content.result.receivemsgs).to.be.not.empty;
            //
            // console.log('delete message successful');

            // Delete all messages
            out_messages = JSON.parse(outbox_content.result.sendmsgs);
            in_messages = JSON.parse(inbox_content.result.receivemsgs);

            console.log(out_messages);
            console.log(in_messages);

            let out_id = out_messages[out_messages.length - 1].id;
            let in_id = in_messages[in_messages.length - 1].id;

            await relation_a.delete_outbox(user_a, out_id, null);
            await relation_b.delete_inbox(user_b, in_id, null);

            outbox_content = JSON.parse(await relation_a.get_outbox(user_a, null));
            inbox_content = JSON.parse(await relation_b.get_inbox(user_b, null));

            console.log(outbox_content);
            console.log(inbox_content);

            expect(outbox_content.result.sendmsgs).to.be.equal('[]');
            expect(inbox_content.result.receivemsgs).to.be.equal('[]');
            console.log('delete box successful');
        } catch (error) {
            console.log(error);
            expect(error).to.be.equal(null);
        }
        try {
            let result = await relation_a.delete(user_a, user_b, null);
            expect(result).to.be.not.equal(null);
            console.log('delete contact successful');
        } catch (error) {
            expect(error).to.be.equal(null);
        }

        try {
            let result = JSON.parse(await relation_a.get_confirmed(user_a, null));
            // console.log(result);
            expect(result.result.confirms).to.not.contains(user_b);
        } catch (error) {
            console.log(error);
        }

        try {
            let result = JSON.parse(await relation_b.get_confirmed(user_b, null));
            // console.log(result);
            expect(result.result.confirms).to.not.contains(user_a);
        } catch (error) {
            expect(error).to.be.equal(null);
        }
    });
});

// describe('', function () {
//     it('Test concurrency', async function () {
//         this.timeout(5000000);
//         let keys = Object.keys(users);
//
//         for (let key of keys) {
//             try {
//                 await relation.register(key, 1, 'uri_' + key, 'extra_' + key, users[key]);
//             } catch (e) {
//                 console.log('user ' + key + ' registered');
//             }
//         }
//
//         for (let key of keys) {
//             try {
//                 await relation.delete(user_a, key, users[key]);
//             } catch (e) {
//                 console.log('user ' + key + ' is a friend of ' + user_a);
//             }
//         }
//
//         for (let key of keys) {
//             try {
//                 await relation.apply(key, user_a, users[key]);
//             } catch (e) {
//                 console.log('user ' + key + ' applies to be friend with ' + user_a);
//             }
//         }
//
//         for (let key of keys) {
//             try {
//                 await relation.accept(user_a, key, pk_a);
//             } catch (e) {
//                 console.log('user ' + key + ' is a friend of ' + user_a);
//             }
//         }
//
//         // Send messages
//         let tasks = [];
//         for (let key of keys) {
//             tasks.push(relation.send_message(key, user_a, 'hello', users[key]));
//         }
//
//         try {
//             await Promise.all(tasks);
//         } catch (e) {
//             console.log(e);
//         }
//
//         let inbox_content = await relation.get_inbox(user_a);
//
//         // console.log(inbox_content);
//         for (let key of keys) {
//             expect(inbox_content).to.be.contains(key);
//         }
//
//         let in_id = JSON.parse(inbox_content).result[0].msgid;
//         await relation.delete_inbox(user_a, in_id, pk_a);
//
//         for (let key of keys) {
//             try {
//                 let outbox_content = await relation.get_outbox(key);
//                 // console.log(outbox_content);
//                 expect(outbox_content).to.be.contains(key);
//
//                 let out_id = JSON.parse(outbox_content).result[0].msgid;
//                 await relation.delete_outbox(key, out_id, users[key]);
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//
//         console.log('send message successful');
//
//         for (let key of keys) {
//             try {
//                 await relation.delete(user_a, key, pk_a);
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//     });
// });

// describe('Test Group Message', async function () {
//     this.timeout(5000000);
//
//     let user_a = '3mp5okrqkzh5';
//     let relation_a = EosSdk.use(end_point, chain_id, '5HsUryEvampY4ydxw3deZVG6TBfYNd8v9WhWJJ2R49Wm27FMbig').relation(contract_name);
//
//     let users = {
//         'czluipsldaqn': '5Hw3KvnRZtvDdEvRMntg7oYZq4MiU3q3Mqfspb4EcPtJg7s4Tsj',
//         'fodrqvu4hrvc': '5Jgaiixf97p88HySqi7ZXz8AXpgXmUexL4Lzz6oiwPCYjxJ5yj8',
//         '5quyg4k5xs3a': '5JycYV8EXNTrbCjbZ66xvVkksJyhc4sNFm45MZ5SjYmGgb1UA2S'
//     };
//
//     let relations = {};
//
//     for (let name of Object.keys(users)) {
//         let pvk = users[name];
//         relations[name] = EosSdk.use(end_point, chain_id, pvk).relation(contract_name);
//     }
//
//     it('Test group msg', async function () {
//         let keys = Object.keys(relations);
//
//         for (let key of keys) {
//             try {
//                 await relations[key].register(key, 1, 'uri_' + key, 'extra_' + key, null);
//             } catch (e) {
//                 console.log('user ' + key + ' registered');
//             }
//         }
//
//         for (let key of keys) {
//             try {
//                 await relation_a.delete(user_a, key, null);
//             } catch (e) {
//                 console.log('user ' + key + ' is a friend of ' + user_a);
//             }
//         }
//
//         for (let key of keys) {
//             try {
//                 await relation_a.apply(key, user_a, null);
//             } catch (e) {
//                 console.log('user ' + key + ' applies to be friend with ' + user_a);
//             }
//         }
//
//         for (let key of keys) {
//             try {
//                 await relation_a.accept(user_a, key, null);
//             } catch (e) {
//                 console.log('user ' + key + ' is a friend of ' + user_a);
//             }
//         }
//
//         await relation_a.send_group_message(user_a, keys, 'hello', null);
//
//         let outbox_content = await relation_a.get_outbox(user_a, null);
//         console.log(outbox_content);
//
//         for (let key of keys) {
//             expect(outbox_content).to.be.contains(key);
//         }
//
//         let out_id = JSON.parse(outbox_content).result[0].msgid;
//         await relation_a.delete_outbox(user_a, out_id, null);
//
//         for (let key of keys) {
//             try {
//                 let inbox_content = await relations[key].get_inbox(key, null);
//                 console.log(inbox_content);
//                 expect(inbox_content).to.be.contains(user_a);
//
//                 let in_id = JSON.parse(inbox_content).result[0].msgid;
//                 await relations[key].delete_inbox(key, in_id, null);
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//
//         console.log('send message successful');
//
//         for (let key of keys) {
//             try {
//                 await relation_a.delete(user_a, key, null);
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//     });
// });
