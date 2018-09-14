/**
 * JavaScript helper library for mobile platforms
 * @module EosSdk
 */

'use strict';

require('babel-polyfill');
require('util.promisify').shim();

const Relation = require('./contract/relation');
const client = require('./client');
const utils = require('./utilities');
const ecc = require('./ecc');

const clog = utils.log;
const read_table = utils.read_table;
const process = utils.process;


/**
 * EOS Client
 */
class Use {
    constructor (end_point, chain_id, pvk) {
        this.eos = client(end_point, chain_id, pvk);
    }

    /**
     * Get account information from EOS
     * @param {string} name  Account name
     * @param {function} [callback]  - Callback to execute (Optional)
     */
    async get_account (name, callback = clog) {
        let call = this.eos.getAccount(name);
        return await process(call, callback);
    }

    /**
     * Get account balance
     * @param {string} name  - Account name as index
     * @param {string} [code] - Contract account name (Optional)
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_balance (name, code = 'eosio.token', callback = clog) {
        let table = 'accounts';
        let call = read_table(this.eos, name, code, table);
        return await process(call, callback);
    }

    /**
     * Get account names by public key
     * @param puk {string} - Public key
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_key_accounts (puk, callback = clog) {
        let call = this.eos.getKeyAccounts(puk);
        return await process(call, callback);
    }

    /**
     * get currency info by symbol
     * @param symbol {string} - Currency symbol. e.g. SYS
     * @param [code] {string} - Contract owner name (Optional)
     * @param [callback] {function} - Callback to execute (Optional)
     */
    async get_currency_stats (symbol, code = 'eosio.token', callback = clog) {
        let call = this.eos.getCurrencyStats(code, symbol);
        return await process(call, callback);
    }

    /**
     * Transfer currency from one account to another
     * @param {string} from - account name
     * @param {string} to - recipient account name
     * @param {string} amount - amount to transfer. must have the same decimal places as token's supply/max_supply. e.g. SYS's max_supply = 10000.0000, then '1.0000 SYS' is legal while '1 SYS' is illegal
     * @param {string} memo - memo
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async transfer (from, to, amount, memo, callback = clog) {
        let call = this.eos.transfer(from, to, amount, memo);
        return await process(call, callback);
    }

    /**
     *  Get Relation contract
     * @param {string} name - relation contract name
     * @returns {Relation}
     */
    relation (name) {
        return new Relation(this.eos, name);
    }
}

/**
 * Get client with configuration
 * @param end_point
 * @param chain_id
 * @param pvk
 * @returns {Use}
 */
function use (end_point, chain_id, pvk) {
    return new Use(end_point, chain_id, pvk);
}

module.exports = {
    use,
    ecc,
    utils,
};
