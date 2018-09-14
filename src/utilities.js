const Eos = require('eosjs');
const bigInt = require('big-integer');

/**
 *
 * @param error
 * @param result
 */
function log (error, result) {
    if (result !== undefined) {
        console.log(result);
    } else {
        console.log(error);
    }
}

/**
 *
 * @param end_point
 * @param callback
 * @returns {Promise<*>}
 */
async function get_chain_info (end_point, callback = log) {
    let eos = Eos.modules.api({httpEndpoint: end_point});
    let call = eos.getInfo({});
    return await process(call, callback);
}

/**
 * Read table
 * @param {Eos} eos
 * @param {string} name - contract name
 * @param {string} code - index to use
 * @param {string} table - table name
 * @returns {Promise<*>}
 */
async function read_table (eos, name, code, table) {
    let call = eos.getTableRows({
        'scope': name,
        'code': code,
        'table': table,
        'json': true
    });
    let result = await call;
    return result.rows;
}

/**
 *
 * @returns {*[]}
 * @param x
 */
function default_processor (x) {
    return x;
}

/**
 *
 * @param x
 * @returns {*}
 */
function get_first_processor (x) {
    return x[0];
}

/**
 * Transfer big endian integers to number
 * @param id
 * @returns {*}
 * @private
 */
function parse_bigint (id) {
    if (typeof id === 'number') {
        return id;
    }

    if (id.startsWith('0x')) {
        id = id.substring(2);
    }
    const r = id.match(/../g).reverse().join('');
    return bigInt(r, 16).toString(10);
}

/**
 *
 * @param {Promise<*>} call
 * @param {function} processor
 * @param {function} [callback] - Callback to execute (Optional)
 * @returns {Promise<*>}
 * @private
 */
async function process (call, callback, processor = default_processor) {
    try {
        let result = await call;
        let output = JSON.stringify({'result': processor(result)});
        if (callback) {
            callback(null, output);
        } else {
            return output;
        }
    } catch (e) {
        let error = JSON.stringify({'error': e.message || e});
        if (callback) {
            callback(error);
        } else {
            throw error;
        }
    }
}

module.exports = {
    log,
    get_chain_info,
    read_table,
    process,
    get_first_processor,
    parse_bigint
};
