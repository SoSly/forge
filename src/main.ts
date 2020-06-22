import 'reflect-metadata';
import config from '@domain/Config';
import DatabaseService from '@service/DatabaseService';
import WebService from '@service/WebService';

(async function main(): Promise<void> {
    try {
        const db = new DatabaseService(config);
        await db.start();
        const ws = new WebService(config);
        await ws.start();
        console.log('service started');
        
        process.on('SIGINT', shutdown(db, ws))
        process.on('SIGTERM', shutdown(db, ws));
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

function shutdown(db: DatabaseService, ws: WebService): () => Promise<void> {
    return async function(): Promise<void> {
        console.log('shutting down');
        setTimeout(() => {
            console.log('shutdown timeout exceeded');
            process.exit(1)
        }, 1000);
        await db.stop();
        await ws.stop();
        process.exit(0);
    }
}
