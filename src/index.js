'use strict';

require('babel-polyfill');
const util = require('util');
require('util.promisify').shim();
const Eos = require('eosjs');
const ecc = require('eosjs-ecc');
const settings = require('./config');
const bigInt = require('big-integer');

const config = settings.config;

// private helper function for appending private key to config
// not for external use
function _config (pvk) {
    const cfg = Object.assign({}, config);
    if (pvk !== undefined) {
        cfg.sign = true;
        cfg.keyProvider = [pvk];
    }
    return cfg;
}

function _log (error, result) {
    if (result !== undefined) {
        console.log(result);
    } else {
        console.log(error);
    }
}

function _parse_bigint (id) {
    if (typeof id === 'number') {
        return id;
    }

    if (id.startsWith('0x')) {
        id = id.substring(2);
    }
    const r = id.match(/../g).reverse().join('');
    return bigInt(r, 16).toString(10);
}

async function _read_table (name, code, table, callback) {
    const eos = eos_client();
    let read_table = eos.getTableRows({
        'scope': name,
        'code': code,
        'table': table,
        'json': true
    });

    if (callback === undefined) {
        return read_table;
    } else {
        read_table.then(balance => {
            callback(null, JSON.stringify({'result': balance.rows}));
        }).catch(error => {
            callback(JSON.stringify({'error': error.message || error}));
        });
    }
}

/**
 * JavaScript helper library for mobile platforms
 * @module EosSdk
 */

/**
 * Generate random private key/ public key pair
 * @param {function} [callback] - Callback to execute (Optional)
 */
