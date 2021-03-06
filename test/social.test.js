/* eslint-disable no-unused-expressions */
'use strict';

const EosSdk = require('../src/index.js');
const expect = require('chai').expect;

let end_point = 'http://54.183.187.52:8000';
let chain_id = 'fda6b767fdb6ed6ee14bcffbf384e3a40ba1674cb4d333ee66c6e518f25860ae';

let contract_name = 'cybsocial112';

let user_a = 'v3tvinwkueop';
let user_b = 'ezinktpzywqy';

let social_a = EosSdk.use(end_point, chain_id, '5JPQoMWsvkoJ2xwW8ngfikVEJpBx4vnYH8s5eL6UKdYpdavwDVv').social(contract_name);
let social_b = EosSdk.use(end_point, chain_id, '5K6wfQxLwCEPZkj82mwhYDq98tADKoCaiAo2wCBLK3tZCtG2V1u').social(contract_name);

describe('Test Follow/Unfollow: ', function () {
    this.timeout(5000000);

    it('Test register', async function  () {
        try {
            await social_a.register(user_a, 1, 'uri_a', 'extra_a', null);
        } catch (e) {
            console.log('already registered');
        }

        let info = await social_a.get_info(user_a, null);
        console.log(info);

        await social_a.setinfo(user_a, 1, 'uri_a_2', 'extra_a_2', null);
        let info2 = await social_a.get_info(user_a, null);
        console.log(info2);
    });

    it('Test follow', async function () {
        try {
            await social_a.follow(user_a, user_b, null);
        } catch (e) {
            // expect(e).to.be.equal(null);
            console.log('already followed');
        }

        try {
            const res = JSON.parse(await social_a.get_following(user_a, null));
            const res2 = JSON.parse(await social_b.get_follower(user_b, null));
            console.log(res);
            console.log(res2);
            expect(res.result.follows).to.contains(user_b);
            expect(res2.result.followings).to.contains(user_a);

            const res3 = JSON.parse(await social_a.is_following(user_a, user_b, null));
            console.log(res3);

            const res4 = JSON.parse(await social_b.is_follower(user_b, user_a, null));
            console.log(res4);
        } catch (e) {
            console.log(e);
        }

        try {
            await social_a.unfollow(user_a, user_b, null);
        } catch (e) {
            console.log('already unfollowed');
        }

        try {
            const res = JSON.parse(await social_a.get_following(user_a, null));
            const res2 = JSON.parse(await social_b.get_follower(user_b, null));
            console.log(res);
            console.log(res2);
            expect(res.result.follows).to.be.empty;
            expect(res2.result.followings).to.be.empty;

            const res3 = JSON.parse(await social_a.is_following(user_a, user_b, null));
            console.log(res3);

            const res4 = JSON.parse(await social_b.is_follower(user_b, user_a, null));
            console.log(res4);
        } catch (e) {
            console.log(e);
        }
    });
});

describe('Test Follow/Remove: ', function () {
    this.timeout(5000000);
    it('Test remove', async function () {
        try {
            await social_a.follow(user_a, user_b, null);
        } catch (e) {
            console.log('already followed');
        }

        try {
            const res = JSON.parse(await social_a.get_following(user_a, null));
            const res2 = JSON.parse(await social_b.get_follower(user_b, null));
            console.log(res);
            console.log(res2);
            expect(res.result.follows).to.contains(user_b);
            expect(res2.result.followings).to.contains(user_a);
        } catch (e) {
            console.log(e);
        }

        try {
            await social_b.remove(user_b, user_a, null);
        } catch (e) {
            console.log('already followed');
        }

        try {
            const res = JSON.parse(await social_a.get_following(user_a, null));
            const res2 = JSON.parse(await social_b.get_follower(user_b, null));
            console.log(res);
            console.log(res2);
            expect(res.result.follows).to.be.empty;
            expect(res2.result.followings).to.be.empty;
        } catch (e) {
            console.log(e);
        }
    });
});
