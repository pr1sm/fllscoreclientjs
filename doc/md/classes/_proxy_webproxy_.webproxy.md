[fllscoreclient](../README.md) > ["proxy/webProxy"](../modules/_proxy_webproxy_.md) > [WebProxy](../classes/_proxy_webproxy_.webproxy.md)



# Class: WebProxy

## Implements

* [IWebProxy](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md)

## Index

### Constructors

* [constructor](_proxy_webproxy_.webproxy.md#constructor)


### Properties

* [clients](_proxy_webproxy_.webproxy.md#clients)
* [fllclient](_proxy_webproxy_.webproxy.md#fllclient)
* [infoPollingRate](_proxy_webproxy_.webproxy.md#infopollingrate)
* [pollTest](_proxy_webproxy_.webproxy.md#polltest)
* [servePort](_proxy_webproxy_.webproxy.md#serveport)
* [server](_proxy_webproxy_.webproxy.md#server)
* [socketOpts](_proxy_webproxy_.webproxy.md#socketopts)


### Methods

* [closeConnections](_proxy_webproxy_.webproxy.md#closeconnections)
* [setupClientListener](_proxy_webproxy_.webproxy.md#setupclientlistener)
* [startProxy](_proxy_webproxy_.webproxy.md#startproxy)
* [stopProxy](_proxy_webproxy_.webproxy.md#stopproxy)
* [defaults](_proxy_webproxy_.webproxy.md#defaults)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new WebProxy**(opts?: *[IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)*): [WebProxy](_proxy_webproxy_.webproxy.md)


*Defined in proxy/webProxy.ts:58*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| opts | [IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)   |  - |





**Returns:** [WebProxy](_proxy_webproxy_.webproxy.md)

---


## Properties
<a id="clients"></a>

### «Private» clients

**●  clients**:  *`Socket`[]* 

*Defined in proxy/webProxy.ts:46*





___

<a id="fllclient"></a>

### «Private» fllclient

**●  fllclient**:  *[IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md)* 

*Defined in proxy/webProxy.ts:57*





___

<a id="infopollingrate"></a>

###  infoPollingRate

**●  infoPollingRate**:  *`number`* 

*Implementation of [IWebProxy](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md).[infoPollingRate](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md#infopollingrate)*

*Defined in proxy/webProxy.ts:41*





___

<a id="polltest"></a>

### «Private»«Optional» pollTest

**●  pollTest**:  *`NodeJS.Timer`* 

*Defined in proxy/webProxy.ts:58*





___

<a id="serveport"></a>

###  servePort

**●  servePort**:  *`number`* 

*Implementation of [IWebProxy](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md).[servePort](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md#serveport)*

*Defined in proxy/webProxy.ts:42*





___

<a id="server"></a>

###  server

**●  server**:  *`Server`* 

*Defined in proxy/webProxy.ts:44*





___

<a id="socketopts"></a>

###  socketOpts

**●  socketOpts**:  *[IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)* 

*Implementation of [IWebProxy](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md).[socketOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md#socketopts)*

*Defined in proxy/webProxy.ts:43*





___


## Methods
<a id="closeconnections"></a>

### «Private» closeConnections

► **closeConnections**(): `void`



*Defined in proxy/webProxy.ts:122*





**Returns:** `void`





___

<a id="setupclientlistener"></a>

### «Private» setupClientListener

► **setupClientListener**(): `void`



*Defined in proxy/webProxy.ts:129*





**Returns:** `void`





___

<a id="startproxy"></a>

###  startProxy

► **startProxy**(): `Promise`.<`boolean`>



*Implementation of [IWebProxy](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md).[startProxy](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md#startproxy)*

*Defined in proxy/webProxy.ts:78*





**Returns:** `Promise`.<`boolean`>





___

<a id="stopproxy"></a>

###  stopProxy

► **stopProxy**(): `Promise`.<`string`>



*Defined in proxy/webProxy.ts:113*





**Returns:** `Promise`.<`string`>





___

<a id="defaults"></a>

### «Static»«Private» defaults

► **defaults**(src: *[IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)*, def: *[IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)*): [IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)



*Defined in proxy/webProxy.ts:6*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| src | [IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)   |  - |
| def | [IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)   |  - |





**Returns:** [IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)





___



