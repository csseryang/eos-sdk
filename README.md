[![Build Status](https://travis-ci.org/EOSIO/eosjs.svg?branch=master)](https://travis-ci.com/qding-bot/eos-sdk)

# EOS-SDK
JavaScript Helper for mobile platforms

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
Cancel a request
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
Get (outgoing) request list
```js
EosSdk.relation('contractName').get_apply('name')
```
* **contractName**: contract name. 
* **name**: account name

### Get pending list
Get (incoming) request list
```js
EosSdk.relation('contractName').get_pending('name')
```
* **contractName**: contract name. 
* **name**: account name

### Get relation list
Get all relationship
```js
EosSdk.relation('contractName').get_relation('name')
```
* **contractName**: contract name. 
* **name**: account name