const ecc = require('eosjs-ecc');
const clog = require('./utilities').log;

/**
 * Generate random private key/ public key pair
 * @param {function} [callback] - Callback to execute (Optional)
 */
async function random_key (callback = clog) {
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
function pvk_to_puk (pvk, callback = clog) {
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
function sign (s, pvk, callback = clog) {
    try {
        const signature = ecc.sign(s, pvk);
        callback(null, JSON.stringify({'signature': signature}));
    } catch (error) {
        callback(JSON.stringify({'error': error.message || error}));
    }
}

module.exports = {
    random_key,
    pvk_to_puk,
    sign,
    ecc
};
