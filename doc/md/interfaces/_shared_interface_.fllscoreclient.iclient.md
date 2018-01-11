[fllscoreclient](../README.md) > ["shared/interface"](../modules/_shared_interface_.md) > [FLLScoreClient](../modules/_shared_interface_.fllscoreclient.md) > [IClient](../interfaces/_shared_interface_.fllscoreclient.iclient.md)



# Interface: IClient


A local client that can connect directly to the Scoring Software through a tcp socket.

## Implemented by

* [Client](../classes/_proxy_client_.client.md)


## Properties
<a id="lastupdate"></a>

### «Optional» lastUpdate

**●  lastUpdate**:  *`Date`* 

*Defined in shared/interface.ts:78*



The date when the last update was received.




___

<a id="opts"></a>

###  opts

**●  opts**:  *[IClientOpts](_shared_interface_.fllscoreclient.iclientopts.md)* 

*Defined in shared/interface.ts:83*



The configuration options of this client.




___

<a id="scoreinfo"></a>

### «Optional» scoreInfo

**●  scoreInfo**:  *[IScoreInfo](_shared_interface_.fllscoreclient.iscoreinfo.md)* 

*Defined in shared/interface.ts:88*



The last received scoring info.




___

<a id="socket"></a>

###  socket

**●  socket**:  *`Socket`* 

*Defined in shared/interface.ts:101*



The underlying socket connection to the scoring server




___

<a id="status"></a>

###  status

**●  status**:  *`number`* 

*Defined in shared/interface.ts:96*



A number containing the status of this client. 0 - Disconnected 1 - Connecting 2 - Connected




___


## Methods
<a id="close"></a>

###  close

► **close**(): `Promise`.<`string`>



*Defined in shared/interface.ts:133*



Close the connection to the scoring server.




**Returns:** `Promise`.<`string`>
- Resolves to 'Close' on successful close  or 'Closed with error'.






___

<a id="connect"></a>

###  connect

► **connect**(): `Promise`.<`string`>



*Defined in shared/interface.ts:107*



Connect to the scoring server based on the config options




**Returns:** `Promise`.<`string`>
- Resolves to 'Connected' when connected or rejects with an error.






___

<a id="sendlastupdate"></a>

###  sendLastUpdate

► **sendLastUpdate**(): `Promise`.<`boolean`>



*Defined in shared/interface.ts:120*



Request the last update from the scoring server. This can be compared to the existing lastUpdate to see if new scoring info is available.




**Returns:** `Promise`.<`boolean`>
- Resolves to true if new info is available, false if not. Rejects with an Error.






___

<a id="sendping"></a>

###  sendPing

► **sendPing**(): `Promise`.<`string`>



*Defined in shared/interface.ts:113*



Send a ping command to the scoring server. This is used to verify the connection is still open.




**Returns:** `Promise`.<`string`>
- Resolves to 'Echo' when connected or rejects with an error.






___

<a id="sendscore"></a>

###  sendScore

► **sendScore**(): `Promise`.<[IScoreInfo](_shared_interface_.fllscoreclient.iscoreinfo.md)>



*Defined in shared/interface.ts:127*



Request the scoring info from the scoring server. This is both returned in the promise and stored on the client.




**Returns:** `Promise`.<[IScoreInfo](_shared_interface_.fllscoreclient.iscoreinfo.md)>
- Resolves to the current score info, rejects with an error.






___


