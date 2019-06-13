import {CreateWebClientSpec} from './unit/client/createWebClient.spec';
import {ConstantsSpec} from './unit/constants/constants.spec';
import {ClientSpec} from './unit/proxy/client.spec';
import {CreateClientSpec} from './unit/proxy/createClient.spec';
import {CreateWebProxySpec} from './unit/proxy/createWebProxy.spec';
import {WebProxySpec} from './unit/proxy/webProxy.spec';
import {WebClientSpec} from './unit/client/webClient.spec';

// Client Test Suite
CreateWebClientSpec.run();
WebClientSpec.run();

// Constants Test Suite
ConstantsSpec.run();

// Proxy Test Suite
ClientSpec.run();
CreateClientSpec.run();
CreateWebProxySpec.run();
WebProxySpec.run();
