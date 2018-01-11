[fllscoreclient](../README.md) > ["client/webClient"](../modules/_client_webclient_.md) > [WebClient](../classes/_client_webclient_.webclient.md)



# Class: WebClient

## Hierarchy


 `EventEmitter`

**↳ WebClient**







## Implements

* [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md)

## Index

### Constructors

* [constructor](_client_webclient_.webclient.md#constructor)


### Properties

* [host](_client_webclient_.webclient.md#host)
* [lastUpdate](_client_webclient_.webclient.md#lastupdate)
* [port](_client_webclient_.webclient.md#port)
* [scoreInfo](_client_webclient_.webclient.md#scoreinfo)
* [socket](_client_webclient_.webclient.md#socket)
* [defaultMaxListeners](_client_webclient_.webclient.md#defaultmaxlisteners)


### Methods

* [addListener](_client_webclient_.webclient.md#addlistener)
* [emit](_client_webclient_.webclient.md#emit)
* [eventNames](_client_webclient_.webclient.md#eventnames)
* [getLastUpdate](_client_webclient_.webclient.md#getlastupdate)
* [getMaxListeners](_client_webclient_.webclient.md#getmaxlisteners)
* [getScoreInfo](_client_webclient_.webclient.md#getscoreinfo)
* [listenerCount](_client_webclient_.webclient.md#listenercount)
* [listeners](_client_webclient_.webclient.md#listeners)
* [on](_client_webclient_.webclient.md#on)
* [once](_client_webclient_.webclient.md#once)
* [prependListener](_client_webclient_.webclient.md#prependlistener)
* [prependOnceListener](_client_webclient_.webclient.md#prependoncelistener)
* [removeAllListeners](_client_webclient_.webclient.md#removealllisteners)
* [removeListener](_client_webclient_.webclient.md#removelistener)
* [setMaxListeners](_client_webclient_.webclient.md#setmaxlisteners)
* [listenerCount](_client_webclient_.webclient.md#listenercount-1)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new WebClient**(host?: *`string`*, port?: *`number`*): [WebClient](_client_webclient_.webclient.md)


*Defined in client/webClient.ts:11*



**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| host | `string`  | &quot;localhost&quot; |   - |
| port | `number`  | 25003 |   - |





**Returns:** [WebClient](_client_webclient_.webclient.md)

---


## Properties
<a id="host"></a>

###  host

**●  host**:  *`string`*  = "localhost"

*Defined in client/webClient.ts:6*





___

<a id="lastupdate"></a>

### «Private»«Optional» lastUpdate

**●  lastUpdate**:  *`Date`* 

*Defined in client/webClient.ts:10*





___

<a id="port"></a>

###  port

**●  port**:  *`number`*  = 25003

*Defined in client/webClient.ts:7*





___

<a id="scoreinfo"></a>

### «Private»«Optional» scoreInfo

**●  scoreInfo**:  *[IScoreInfo](../interfaces/_shared_interface_.fllscoreclient.iscoreinfo.md)* 

*Defined in client/webClient.ts:11*





___

<a id="socket"></a>

###  socket

**●  socket**:  *`Socket`* 

*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[socket](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#socket)*

*Defined in client/webClient.ts:8*





___

<a id="defaultmaxlisteners"></a>

### «Static» defaultMaxListeners

**●  defaultMaxListeners**:  *`number`* 

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:905*





___


## Methods
<a id="addlistener"></a>

###  addListener

► **addListener**(event: *`string`⎮`symbol`*, listener: *`function`*): `this`



*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:907*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="emit"></a>

###  emit

► **emit**(event: *`string`⎮`symbol`*, ...args: *`any`[]*): `boolean`



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[emit](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#emit)*

*Inherited from EventEmitter.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:917*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |
| args | `any`[]   |  - |





**Returns:** `boolean`





___

<a id="eventnames"></a>

###  eventNames

► **eventNames**(): `Array`.<`string`⎮`symbol`>



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[eventNames](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#eventnames)*

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:918*





**Returns:** `Array`.<`string`⎮`symbol`>





___

<a id="getlastupdate"></a>

###  getLastUpdate

► **getLastUpdate**(): `Promise`.<`Date`>



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[getLastUpdate](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#getlastupdate)*

*Defined in client/webClient.ts:51*





**Returns:** `Promise`.<`Date`>





___

<a id="getmaxlisteners"></a>

###  getMaxListeners

► **getMaxListeners**(): `number`



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[getMaxListeners](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#getmaxlisteners)*

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:915*





**Returns:** `number`





___

<a id="getscoreinfo"></a>

###  getScoreInfo

► **getScoreInfo**(): `Promise`.<[IScoreInfo](../interfaces/_shared_interface_.fllscoreclient.iscoreinfo.md)>



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[getScoreInfo](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#getscoreinfo)*

*Defined in client/webClient.ts:69*





**Returns:** `Promise`.<[IScoreInfo](../interfaces/_shared_interface_.fllscoreclient.iscoreinfo.md)>





___

<a id="listenercount"></a>

###  listenerCount

► **listenerCount**(type: *`string`⎮`symbol`*): `number`



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[listenerCount](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#listenercount)*

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:919*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `string`⎮`symbol`   |  - |





**Returns:** `number`





___

<a id="listeners"></a>

###  listeners

► **listeners**(event: *`string`⎮`symbol`*): `Function`[]



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[listeners](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#listeners)*

*Inherited from EventEmitter.listeners*

*Overrides EventEmitter.listeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:916*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |





**Returns:** `Function`[]





___

<a id="on"></a>

###  on

► **on**(event: *`string`⎮`symbol`*, listener: *`function`*): `this`



*Inherited from EventEmitter.on*

*Overrides EventEmitter.on*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:908*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="once"></a>

###  once

► **once**(event: *`string`⎮`symbol`*, listener: *`function`*): `this`



*Inherited from EventEmitter.once*

*Overrides EventEmitter.once*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:909*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="prependlistener"></a>

###  prependListener

► **prependListener**(event: *`string`⎮`symbol`*, listener: *`function`*): `this`



*Inherited from EventEmitter.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:910*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="prependoncelistener"></a>

###  prependOnceListener

► **prependOnceListener**(event: *`string`⎮`symbol`*, listener: *`function`*): `this`



*Inherited from EventEmitter.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:911*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="removealllisteners"></a>

###  removeAllListeners

► **removeAllListeners**(event?: *`string`⎮`symbol`*): `this`



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[removeAllListeners](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#removealllisteners)*

*Inherited from EventEmitter.removeAllListeners*

*Overrides EventEmitter.removeAllListeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:913*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |





**Returns:** `this`





___

<a id="removelistener"></a>

###  removeListener

► **removeListener**(event: *`string`⎮`symbol`*, listener: *`function`*): `this`



*Inherited from EventEmitter.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:912*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | `string`⎮`symbol`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="setmaxlisteners"></a>

###  setMaxListeners

► **setMaxListeners**(n: *`number`*): `this`



*Implementation of [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md).[setMaxListeners](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md#setmaxlisteners)*

*Inherited from EventEmitter.setMaxListeners*

*Overrides EventEmitter.setMaxListeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:914*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| n | `number`   |  - |





**Returns:** `this`





___

<a id="listenercount-1"></a>

### «Static» listenerCount

► **listenerCount**(emitter: *`EventEmitter`*, event: *`string`⎮`symbol`*): `number`



*Inherited from EventEmitter.listenerCount*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:904*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| emitter | `EventEmitter`   |  - |
| event | `string`⎮`symbol`   |  - |





**Returns:** `number`





___


