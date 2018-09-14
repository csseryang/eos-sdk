const utils = require('../utilities');

const read_table = utils.read_table;
const clog = utils.log;
const parse_big_int = utils.parse_bigint;
const process = utils.process;

/**
 * Story contract class
 */
class Story {
    /**
     * Story contract class
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
     * Post story
     * @param {string} name - Account name
     * @param {string} msg - Message
     * @param {string} uri - URI
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<*>}
     */
    async post (name, msg, uri, callback = clog) {
        let contract = await this._contract();
        const param = {
            'name': name,
            'msg': msg,
            'uri': uri
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.create(param, option);
        return await process(call, callback);
    }

    /**
     * Delete a story
     * @param {string} name - Account name
     * @param {string} id - Message id
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<*>}
     */
    async delete (name, id, callback = clog) {
        let contract = await this._contract();
        const param = {
            'name': name,
            'id': parse_big_int(id)
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.burn(param, option);
        return await process(call, callback);
    }

    /**
     * Transfer a story
     * @param {string} from - sender account name
     * @param {string} to - receiver account name
     * @param {string} id - Message id
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<*>}
     */
    async transfer (from, to, id, callback = clog) {
        let contract = await this._contract();
        const param = {
            'from': from,
            'to': to,
            'id': parse_big_int(id)
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.transfer(param, option);
        return await process(call, callback);
    }

    /**
     * Get one's post list
     * @param {string} name - Poster's account name
     * @param {function} [callback] - Callback to execute (Optional)
     * @returns {Promise<*>}
     */
    async get_posts (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'token');
        return await process(call, callback);
    }
}

module.exports = Story;
