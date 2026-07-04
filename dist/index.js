import { sneks } from './configs.js';
import runServer from './snek-codez/server.js';
function isObjKey(key, obj) {
    return key in obj;
}
const envConfig = process.env.SNEK_CONFIG || 'hangry';
const config = isObjKey(envConfig, sneks) ? sneks[envConfig] : sneks['hangry'];
// const config = envConfig in sneks
// ? sneks[snekConfig] : sneks['hangry']
runServer(config, parseInt(process.env.PORT || '8000'));
//# sourceMappingURL=index.js.map