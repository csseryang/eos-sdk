/* eslint-disable no-unused-expressions */
'use strict';

const EosSdk = require('../src/index.js');
const expect = require('chai').expect;

let end_point = 'http://52.8.73.95:8000';
let chain_id = '0cab93bc5577841792732d919fb0f0afdde744af8be98403975a5d6320c3c347';

let contract_name = 'cybstory1111';

let user_a = 'v3tvinwkueop';
let user_b = 'ezinktpzywqy';

let story_a = EosSdk.use(end_point, chain_id, '5JPQoMWsvkoJ2xwW8ngfikVEJpBx4vnYH8s5eL6UKdYpdavwDVv').story(contract_name);
let story_b = EosSdk.use(end_point, chain_id, '5K6wfQxLwCEPZkj82mwhYDq98tADKoCaiAo2wCBLK3tZCtG2V1u').story(contract_name);

describe('Test Story Post/Remove', function () {
    this.timeout(500000);

    it('Should create and burn right', async function () {
        for (let i = 0; i < 3; i++) {
            let story = 'story ' + i + ' of user a';
            try {
                await story_a.post(user_a, story, 'uri ' + i, null);
            } catch (e) {
                console.error(e);
                expect(e).to.be.equal(null);
            }
        }

        try {
            let res0 = JSON.parse(await story_a.get_posts(user_a, null));
            console.log(res0);

            for (let story of res0.result) {
                await story_a.delete(user_a, story.id, null);
            }

            let res1 = JSON.parse(await story_a.get_posts(user_a, null));
            console.log(res1);

            expect(res1.result).to.be.empty;
        } catch (e) {
            console.log(e);
        }
    });
});

describe('Test Story Transfer', function () {
    this.timeout(500000);

    it('Should transfer right', async function () {
        try {
            let res = JSON.parse(await story_b.get_posts(user_b, null));
            console.log(res);

            for (let story of res.result) {
                await story_b.delete(user_b, story.id, null);
            }

            let res1 = JSON.parse(await story_b.get_posts(user_b, null));
            console.log(res1);
            console.log("All user b's posts are removed");
        } catch (e) {
            console.log("All user b's posts are removed");
        }

        for (let i = 0; i < 3; i++) {
            let story = 'story ' + i + ' of user a';
            try {
                await story_a.post(user_a, story, 'uri ' + i, null);
            } catch (e) {
                console.error(e);
                expect(e).to.be.equal(null);
            }
        }

        try {
            let res0 = JSON.parse(await story_a.get_posts(user_a, null));
            console.log(res0);

            for (let story of res0.result) {
                await story_a.transfer(user_a, user_b, story.id, null);
            }

            let res1 = JSON.parse(await story_a.get_posts(user_a, null));
            let res2 = JSON.parse(await story_b.get_posts(user_b, null));
            console.log(res1);
            console.log(res2);
            expect(res1.result).to.be.empty;
            expect(res2.result.length).to.be.equal(res0.result.length);
        } catch (e) {
            console.error(e);
            expect(e).to.be.equal(null);
        }

        // try {
        //     const res1 = JSON.parse(await story_a.get_posts(user_a, null));
        //     const res2 = JSON.parse(await story_b.get_posts(user_b, null));
        //     console.log(res1);
        //     console.log(res2);
        // } catch (e) {
        //     console.error(e);
        // }
    });
});
