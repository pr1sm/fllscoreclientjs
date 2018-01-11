[fllscoreclient](../README.md) > ["shared/interface"](../modules/_shared_interface_.md) > [FLLScoreClient](../modules/_shared_interface_.fllscoreclient.md) > [IWebProxyOpts](../interfaces/_shared_interface_.fllscoreclient.iwebproxyopts.md)



# Interface: IWebProxyOpts


Configuration Options for the Web Proxy


## Properties
<a id="infopollingrate"></a>

### «Optional» infoPollingRate

**●  infoPollingRate**:  *`undefined`⎮`number`* 

*Defined in shared/interface.ts:196*



The rate at which to check for new updates (in seconds)
*__default__*: 30





___

<a id="serveport"></a>

### «Optional» servePort

**●  servePort**:  *`undefined`⎮`number`* 

*Defined in shared/interface.ts:202*



The port on which to serve the proxy
*__default__*: 25003





___

<a id="socket"></a>

### «Optional» socket

**●  socket**:  *[IClient](_shared_interface_.fllscoreclient.iclient.md)* 

*Defined in shared/interface.ts:212*



The underlying client connection.




___

<a id="socketopts"></a>

### «Optional» socketOpts

**●  socketOpts**:  *[IClientOpts](_shared_interface_.fllscoreclient.iclientopts.md)* 

*Defined in shared/interface.ts:207*



The options for underlying local client.




___


