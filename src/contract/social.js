const utils = require('../utilities');

const read_table = utils.read_table;
const clog = utils.log;
const process = utils.process;

/**
 * Social contract class
 */
class Social {
    /**
     * Social contract class
     * @param {Eos} eos - eos client
     * @param {string} contract_name  - Contract owner account name
     *
     */
    constructor (eos, contract_name) {
        this.eos = eos;
        this.contract_name = contract_name;
    }

    /**
     * Get contract by abi
     * @returns {Promise<*>}
     */
    async contract () {
        return await this.eos.contract(this.contract_name);
    }

    /**
     * Follow someone
     * @param {string} from - account name
     * @param {string} to - target account name
     * @param {function} [callback]
     * @returns {Promise<*>}
     */
    async follow (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'addname': to
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.addfollow(param, option);
        return await process(call, callback);
    }

    /**
     * UnFollow someone
     * @param {string} from - account name
     * @param {string} to - target account name
     * @param {function} [callback]
     * @returns {Promise<*>}
     */
    async unfollow (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'deletename': to
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.deletefollow(param, option);
        return await process(call, callback);
    }

    /**
     * Remove follower
     * @param {string} from - account name
     * @param {string} to - target account name
     * @param {function} [callback]
     * @returns {Promise<*>}
     */
    async remove (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'deletename': to
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.delfollowing(param, option);
        return await process(call, callback);
    }

    /**
     * Get accounts that are following you
     * @param {string} name - account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<void>}
     */
    async get_following (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'follow');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Get accounts that you are following
     * @param {string} name - account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<void>}
     */
    async get_follower (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'following');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }
}

module.exports = Social;
