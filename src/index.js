'use strict';

const Eos = require('eosjs');
const ecc = require('eosjs-ecc');
const settings = require('./config');
require('babel-polyfill');

const config = settings.config;

function log(error, result) {
    if (result !== undefined) {
        console.log(result);
    } else {
        console.log(error);
    }
}

// Generate random private key/ public key pair
function randomKey(callback = log) {
    ecc.randomKey().then(pvk => {
        const puk = ecc.privateToPublic(pvk);
        callback(null, JSON.stringify({'privateKey': pvk, 'publicKey': puk}));
    }).catch(error => {
        callback(JSON.stringify({'error': error}));
    });
}

// Generate public key from private key
function pvkToPuk(pvk, callback = log) {
    const puk = ecc.privateToPublic(pvk);
    callback(null, JSON.stringify({'publicKey': puk}));
}

// Using privateKey to sign any input string
function sign(s, pvk, callback = log) {
    try {
        const signature = ecc.sign(s, pvk);
        callback(null, JSON.stringify({'signature': signature}));
    } catch (error) {
        callback(JSON.stringify({'error': error.message}));
    }
}

// private helper function for appending private key to config
// not for external use
function _config(pvk) {
    const cfg = Object.assign({}, config);
    if (pvk !== undefined) {
        cfg.sign = true;
        cfg.keyProvider = [pvk];
    }
    return cfg;
}

// Get account information from EOS
function getAccount(name, callback = log) {
    const eos = Eos(_config());
    eos.getAccount(name).then(result => {
        callback(null, JSON.stringify({'account': result}));
    }).catch(error => {
        callback(JSON.stringify({'error': error}));
    });
}

// Get account balance from contract issuer
// code is smart contract name
// e.g. getBalance('mhwb3kzafoxg')
function getBalance(name, code = 'eosio.token', callback = log) {
    const eos = Eos(_config());
    eos.getTableRows({
        'scope': name,
        'code': code,
        'table': 'accounts',
        'json': true
    }).then(balance => {
        callback(null, JSON.stringify({'balance': balance.rows}));
    }).catch(error => {
        callback(JSON.stringify({'error': error}));
    });
}

// Get account names by public key
// e.g. getKeyAccounts('EOS5FxA3PnsnUu1prJRuqFKDXuQFZkEDjC3XudPUhfxfwooSfDYdr')
function getKeyAccounts(puk, callback = log) {
    const eos = Eos(_config());
    eos.getKeyAccounts(puk).then(names => {
        callback(null, JSON.stringify({'names': names}));
    }).catch(error => {
        callback(JSON.stringify({'error': error}));
    });
}

// get currency info by symbol
// code is smart contract name
// e.g. getCurrencyStats('SYS')
function getCurrencyStats(symbol, code = 'eosio.token', callback = log) {
    const eos = Eos(_config());
    eos.getCurrencyStats(code, symbol).then(stats => {
        callback(null, JSON.stringify({'stats': stats}));
    }).catch(error => {
        callback(JSON.stringify({'error': error}));
    });
}

// Transfer currency from one account to another
// Amount must have the same decimal places as token's supply/max_supply.
// e.g. SYS's max_supply = 10000.0000, then '1.0000 SYS' is legal while '1 SYS' is illegal
// Get token info by function get_token_info()
// e.g. transfer('from_user', 'to_user', '3.1415 EZPT', 'sample memo', private_key')
function transfer(from, to, amount, memo, pvk, callback = log) {
    const eos = Eos(_config(pvk));
    eos.transfer(from, to, amount, memo).then(result => {
        callback(null, {'result': result});
    }).catch(error => {
        try {
            callback(JSON.stringify({'error': JSON.parse(error).message}));
        } catch (e) {
            callback(JSON.stringify({'error': error.message}));
        }
    });
}

module.exports = {
    random_key: randomKey,
    pvk_to_puk: pvkToPuk,
    sign,
    get_account: getAccount,
    get_balance: getBalance,
    get_key_accounts: getKeyAccounts,
    get_currency_stats: getCurrencyStats,
    transfer
};