function random_key (callback = _log) {
    ecc.randomKey().then(pvk => {
        const puk = ecc.privateToPublic(pvk);
        callback(null, JSON.stringify({'privateKey': pvk, 'publicKey': puk}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
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
 * Get account information from EOS
 * @param name {string} Account name
 * @param [callback] {function} - Callback to execute (Optional)
 */
function get_account (name, callback = _log) {
    const eos = eos_client();
    eos.getAccount(name).then(result => {
        callback(null, JSON.stringify({'account': result}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

/**
 *
 * @param name {string} - Account name as index
 * @param [code] {string}- Contract account name (Optional)
 * @param [callback] {function} - Callback to execute (Optional)
 */
function get_balance (name, code = 'eosio.token', callback = _log) {
    const eos = eos_client();
    eos.getTableRows({
        'scope': name,
        'code': code,
        'table': 'accounts',
        'json': true
    }).then(balance => {
        callback(null, JSON.stringify({'balance': balance.rows}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

/**
 * Get account names by public key
 * @param puk {string} - Public key
 * @param {function} [callback] - Callback to execute (Optional)
 */
function get_key_accounts (puk, callback = _log) {
    const eos = eos_client();
    eos.getKeyAccounts(puk).then(names => {
        callback(null, JSON.stringify({'names': names}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

/**
 * get currency info by symbol
 * @param symbol {string} - Currency symbol. e.g. SYS
 * @param [code] {string} - Contract owner name (Optional)
 * @param [callback] {function} - Callback to execute (Optional)
 */
function get_currency_stats (symbol, code = 'eosio.token', callback = _log) {
    const eos = eos_client();
    eos.getCurrencyStats(code, symbol).then(stats => {
        callback(null, JSON.stringify({'stats': stats}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

/**
 * Transfer currency from one account to another
 * @param {string} from - account name
 * @param {string} to - recipient account name
 * @param {string} amount - amount to transfer. must have the same decimal places as token's supply/max_supply. e.g. SYS's max_supply = 10000.0000, then '1.0000 SYS' is legal while '1 SYS' is illegal
 * @param {string} memo - memo
 * @param {string} pvk - private key
 * @param {function} [callback] - Callback to execute (Optional)
 */
function transfer (from, to, amount, memo, pvk, callback = _log) {
    const eos = eos_client(pvk);
    eos.transfer(from, to, amount, memo).then(result => {
        callback(null, {'result': result});
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

function relation (name) {
    return new Relation(name);
}

/**
 * Relation contract class
 */
class Relation {
    /**
     *
     * @param name {string} - Contract owner account name
     */
    constructor (name) {
        this.name = name;
    }

    promisified () {
        let fnNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        fnNames.forEach((fnName) => {
            this[fnName] = util.promisify(this[fnName]);
        });
        return this;
    }

    /**
     * Register new user in contract
     * @param name {string} - Account name
     * @param type {number} - User type as sex
     * @param uri {string} - User's external info uri
     * @param extra {string} - User's data
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    register (name, type, uri, extra, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'type': type,
                    'uri': uri,
                    'extra': extra
                };

                const option = {
                    'authorization': [name + `@active`]
                };
                return contract.createobj(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Update uri
     * @param name {string} - Account name
     * @param uri {string} - New uri
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    set_uri (name, uri, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'newuri': uri
                };
                const option = {
                    'authorization': [name + `@active`]
                };

                return contract.seturi(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Update type
     * @param name {string} - Account name
     * @param type {number} - New type
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    set_type (name, type, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'newtype': type
                };
                const option = {
                    'authorization': [name + `@active`]
                };

                return contract.settype(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Update data
     * @param name {string} - Account name
     * @param extra {string} - User's data
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    set_extra (name, extra, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'newextra': extra
                };
                const option = {
                    'authorization': [name + `@active`]
                };

                return contract.setextra(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Send request to another account
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    apply (from, to, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': from,
                    'apply': to
                };
                const option = {
                    'authorization': [from + `@active`]
                };

                return contract.apply(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Accept an incoming request
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    accept (from, to, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': from,
                    'addname': to
                };
                const option = {
                    'authorization': [from + `@active`]
                };

                return contract.addname(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Reject an incoming request
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    reject (from, to, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': from,
                    'rejectname': to
                };
                const option = {
                    'authorization': [from + `@active`]
                };
                return contract.rejectname(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Cancel an outgoing request
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    cancel (from, to, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': from,
                    'cancel': to
                };
                const option = {
                    'authorization': [from + `@active`]
                };

                return contract.cancel(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Delete a relation
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete (from, to, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': from,
                    'deletename': to
                };
                const option = {
                    'authorization': [from + `@active`]
                };

                return contract.deletename(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Send a message
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param message {string} - Message to send
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    send_message (from, to, message, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': from,
                    'receiver': to,
                    'message': message
                };
                const option = {
                    'authorization': [from + `@active`]
                };

                return contract.sendmessage(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Send a message
     * @param from {string} - Account name
     * @param targets {array} - Recipient names
     * @param message {string} - Message to send
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async send_group_message (from, targets, message, pvk, callback = _log) {
        const eos = eos_client(pvk);
        const contract = await eos.contract(this.name);

        let todo = [];
        for (let to of targets) {
            const param = {
                'name': from,
                'receiver': to,
                'message': message
            };
            const option = {
                'authorization': [from + `@active`]
            };
            todo.push(contract.sendmessage(param, option));
        }

        try {
            let result = await Promise.all(todo);
            callback(null, {'result': result});
        } catch (error) {
            callback(JSON.stringify({'error': error.message || error}));
        }
    }

    /**
     * Delete all message before id in InBox
     * @param name {string} - Account name
     * @param id {string/number} - Max message id to delete
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_inbox (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': _parse_bigint(id)
                };
                const option = {
                    'authorization': [name + `@active`]
                };

                return contract.deleteinbox(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Delete all message before id in OutBox
     * @param name {string} - Account name
     * @param id {string/number} Max message id to delete
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_outbox (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': _parse_bigint(id)
                };
                const option = {
                    'authorization': [name + `@active`]
                };

                return contract.deleteoutbox(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Delete one message by id in InBox
     * @param name {string} - Account name
     * @param id {string} Message id to delete
     * @param pvk {string} - Private key. Must match with name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_in_message (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': _parse_bigint(id)
                };
                const option = {
                    'authorization': [name + `@active`]
                };

                return contract.deleteinmsg(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Delete one message by id in OutBox
     * @param name {string} - Account name
     * @param id {string/number} Message id to delete
     * @param pvk {string} - Private key. Must match with name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_out_message (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': _parse_bigint(id)
                };
                const option = {
                    'authorization': [name + `@active`]
                };

                return contract.deleteoutmsg(param, option);
            })
            .then(result => {
                callback(null, {'result': result});
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }

    /**
     * Get user info
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_info (name, callback = _log) {
        _read_table(name, this.name, 'info', callback);
    }

    /**
     * Get user info by an array of account names
     * @param account_names {array} - Account names
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_info_list (account_names, callback = _log) {
        let todo = [];
        for (let name of account_names) {
            todo.push(_read_table(name, this.name, 'info'));
        }

        try {
            let results = await Promise.all(todo);
            console.log(JSON.stringify(results));
            let processed = results.map(x => x.rows[0]).concat();
            callback(null, JSON.stringify({'result': processed}));
        } catch (error) {
            callback(JSON.stringify({'error': error.message || error}));
        }
    }

    /**
     * Get outgoing request list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_apply (name, callback = _log) {
        _read_table(name, this.name, 'apply', callback);
    }

    /**
     * Get incoming request list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_pending (name, callback = _log) {
        _read_table(name, this.name, 'pending', callback);
    }

    /**
     * Get confirmed contacts list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_confirmed (name, callback = _log) {
        _read_table(name, this.name, 'confirm', callback);
    }

    /**
     * Get incoming messages
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_inbox (name, callback = _log) {
        _read_table(name, this.name, 'inbox', callback);
    }

    /**
     * Get outgoing messages
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_outbox (name, callback = _log) {
        _read_table(name, this.name, 'outbox', callback);
    }
}

function eos_client (pk) {
    return Eos(_config(pk));
}

module.exports = {
    random_key,
    pvk_to_puk,
    sign,
    get_account,
    get_balance,
    get_key_accounts,
    get_currency_stats,
    transfer,
    relation,
    client: eos_client
};
