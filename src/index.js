'use strict';

require('babel-polyfill');
require('util.promisify').shim();

const ecc = require('eosjs-ecc');
const _log = require('./utilities').log;
const client = require('./client');
const Relation = require('./contract/relation');


/**
 * Generate random private key/ public key pair
 * @param {function} [callback] - Callback to execute (Optional)
 */
async function random_key (callback = _log) {
    let rand_key = ecc.randomKey();
    if (callback === undefined) {
        return rand_key;
    }
    try {
        let pvk = await rand_key;
        const puk = ecc.privateToPublic(pvk);
        callback(null, JSON.stringify({'privateKey': pvk, 'publicKey': puk}));
    } catch (error) {
        callback(JSON.stringify({'error': error.message || error}));
    }
}


/**
 * Generate public key from private key
 * @param pvk {string} - Private key
 * @param [callback] {function} - Callback to execute (Optional)
 */
function pvk_to_puk (pvk, callback = _log) {
    const puk = ecc.privateToPublic(pvk);
    try {
        callback(null, JSON.stringify({'publicKey': puk}));
    } catch (error) {
        callback(JSON.stringify({'error': error.message || error}));
    }
}


/**
 * Using privateKey to sign any input string
 * @param s {string} Input string
 * @param pvk {string} Private key
 * @param [callback] {function} - Callback to execute (Optional)
 */
function sign (s, pvk, callback = _log) {
    try {
        const signature = ecc.sign(s, pvk);
        callback(null, JSON.stringify({'signature': signature}));
    } catch (error) {
        callback(JSON.stringify({'error': error.message || error}));
    }
}


/**
 * EOS Client
 */
class Client {
    constructor (end_point, chain_id, pvk) {
        this.client = client(end_point, chain_id, pvk);
    }

    /**
     * Get the original EOS client with previous settings
     */
    get_client () {
        return this.client;
    }

    /**
     *
     * @param name
     * @param code
     * @param table
     * @param callback
     * @returns {Promise<*>}
     * @private
     */
    async read_table (name, code, table, callback) {
        const eos = this.client;
        let call = eos.getTableRows({
            'scope': name,
            'code': code,
            'table': table,
            'json': true
        });

        if (callback === undefined) {
            return call;

        } else {
            try {
                let balance = await call();
                callback(null, JSON.stringify({'result': balance.rows}));
            } catch (error) {
                callback(JSON.stringify({'error': error.message || error}));
            }
        }
    }

    /**
     * Get account information from EOS
     * @param {string} name  Account name
     * @param {function} [callback]  - Callback to execute (Optional)
     */
    async get_account (name, callback = _log) {
        const eos = this.client;
        let call = eos.getAccount(name);
        if (callback === null) {
            return call;
        }
        try {
            let result = await call;
            callback(null, JSON.stringify({'account': result}));
        } catch (e) {
            callback(JSON.stringify({'error': e.message || e}));
        }
    }

    /**
     *
     * @param {string} name  - Account name as index
     * @param {string} [code] - Contract account name (Optional)
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_balance (name, code = 'eosio.token', callback = _log) {
        let call = this.read_table(name, code, 'accounts', undefined);
        if (callback === null) {
            return call;
        }
        try {
            let balance = await call;
            callback(null, JSON.stringify({'balance': balance.rows}));
        } catch (e) {
            callback(JSON.stringify({'error': e.message || e}));
        }
    }

    /**
     * Get account names by public key
     * @param puk {string} - Public key
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_key_accounts (puk, callback = _log) {
        const eos = this.client;
        let call = eos.getKeyAccounts(puk);
        if (callback === null) {
            return call;
        }
        try {
            let names = await call;
            callback(null, JSON.stringify({'names': names}));
        } catch (e) {
            callback(JSON.stringify({'error': e.message || e}));
        }
    }

    /**
     * get currency info by symbol
     * @param symbol {string} - Currency symbol. e.g. SYS
     * @param [code] {string} - Contract owner name (Optional)
     * @param [callback] {function} - Callback to execute (Optional)
     */
    async get_currency_stats (symbol, code = 'eosio.token', callback = _log) {
        const eos = this.client;
        let call = eos.getCurrencyStats(code, symbol);
        if (callback === null) {
            return call;
        }
        try {
            let stats = await call;
            callback(null, JSON.stringify({'stats': stats}));
        } catch (e) {
            callback(JSON.stringify({'error': e.message || e}));
        }
    }

    /**
     * Transfer currency from one account to another
     * @param {string} from - account name
     * @param {string} to - recipient account name
     * @param {string} amount - amount to transfer. must have the same decimal places as token's supply/max_supply. e.g. SYS's max_supply = 10000.0000, then '1.0000 SYS' is legal while '1 SYS' is illegal
     * @param {string} memo - memo
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async transfer (from, to, amount, memo, callback = _log) {
        const eos = this.client;
        let call = eos.transfer(from, to, amount, memo);
        if (callback === null) {
            return call;
        }

        try {
            let result = await call;
            callback(null, {'result': result});
        } catch (e) {
            callback(JSON.stringify({'error': e.message || e}));
        }
    }

    relation (name) {
        return new Relation(this, name);
    }
}

function use (end_point, chain_id, pvk) {
    return new Client(end_point, chain_id, pvk);
}

module.exports = {
    random_key,
    pvk_to_puk,
    sign,
    use,
};
