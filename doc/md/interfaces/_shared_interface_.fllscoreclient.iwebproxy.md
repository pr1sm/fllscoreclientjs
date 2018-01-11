[fllscoreclient](../README.md) > ["shared/interface"](../modules/_shared_interface_.md) > [FLLScoreClient](../modules/_shared_interface_.fllscoreclient.md) > [IWebProxy](../interfaces/_shared_interface_.fllscoreclient.iwebproxy.md)



# Interface: IWebProxy


The Web Proxy to provide browsers with scoring info through web sockets.

## Implemented by

* [WebProxy](../classes/_proxy_webproxy_.webproxy.md)


## Properties
<a id="infopollingrate"></a>

###  infoPollingRate

**●  infoPollingRate**:  *`number`* 

*Defined in shared/interface.ts:223*



The rate at which to check for new updates (in seconds)
*__default__*: 30





___

<a id="serveport"></a>

###  servePort

**●  servePort**:  *`number`* 

*Defined in shared/interface.ts:229*



The port on which to serve the proxy
*__default__*: 25003





___

<a id="socketopts"></a>

###  socketOpts

**●  socketOpts**:  *[IClientOpts](_shared_interface_.fllscoreclient.iclientopts.md)* 

*Defined in shared/interface.ts:234*



The options for underlying local client.




___


## Methods
<a id="startproxy"></a>

###  startProxy

► **startProxy**(): `Promise`.<`boolean`>



*Defined in shared/interface.ts:240*



Start the proxy server and connect to the running scoring server.




**Returns:** `Promise`.<`boolean`>
- Resolves to true when connected, false if connection couldn't be made.






___


