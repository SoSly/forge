import 'reflect-metadata';
import config from '@domain/Config';
import DatabaseService from '@service/DatabaseService';
import DiscordService from '@service/DiscordService';
import WebService from '@service/WebService';

(async function main(): Promise<void> {
    try {
        const db = new DatabaseService(config);
        await db.start();

        const ds = new DiscordService(config);
        await ds.start();
      
        const ws = new WebService(config);
        await ws.start();
        
        console.log('service started');
        
        process.on('SIGINT', shutdown(db, ds, ws))
        process.on('SIGTERM', shutdown(db, ds, ws));
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

function shutdown(db: DatabaseService, ds: DiscordService, ws: WebService): () => Promise<void> {
    return async function(): Promise<void> {
        console.log('shutting down');
        setTimeout(() => {
            console.log('shutdown timeout exceeded');
            process.exit(1)
        }, 1000);
        
        await ds.stop();
        await ws.stop();
        await db.stop();
        process.exit(0);
    }
}
