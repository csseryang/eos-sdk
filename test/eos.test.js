/* eslint-disable no-unused-expressions */
'use strict';

const EosSdk = require('../src/index.js');
const expect = require('chai').expect;

let chain_id = '0cab93bc5577841792732d919fb0f0afdde744af8be98403975a5d6320c3c347';
let end_point = 'http://52.8.73.95:8000';

let users = {
    'v3tvinwkueop': '5JPQoMWsvkoJ2xwW8ngfikVEJpBx4vnYH8s5eL6UKdYpdavwDVv',
    'ezinktpzywqy': '5K6wfQxLwCEPZkj82mwhYDq98tADKoCaiAo2wCBLK3tZCtG2V1u',
    '3mp5okrqkzh5': '5HsUryEvampY4ydxw3deZVG6TBfYNd8v9WhWJJ2R49Wm27FMbig',
    'czluipsldaqn': '5Hw3KvnRZtvDdEvRMntg7oYZq4MiU3q3Mqfspb4EcPtJg7s4Tsj',
    'fodrqvu4hrvc': '5Jgaiixf97p88HySqi7ZXz8AXpgXmUexL4Lzz6oiwPCYjxJ5yj8',
    '5quyg4k5xs3a': '5JycYV8EXNTrbCjbZ66xvVkksJyhc4sNFm45MZ5SjYmGgb1UA2S'
};

describe('Test Basic Operations: ', function () {
    this.timeout(5000000);
    it('Get chain info', async function () {
        try {
            let result = JSON.parse(await EosSdk.utils.get_chain_info(end_point, null));
            expect(result.result.chain_id).to.be.equal(chain_id);
        } catch (e) {
            console.error(e);
            expect(e).to.be.equal(null);
        }
    });

    it('User info should be correct', async function () {
        const user = 'cybchainsys1';
        try {
            let result = JSON.parse(await EosSdk.use(end_point, chain_id).get_account(user, null));
            expect(result.result.account_name).to.be.equal(user);
        } catch (e) {
            console.error(e);
            expect(e).to.be.equal(null);
        }
    });

    it('Balance should be correct', async function () {
        const user = 'cybchainsys1';
        try {
            let result = JSON.parse(await EosSdk.use(end_point, chain_id).get_balance(user, 'eosio.token', null));
            expect(result.result[0].balance).to.be.contains('SYS');
        } catch (e) {
            console.error(e);
            expect(e).to.be.equal(null);
        }
    });

    it('Account history be correct', async function () {
        const user = 'v3tvinwkueop';
        const puk = 'EOS8dpp5DqkF4zoHdadUhfYP8zadVZHYSn96wq1e6qLkWm6zu92Qj';
        try {
            let result = JSON.parse(await EosSdk.use(end_point, chain_id).get_key_accounts(puk, null));
            expect(result.result.account_names).to.be.contains(user);
        } catch (e) {
            console.error(e);
            expect(e).to.be.equal(null);
        }
    });

    it('Transfer should success', async function () {
        const user_a = Object.keys(users)[0];
        const pk_a = users[user_a];
        const user_b = Object.keys(users)[1];
        try {
            let result = await EosSdk.use(end_point, chain_id, pk_a).transfer(user_a, user_b, '0.0001 SYS', '', null);
            expect(result).to.be.not.equal(null);
        } catch (e) {
            console.log(e);
            expect(e).to.be.equal(null);
        }
    });
});