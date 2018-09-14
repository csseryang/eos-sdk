[![Build Status](https://travis-ci.org/qdingify/eos-sdk.svg?branch=master)](https://travis-ci.org/qdingify/eos-sdk)

# EOS-SDK
JavaScript helper library for mobile platforms

## Basic
### Random Key
Generate random keys
```js
EosSdk.random_key()
```

### Private Key To Public Key
Generate public key from private key
```js
EosSdk.pvk_to_puk('privateKey')
```
* **privateKey**: private key

### Sign
Sign a string using private key
```js
EosSdk.sign('string', 'privateKey')
```
* **string**: string to be signed
* **privateKey**: private key

### Get account
Get account info by account name
```js
EosSdk.get_account('name')
```
* **name**: account name

### Get balance
Get account balance
```js
EosSdk.get_balance('name')
```
* **name**: account name

### Get key accounts
Get account name(s) by public key
```js
EosSdk.get_key_accounts('publicKey')
```
* **publicKey**: public key

### Get currency status
Get token info by symbol name
```js
EosSdk.get_currency_stats('symbol')
```
* **symbol**: token symbol, like 'SYS'


### Transfer
Transfer tokens to another account
```js
EosSdk.transfer('from', 'to', 'memo', 'privateKey')
```
* **from**: account name. 
* **to**: recipient account name
* **memo**: message for recipient
* **privateKey**: private key


## Relation contract
### Register
Register new user in contract
```js
EosSdk.relation('contractName').register('name', type, 'icon', 'uri', 'privateKey')
```
* **contractName**: contract name. 
* **name**: account name
* **type**: sex. 1 for male, 2 for female(number)
* **icon**: icon uri. can be empty string
* **uri**: external info. can be empty string
* **privateKey**: private key

### Apply
Send request to another account
```js
EosSdk.relation('contractName').apply('from', 'to', 'privateKey')
```
* **contractName**: contract name. 
* **from**: account name
* **to**: account name of recipient
* **privateKey**: private key

### Cancel
Cancel a outgoing request
```js
EosSdk.relation('contractName').cancel('from', 'to', 'privateKey')
```
* **contractName**: contract name. 
* **from**: account name
* **to**: account name of recipient
* **privateKey**: private key

### Accept
Accept an incoming request
```js
EosSdk.relation('contractName').accept('from', 'to', 'privateKey')
```
* **contractName**: contract name. 
* **from**: account name
* **to**: account name of applicant
* **privateKey**: private key

### Reject
Reject an incoming request
```js
EosSdk.relation('contractName').reject('from', 'to', 'privateKey')
```
* **contractName**: contract name. 
* **from**: account name
* **to**: account name of applicant
* **privateKey**: private key

### Delete
Delete a relation
```js
EosSdk.relation('contractName').delete('from', 'to', 'privateKey')
```
* **contractName**: contract name. 
* **from**: account name
* **to**: account name of relation to be deleted
* **privateKey**: private key

### Get application list
Get (outgoing) requests
```js
EosSdk.relation('contractName').get_apply('name')
```
* **contractName**: contract name. 
* **name**: account name

### Get pending list
Get (incoming) requests
```js
EosSdk.relation('contractName').get_pending('name')
```
* **contractName**: contract name. 
* **name**: account name

### Get relation list
Get all confirmed relationships
```js
EosSdk.relation('contractName').get_relation('name')
```
* **contractName**: contract name. 
* **name**: account name


### Get URI list
Get list of uri's by a list of account names
Might return error if user is not registered
```js
EosSdk.relation('contractName').get_uri_list(names)
```
* **contractName**: contract name. 
* **names**: list of account name. e.g. ['g1fciq4auixg', 'xzvbupxsbeam']
