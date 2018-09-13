const _log = require('../utilities').log;

/**
 * Relation contract class
 */
class Relation {
    /**
     *
     * @param {Client} client - EOS client
     * @param {string} contract_name  - Contract owner account name
     *
     */
    constructor (client, contract_name) {
        this.client = client;
        this.contract_name = contract_name;
    }

    /**
     * Register new user in contract
     * @param {string} name - Account name
     * @param {number} type - User type as sex
     * @param {string} uri - User's external info uri
     * @param {string} extra - User's data
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async register (name, type, uri, extra, callback = _log) {
        const eos = this.client.get_client();
        let contract = await eos.contract(this.contract_name);
        const param = {
            'name': name,
            'type': type,
            'uri': uri,
            'extra': extra
        };
        const option = {
            'authorization': [name + `@active`]
        };

        let call = contract.createobj(param, option);
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

    /**
     * Update uri
     * @param name {string} - Account name
     * @param uri {string} - New uri
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async set_uri (name, uri, callback = _log) {
        const eos = this.client.get_client();
        let contract = await eos.contract(this.contract_name);

        const param = {
            'name': name,
            'newuri': uri
        };
        const option = {
            'authorization': [name + `@active`]
        };

        let call = contract.seturi(param, option);
        if (callback == null) {
            return call;
        }

        try {
            let result = await call;
            callback(null, {'result': result});
        } catch (e) {
            callback(JSON.stringify({'error': e.message || e}));
        }
    }

    /**
     * Update type
     * @param name {string} - Account name
     * @param type {number} - New type
     * @param {function} [callback] - Callback to execute (Optional)
     */
    set_type (name, type, callback = _log) {
        const eos = this.client.get_client();
        eos.contract(this.contract_name)
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
        const eos = this.client.get_client();
        eos.contract(this.contract_name)
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
        const eos = this.client.get_client();
        eos.contract(this.contract_name)
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
        const eos = this.client.get_client();
        eos.contract(this.contract_name)
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
        eos.contract(this.contract_name)
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
        eos.contract(this.contract_name)
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
        eos.contract(this.contract_name)
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
        eos.contract(this.contract_name)
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
        const contract = await eos.contract(this.contract_name);

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
     * @param id {number} - Max message id to delete
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_inbox (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.contract_name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': id
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
     * @param id {number} Max message id to delete
     * @param pvk {string} - Private key. Must match name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_outbox (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.contract_name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': id
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
     * @param id {number} Message id to delete
     * @param pvk {string} - Private key. Must match with name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_in_message (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.contract_name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': id
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
     * @param id {number} Message id to delete
     * @param pvk {string} - Private key. Must match with name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    delete_out_message (name, id, pvk, callback = _log) {
        const eos = eos_client(pvk);
        eos.contract(this.contract_name)
            .then((contract) => {
                const param = {
                    'name': name,
                    'id': id
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
        _read_table(name, this.contract_name, 'info', callback);
    }

    /**
     * Get user info by an array of account names
     * @param account_names {array} - Account names
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_info_list (account_names, callback = _log) {
        let todo = [];
        for (let name of account_names) {
            todo.push(_read_table(name, this.contract_name, 'info'));
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
        _read_table(name, this.contract_name, 'apply', callback);
    }

    /**
     * Get incoming request list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_pending (name, callback = _log) {
        _read_table(name, this.contract_name, 'pending', callback);
    }

    /**
     * Get confirmed contacts list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_confirmed (name, callback = _log) {
        _read_table(name, this.contract_name, 'confirm', callback);
    }

    /**
     * Get incoming messages
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_inbox (name, callback = _log) {
        _read_table(name, this.contract_name, 'inbox', callback);
    }

    /**
     * Get outgoing messages
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    get_outbox (name, callback = _log) {
        _read_table(name, this.contract_name, 'outbox', callback);
    }
}

module.exports = Relation;