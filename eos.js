const ecc = eosjs_ecc
const config = {
  chainId: '0cab93bc5577841792732d919fb0f0afdde744af8be98403975a5d6320c3c347', // 32 byte (64 char) hex string
  httpEndpoint: 'http://52.8.73.95:8000',
  expireInSeconds: 60,
  broadcast: true,
  logger: {
  	log: null, 
  	error: null,
  }
}

// Generate random private key/ public key pair
function random_key() {
	ecc.randomKey().then(pvk => {		
		var puk = ecc.privateToPublic(pvk);
		console.log(JSON.stringify({"privateKey": pvk, "publicKey": puk}))
	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}

// Using privateKey to sign any input string
function sign(s, pvk) {
	try {
		var signature = ecc.sign(s, pvk);
		console.log(JSON.stringify({"signature": signature}))
	} catch(error) {
		console.log(JSON.stringify({'error': error.message}))
	}
}

// Get account information from EOS 
function get_account(name) {
	const eos = Eos(config)
	eos.getAccount(name).then(result=>{
		console.log(JSON.stringify({'account': result}))
	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}

// Get account balance from contract issuer
// code is smart contract name
// e.g. get_balance('mhwb3kzafoxg')
function get_balance(name, code='eosio.token') {
	const eos = Eos(config)
	eos.getTableRows({
	  "scope": name,
	  "code": code,
	  "table": "accounts",
	  "json": true
	}).then(balance=>{
		console.log(JSON.stringify({'balance': balance.rows}));
	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}

// Get account names by public key
// e.g. get_key_accounts('EOS5FxA3PnsnUu1prJRuqFKDXuQFZkEDjC3XudPUhfxfwooSfDYdr')
function get_key_accounts(puk) {
	const eos = Eos(config)
	eos.getKeyAccounts(puk).then(names=>{
		console.log(JSON.stringify({'names': names}));

	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}

// get currency info by symbol
// code is smart contract name
// e.g. get_currency_stats('SYS')
function get_currency_stats(symbol, code='eosio.token') {
	const eos = Eos(config)
	eos.getCurrencyStats(code, symbol).then(stats=>{
		console.log(JSON.stringify({'stats': stats}));
	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}

// private helper function for appending private key to config
// not for external use
function _add_pvk(pvk) {
	const cfg = Object.assign({}, config);
	cfg.sign = true;
	cfg.keyProvider = [pvk];
	return cfg;
}

// Transfer currency from one account to another
// Amount must have the same decimal places as token's supply/max_supply.
// e.g. SYS's max_supply = 10000.0000, then '1.0000 SYS' is legal while '1 SYS' is illegal
// Get token info by function get_token_info()
// e.g. transfer('from_user', 'to_user', '3.1415 EZPT', 'private_key')
function transfer(from, to, amount, pvk) {
	const eos = Eos(_add_pvk(pvk))

	eos.transfer(from, to, amount, '').then(result=>{
	  console.log({'result':result})
	}).catch(error=>{
	  console.log(JSON.stringify({'error': error.message}))
	})
}