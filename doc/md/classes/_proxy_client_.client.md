[fllscoreclient](../README.md) > ["proxy/client"](../modules/_proxy_client_.md) > [Client](../classes/_proxy_client_.client.md)



# Class: Client

## Implements

* [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md)

## Index

### Constructors

* [constructor](_proxy_client_.client.md#constructor)


### Properties

* [callbackQueues](_proxy_client_.client.md#callbackqueues)
* [connTest](_proxy_client_.client.md#conntest)
* [lastUpdate](_proxy_client_.client.md#lastupdate)
* [messageBuffer](_proxy_client_.client.md#messagebuffer)
* [scoreInfo](_proxy_client_.client.md#scoreinfo)
* [socket](_proxy_client_.client.md#socket)
* [status](_proxy_client_.client.md#status)
* [watchdogInterval](_proxy_client_.client.md#watchdoginterval)


### Methods

* [close](_proxy_client_.client.md#close)
* [connect](_proxy_client_.client.md#connect)
* [pushCallback](_proxy_client_.client.md#pushcallback)
* [removeCallback](_proxy_client_.client.md#removecallback)
* [resetConnectionTest](_proxy_client_.client.md#resetconnectiontest)
* [sendLastUpdate](_proxy_client_.client.md#sendlastupdate)
* [sendPing](_proxy_client_.client.md#sendping)
* [sendScore](_proxy_client_.client.md#sendscore)
* [defaults](_proxy_client_.client.md#defaults)


### Object literals

* [opts](_proxy_client_.client.md#opts)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Client**(opts?: *[IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)*): [Client](_proxy_client_.client.md)


*Defined in proxy/client.ts:42*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| opts | [IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)   |  - |





**Returns:** [Client](_proxy_client_.client.md)

---


## Properties
<a id="callbackqueues"></a>

### «Private» callbackQueues

**●  callbackQueues**:  *`Map`.<`string`>,.<[DataCallback](../modules/_proxy_client_.md#datacallback)[]>* 

*Defined in proxy/client.ts:41*





___

<a id="conntest"></a>

### «Private»«Optional» connTest

**●  connTest**:  *`Timer`* 

*Defined in proxy/client.ts:40*





___

<a id="lastupdate"></a>

### «Optional» lastUpdate

**●  lastUpdate**:  *`Date`* 

*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[lastUpdate](../interfaces/_shared_interface_.fllscoreclient.iclient.md#lastupdate)*

*Defined in proxy/client.ts:28*





___

<a id="messagebuffer"></a>

### «Private» messageBuffer

**●  messageBuffer**:  *`string`* 

*Defined in proxy/client.ts:42*





___

<a id="scoreinfo"></a>

### «Optional» scoreInfo

**●  scoreInfo**:  *[IScoreInfo](../interfaces/_shared_interface_.fllscoreclient.iscoreinfo.md)* 

*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[scoreInfo](../interfaces/_shared_interface_.fllscoreclient.iclient.md#scoreinfo)*

*Defined in proxy/client.ts:35*





___

<a id="socket"></a>

###  socket

**●  socket**:  *`Socket`* 

*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[socket](../interfaces/_shared_interface_.fllscoreclient.iclient.md#socket)*

*Defined in proxy/client.ts:37*





___

<a id="status"></a>

###  status

**●  status**:  *`number`* 

*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[status](../interfaces/_shared_interface_.fllscoreclient.iclient.md#status)*

*Defined in proxy/client.ts:36*





___

<a id="watchdoginterval"></a>

### «Private» watchdogInterval

**●  watchdogInterval**:  *`number`* 

*Defined in proxy/client.ts:39*





___


## Methods
<a id="close"></a>

###  close

► **close**(): `Promise`.<`string`>



*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[close](../interfaces/_shared_interface_.fllscoreclient.iclient.md#close)*

*Defined in proxy/client.ts:334*





**Returns:** `Promise`.<`string`>





___

<a id="connect"></a>

###  connect

► **connect**(): `Promise`.<`string`>



*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[connect](../interfaces/_shared_interface_.fllscoreclient.iclient.md#connect)*

*Defined in proxy/client.ts:142*





**Returns:** `Promise`.<`string`>





___

<a id="pushcallback"></a>

### «Private» pushCallback

► **pushCallback**(key: *`string`*, cb: *[DataCallback](../modules/_proxy_client_.md#datacallback)*): `void`



*Defined in proxy/client.ts:360*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| key | `string`   |  - |
| cb | [DataCallback](../modules/_proxy_client_.md#datacallback)   |  - |





**Returns:** `void`





___

<a id="removecallback"></a>

### «Private» removeCallback

► **removeCallback**(key: *`string`*, cb: *[DataCallback](../modules/_proxy_client_.md#datacallback)*): `void`



*Defined in proxy/client.ts:367*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| key | `string`   |  - |
| cb | [DataCallback](../modules/_proxy_client_.md#datacallback)   |  - |





**Returns:** `void`





___

<a id="resetconnectiontest"></a>

### «Private» resetConnectionTest

► **resetConnectionTest**(): `void`



*Defined in proxy/client.ts:377*





**Returns:** `void`





___

<a id="sendlastupdate"></a>

###  sendLastUpdate

► **sendLastUpdate**(): `Promise`.<`boolean`>



*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[sendLastUpdate](../interfaces/_shared_interface_.fllscoreclient.iclient.md#sendlastupdate)*

*Defined in proxy/client.ts:217*





**Returns:** `Promise`.<`boolean`>





___

<a id="sendping"></a>

###  sendPing

► **sendPing**(): `Promise`.<`string`>



*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[sendPing](../interfaces/_shared_interface_.fllscoreclient.iclient.md#sendping)*

*Defined in proxy/client.ts:183*





**Returns:** `Promise`.<`string`>





___

<a id="sendscore"></a>

###  sendScore

► **sendScore**(): `Promise`.<[IScoreInfo](../interfaces/_shared_interface_.fllscoreclient.iscoreinfo.md)>



*Implementation of [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md).[sendScore](../interfaces/_shared_interface_.fllscoreclient.iclient.md#sendscore)*

*Defined in proxy/client.ts:265*





**Returns:** `Promise`.<[IScoreInfo](../interfaces/_shared_interface_.fllscoreclient.iscoreinfo.md)>





___

<a id="defaults"></a>

### «Static»«Private» defaults

► **defaults**(src: *[IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)*, def: *[IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)*): [IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)



*Defined in proxy/client.ts:9*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| src | [IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)   |  - |
| def | [IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)   |  - |





**Returns:** [IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)





___


<a id="opts"></a>

## Object literal: opts


<a id="opts.host"></a>

###  host

**●  host**:  *`string`*  = "localhost"

*Defined in proxy/client.ts:30*





___
<a id="opts.name"></a>

###  name

**●  name**:  *`string`*  = "FLLScoreClient"

*Defined in proxy/client.ts:31*





___
<a id="opts.port"></a>

###  port

**●  port**:  *`number`*  = 25002

*Defined in proxy/client.ts:32*





___
<a id="opts.usewatchdog"></a>

###  useWatchdog

**●  useWatchdog**:  *`boolean`*  = true

*Defined in proxy/client.ts:33*





___


