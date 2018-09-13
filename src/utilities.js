/**
 * JavaScript helper library for mobile platforms
 * @module EosSdk
 */
function log (error, result) {
    if (result !== undefined) {
        console.log(result);
    } else {
        console.log(error);
    }
}

module.exports = {
    log
};