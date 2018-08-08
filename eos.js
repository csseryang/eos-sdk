var ecc = eosjs_ecc
var config = {
  chainId: '0cab93bc5577841792732d919fb0f0afdde744af8be98403975a5d6320c3c347', // 32 byte (64 char) hex string
  httpEndpoint: 'http://52.8.73.95:8000',
  expireInSeconds: 60,
  broadcast: true,
  logger: {
  	log: null, 
  	error: null,
  }
}

function random_key() {
	var p = ecc.randomKey()
	p.then(pvk => {		
		var puk = ecc.privateToPublic(pvk);
		console.log(JSON.stringify({"privateKey": pvk, "publicKey": puk}))
	})
}

function sign(s, pvk) {
	var signature = ecc.sign(s, pvk);
	console.log(JSON.stringify({"signature": signature}))
}

function get_account(name) {
	var eos = Eos(config)
	eos.getAccount(name).then(result=>{
		console.log(JSON.stringify({'account': result}))
	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}

function get_balance(name) {
	var eos = Eos(config)
	eos.getTableRows({
	  "scope": name,
	  "code": "eosio.token",
	  "table": "accounts",
	  "json": true
	}).then(balance=>{
		console.log(JSON.stringify({'balance': balance.rows}));

	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}

function get_key_accounts(puk) {
	var eos = Eos(config)
	eos.getKeyAccounts(puk).then(names=>{
		console.log(JSON.stringify({'names': names}));

	}).catch(error=>{
		console.log(JSON.stringify({'error': error}))
	})
}