'use strict';

require('babel-polyfill');
const Eos = require('eosjs');
const ecc = require('eosjs-ecc');
const settings = require('./config');
const util = require('util');

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

function log (error, result) {
    if (result !== undefined) {
        console.log(result);
    } else {
        console.log(error);
    }
}

// Generate random private key/ public key pair
function random_key (callback = log) {
    ecc.randomKey().then(pvk => {
        const puk = ecc.privateToPublic(pvk);
        callback(null, JSON.stringify({'privateKey': pvk, 'publicKey': puk}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

// Generate public key from private key
function pvk_to_puk (pvk, callback = log) {
    const puk = ecc.privateToPublic(pvk);
    try {
        callback(null, JSON.stringify({'publicKey': puk}));
    } catch (error) {
        callback(JSON.stringify({'error': error.message || error}));
    }
}

// Using privateKey to sign any input string
function sign (s, pvk, callback = log) {
    try {
        const signature = ecc.sign(s, pvk);
        callback(null, JSON.stringify({'signature': signature}));
    } catch (error) {
        callback(JSON.stringify({'error': error.message || error}));
    }
}

// Get account information from EOS
function get_account (name, callback = log) {
    const eos = Eos(_config());
    eos.getAccount(name).then(result => {
        callback(null, JSON.stringify({'account': result}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

// Get account balance from contract issuer
// code is smart contract name
// e.g. getBalance('mhwb3kzafoxg')
function get_balance (name, code = 'eosio.token', callback = log) {
    const eos = Eos(_config());
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

// Get account names by public key
// e.g. getKeyAccounts('EOS5FxA3PnsnUu1prJRuqFKDXuQFZkEDjC3XudPUhfxfwooSfDYdr')
function get_key_accounts (puk, callback = log) {
    const eos = Eos(_config());
    eos.getKeyAccounts(puk).then(names => {
        callback(null, JSON.stringify({'names': names}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

// get currency info by symbol
// code is smart contract name
// e.g. getCurrencyStats('SYS')
function get_currency_stats (symbol, code = 'eosio.token', callback = log) {
    const eos = Eos(_config());
    eos.getCurrencyStats(code, symbol).then(stats => {
        callback(null, JSON.stringify({'stats': stats}));
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

function _promised (instance, func) {
    let mins = instance;
    let my_func = func.bind(mins);

    function get_promise (args) {
        return util.promisify(my_func)(args);
    }

    return get_promise;
}

// Transfer currency from one account to another
// Amount must have the same decimal places as token's supply/max_supply.
// e.g. SYS's max_supply = 10000.0000, then '1.0000 SYS' is legal while '1 SYS' is illegal
// Get token info by function get_token_info()
// e.g. transfer('from_user', 'to_user', '3.1415 EZPT', 'sample memo', private_key')
function transfer (from, to, amount, memo, pvk, callback = log) {
    const eos = Eos(_config(pvk));
    eos.transfer(from, to, amount, memo).then(result => {
        callback(null, {'result': result});
    }).catch(error => {
        callback(JSON.stringify({'error': error.message || error}));
    });
}

class Relation {
    constructor (name) {
        this.name = name;
    }

    register (name, type, icon, uri, pvk, callback = log) {
        const eos = Eos(_config(pvk));
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'type': type,
                    'icon': icon,
                    'uri': uri
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

    apply (name, apply, pvk, callback = log) {
        const eos = Eos(_config(pvk));
        eos.contract(this.name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'apply': apply
                };
                const option = {
                    'authorization': [name + `@active`]
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

    accept (from, to, pvk, callback = log) {
        const eos = Eos(_config(pvk));
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

    reject (from, to, pvk, callback = log) {
        const eos = Eos(_config(pvk));
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

    cancel (from, to, pvk, callback = log) {
        const eos = Eos(_config(pvk));
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

    delete (from, to, pvk, callback = log) {
        const eos = Eos(_config(pvk));
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

    get_apply (name, callback = log) {
        const eos = Eos(_config());
        eos.getTableRows({
            'scope': name,
            'code': this.name,
            'table': 'apply',
            'json': true
        }).then(balance => {
            callback(null, JSON.stringify({'result': balance.rows}));
        }).catch(error => {
            callback(JSON.stringify({'error': error.message || error}));
        });
    }

    get_pending (name, callback = log) {
        const eos = Eos(_config());
        eos.getTableRows({
            'scope': name,
            'code': this.name,
            'table': 'pending',
            'json': true
        }).then(balance => {
            callback(null, JSON.stringify({'result': balance.rows}));
        }).catch(error => {
            callback(JSON.stringify({'error': error.message || error}));
        });
    }

    get_relation (name, callback = log) {
        const eos = Eos(_config());
        eos.getTableRows({
            'scope': name,
            'code': this.name,
            'table': 'object',
            'json': true
        }).then(balance => {
            callback(null, JSON.stringify({'result': balance.rows}));
        }).catch(error => {
            callback(JSON.stringify({'error': error.message || error}));
        });
    }

    get_info_list (account_names, callback = log) {
        Promise.all(account_names.map(_promised(this, this.get_relation)))
            .then((results) => {
                let processed = results.map(x => JSON.parse(x).result[0]).map(x => {
                    return {name: x.name, uri: x.uri};
                }).concat();
                callback(null, JSON.stringify({'result': processed}));
            })
            .catch(error => {
                callback(JSON.stringify({'error': error.message || error}));
            });
    }
}

function relation (name) {
    return new Relation(name);
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
    relation
};
