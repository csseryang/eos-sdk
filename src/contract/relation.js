const utils = require('../utilities');
const read_table = utils.read_table;
const clog = utils.log;
const process = utils.process;

/**
 * Relation contract class
 */
class Relation {
    /**
     * Relation contract class
     * @param {Eos} eos
     * @param {string} contract_name  - Contract owner account name
     *
     */
    constructor (eos, contract_name) {
        this.eos = eos;
        this.contract_name = contract_name;
    }

    async contract () {
        return await this.eos.contract(this.contract_name);
    }

    /**
     * Register new user in contract
     * @param {string} name - Account name
     * @param {number} type - User type as sex
     * @param {string} uri - User's external info uri
     * @param {string} extra - User's data
     * @param {function} [callback] - Callback to execute (Optional)
     *  * @returns {Promise<*>}
     */
    async register (name, type, uri, extra, callback = clog) {
        let contract = await this.contract();
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
        return await process(call, callback);
    }

    /**
     * Update uri
     * @param name {string} - Account name
     * @param uri {string} - New uri
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async set_uri (name, uri, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': name,
            'newuri': uri
        };
        const option = {
            'authorization': [name + `@active`]
        };

        let call = contract.seturi(param, option);
        return await process(call, callback);
    }

    /**
     * Update type
     * @param name {string} - Account name
     * @param type {number} - New type
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async set_type (name, type, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': name,
            'newtype': type
        };
        const option = {
            'authorization': [name + `@active`]
        };

        let call = contract.settype(param, option);
        return await process(call, callback);
    }

    /**
     * Update data
     * @param name {string} - Account name
     * @param extra {string} - User's data
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async set_extra (name, extra, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': name,
            'newextra': extra
        };
        const option = {
            'authorization': [name + `@active`]
        };

        let call = contract.setextra(param, option);
        return await process(call, callback);
    }

    /**
     * Send request to another account
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async apply (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'apply': to
        };
        const option = {
            'authorization': [from + `@active`]
        };

        let call = contract.apply(param, option);
        return await process(call, callback);
    }

    /**
     * Accept an incoming request
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async accept (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'addname': to
        };
        const option = {
            'authorization': [from + `@active`]
        };

        let call = contract.addname(param, option);
        return await process(call, callback);
    }

    /**
     * Reject an incoming request
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async reject (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'rejectname': to
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.rejectname(param, option);
        return await process(call, callback);
    }

    /**
     * Cancel an outgoing request
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async cancel (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'cancel': to
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.cancel(param, option);
        return await process(call, callback);
    }

    /**
     * Delete a relation
     * @param from {string} - Account name
     * @param to {string} - Recipient name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async delete (from, to, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'deletename': to
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.deletename(param, option);
        return await process(call, callback);
    }

    /**
     * Send a message
     * @param {string} from - Account name
     * @param {string} to  - Recipient name
     * @param {string} message - Message to send
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async send_message (from, to, message, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': from,
            'receiver': to,
            'message': message
        };
        const option = {
            'authorization': [from + `@active`]
        };
        let call = contract.sendmessage(param, option);
        return await process(call, callback);
    }

    /**
     * Send a message
     * @param from {string} - Account name
     * @param targets {array} - Recipient names
     * @param message {string} - Message to send
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async send_group_message (from, targets, message, callback = clog) {
        let contract = await this.contract();
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
        let call = Promise.all(todo);
        return await process(call, callback);
    }

    /**
     * Delete all message before id in InBox
     * @param name {string} - Account name
     * @param id {number} - Max message id to delete
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async delete_inbox (name, id, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': name,
            'id': id
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.deleteinbox(param, option);
        return await process(call, callback);
    }

    /**
     * Delete all message before id in OutBox
     * @param name {string} - Account name
     * @param id {number} Max message id to delete
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async delete_outbox (name, id, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': name,
            'id': id
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.deleteoutbox(param, option);
        return await process(call, callback);
    }

    /**
     * Delete one message by id in InBox
     * @param name {string} - Account name
     * @param id {number} Message id to delete
     * @param pvk {string} - Private key. Must match with name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async delete_in_message (name, id, pvk, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': name,
            'id': id
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.deleteinmsg(param, option);
        return await process(call, callback);
    }

    /**
     * Delete one message by id in OutBox
     * @param name {string} - Account name
     * @param id {number} Message id to delete
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async delete_out_message (name, id, callback = clog) {
        let contract = await this.contract();
        const param = {
            'name': name,
            'id': id
        };
        const option = {
            'authorization': [name + `@active`]
        };
        let call = contract.deleteoutmsg(param, option);
        return await process(call, callback);
    }

    /**
     * Get user info
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_info (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'info');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Get user info by an array of account names
     * @param {array} account_names  - Account names
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_info_list (account_names, callback = clog) {
        let todo = [];
        for (let name of account_names) {
            todo.push(read_table(this.eos, name, this.contract_name, 'info'));
        }

        let call = Promise.all(todo);

        function processor (results) {
            return results.map(x => x[0]).concat();
        }

        return await process(call, callback, processor);
    }

    /**
     * Get outgoing request list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_apply (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'apply');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Get incoming request list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_pending (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'pending');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Get confirmed contacts list
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_confirmed (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'confirm');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Get incoming messages
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_inbox (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'inbox');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }

    /**
     * Get outgoing messages
     * @param name {string} - Account name
     * @param {function} [callback] - Callback to execute (Optional)
     */
    async get_outbox (name, callback = clog) {
        let call = read_table(this.eos, name, this.contract_name, 'outbox');
        let processor = utils.get_first_processor;
        return await process(call, callback, processor);
    }
}

module.exports = Relation;