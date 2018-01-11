[fllscoreclient](../README.md) > ["shared/interface"](../modules/_shared_interface_.md) > [FLLScoreClient](../modules/_shared_interface_.fllscoreclient.md) > [IWebClient](../interfaces/_shared_interface_.fllscoreclient.iwebclient.md)



# Interface: IWebClient


Web Client that connects to a Web Proxy through websockets.

## Hierarchy


 `EventEmitter`

**↳ IWebClient**







## Implemented by

* [WebClient](../classes/_client_webclient_.webclient.md)


## Properties
<a id="socket"></a>

###  socket

**●  socket**:  *`Socket`* 

*Defined in shared/interface.ts:173*



The underlying socket connection




___


## Methods
<a id="addlistener"></a>

###  addListener

► **addListener**(event: *`string`⎮`symbol`*, listener: *`function`*): `this`



*Inherited from EventEmitter.addListener*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:408*



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



*Inherited from EventEmitter.emit*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:416*



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



*Inherited from EventEmitter.eventNames*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:421*





**Returns:** `Array`.<`string`⎮`symbol`>





___

<a id="getlastupdate"></a>

###  getLastUpdate

► **getLastUpdate**(): `Promise`.<`Date`>



*Defined in shared/interface.ts:179*



Request the last update from the proxy




**Returns:** `Promise`.<`Date`>
- Resolves with the last update received by the proxy, rejects with an error.






___

<a id="getmaxlisteners"></a>

###  getMaxListeners

► **getMaxListeners**(): `number`



*Inherited from EventEmitter.getMaxListeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:414*





**Returns:** `number`





___

<a id="getscoreinfo"></a>

###  getScoreInfo

► **getScoreInfo**(): `Promise`.<[IScoreInfo](_shared_interface_.fllscoreclient.iscoreinfo.md)>



*Defined in shared/interface.ts:185*



Request the last scoring info from the proxy




**Returns:** `Promise`.<[IScoreInfo](_shared_interface_.fllscoreclient.iscoreinfo.md)>
- Resolves with the last scoreInfo from the proxy rejects with an error.






___

<a id="listenercount"></a>

###  listenerCount

► **listenerCount**(type: *`string`⎮`symbol`*): `number`



*Inherited from EventEmitter.listenerCount*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:417*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `string`⎮`symbol`   |  - |





**Returns:** `number`





___

<a id="listeners"></a>

###  listeners

► **listeners**(event: *`string`⎮`symbol`*): `Function`[]



*Inherited from EventEmitter.listeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:415*



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

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:409*



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

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:410*



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

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:419*



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

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:420*



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



*Inherited from EventEmitter.removeAllListeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:412*



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

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:411*



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



*Inherited from EventEmitter.setMaxListeners*

*Defined in /Users/dhanwada/Repositories/fllscoreclientjs/node_modules/@types/node/index.d.ts:413*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| n | `number`   |  - |





**Returns:** `this`





___


