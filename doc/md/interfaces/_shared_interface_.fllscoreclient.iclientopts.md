[fllscoreclient](../README.md) > ["shared/interface"](../modules/_shared_interface_.md) > [FLLScoreClient](../modules/_shared_interface_.fllscoreclient.md) > [IClientOpts](../interfaces/_shared_interface_.fllscoreclient.iclientopts.md)



# Interface: IClientOpts


The configuration options for the local client.


## Properties
<a id="host"></a>

### «Optional» host

**●  host**:  *`undefined`⎮`string`* 

*Defined in shared/interface.ts:144*



The host to connect to (can be an ip address).
*__default__*: localhost





___

<a id="name"></a>

### «Optional» name

**●  name**:  *`undefined`⎮`string`* 

*Defined in shared/interface.ts:150*



The name which the scoring software should register the client as.
*__default__*: FLLScoreClient





___

<a id="port"></a>

### «Optional» port

**●  port**:  *`undefined`⎮`number`* 

*Defined in shared/interface.ts:156*



The port which the socket should connect.
*__default__*: 25002





___

<a id="usewatchdog"></a>

### «Optional» useWatchdog

**●  useWatchdog**:  *`undefined`⎮`true`⎮`false`* 

*Defined in shared/interface.ts:163*



Whether or not to start a watchdog heartbeat to automatically check the status of connection and keep it alive. (should almost aways be true).
*__default__*: true





___


