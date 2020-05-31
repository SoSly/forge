import Config from './domain/Config.js';
import WebService from './services/WebService.js';

(async function main() {
    const config = Config();
    const ws = new WebService(config);

    async function stop() {
        setTimeout(1000, process.exit(1));
        await ws.stop();
        process.exit(0);
    }
    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
})();
