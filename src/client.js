const Eos = require('eosjs');

let config = {
    // chainId: '0cab93bc5577841792732d919fb0f0afdde744af8be98403975a5d6320c3c347',
    // httpEndpoint: 'http://52.8.73.95:8000',
    expireInSeconds: 60,
    broadcast: true,
    logger: {
        log: null,
        error: null
    }
};

module.exports = (end_point, chain_id, pvk) => {
    config.httpEndpoint = end_point;
    config.chainId = chain_id;

    if (pvk !== undefined) {
        config.sign = true;
        config.keyProvider = [pvk];
    }
    return Eos(config);
};