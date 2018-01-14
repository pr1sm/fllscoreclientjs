import {CreateWebClientSpec} from './client/createWebClient.spec';
import {ConstantsSpec} from './constants/constants.spec';
import {ClientSpec} from './proxy/client.spec';
import {CreateClientSpec} from './proxy/createClient.spec';
import {CreateWebProxySpec} from './proxy/createWebProxy.spec';
import {WebProxySpec} from './proxy/webProxy.spec';
import {WebClientSpec} from './client/webClient.spec';

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
