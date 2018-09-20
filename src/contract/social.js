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
     * @param {Eos} eos - Eos client
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
     * @private
     */
    async _contract () {
        return await this.eos.contract(this.contract_name);
    }

    /**
     * Register new user in contract
     * @param {string} name - Account name
     * @param {number} id - Account ID
     * @param {string} uri - User's external info uri
     * @param {string} extra - User's data
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<string>}
     */
    async register (name, id, uri, extra, callback = clog) {
        let contract = await this._contract();
        const param = {
            'name': name,
            'id': id,
            'uri': uri,
            'extra': extra
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.createobj(param, option);
        return await process(call, callback);
    }

    /**
     * Register new user in contract
     * @param {string} name - Account name
     * @param {string} id - Account ID
     * @param {string} uri - User's external info uri
     * @param {string} extra - User's data
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<string>}
     */
    async setinfo (name, id, uri, extra, callback = clog) {
        let contract = await this._contract();
        const param = {
            'name': name,
            'id': id,
            'uri': uri,
            'extra': extra
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.setinfo(param, option);
        return await process(call, callback);
    }

    /**
     * Get user info
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_info (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'info');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Follow someone
     * @param {string} from - Account name
     * @param {string} to - Target account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<string>}
     */
    async follow (from, to, callback = clog) {
        let contract = await this._contract();
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
     * @param {string} from - Account name
     * @param {string} to - Target account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<string>}
     */
    async unfollow (from, to, callback = clog) {
        let contract = await this._contract();
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
     * @param {string} from - Account name
     * @param {string} to - Target account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<string>}
     */
    async remove (from, to, callback = clog) {
        let contract = await this._contract();
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
     * @param {string} name - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<string>}
     */
    async get_following (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'follow');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Get accounts that you are following
     * @param {string} name - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<string>}
     */
    async get_follower (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'following');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Check if user is following target
     * @param {string} name - Account name
     * @param {string} target - Target account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<*>}
     */
    async is_following (name, target, callback = clog) {
        try {
            let following = await read_table(this.eos, name, this.contract_name, 'follow');
            let ret = JSON.stringify({'result': following[0].follows.includes(target)});
            if (!callback) {
                return Promise.resolve(ret);
            } else {
                callback(null, ret);
            }
        } catch (e) {
            let error = JSON.stringify({'result': false});
            if (!callback) {
                return Promise.reject(error);
            } else {
                callback(null, error);
            }
        }
    }

    /**
     * Check if target is a follower
     * @param {string} name - Account name
     * @param {string} target - Target account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<*>}
     */
    async is_follower (name, target, callback = clog) {
        try {
            let follower = await read_table(this.eos, name, this.contract_name, 'following');
            let ret = JSON.stringify({'result': follower[0].followings.includes(target)});
            if (!callback) {
                return Promise.resolve(ret);
            } else {
                callback(null, ret);
            }
        } catch (e) {
            let error = JSON.stringify({'result': false});
            if (!callback) {
                return Promise.reject(error);
            } else {
                callback(null, error);
            }
        }
    }
}

module.exports = Social;
