import Convict from 'convict';
import Path from 'path';

export default function config() {
    // Configuration definitions
    const config = Convict({
        HTTP: {
            host: {
                doc: 'The host name that the service will running on',
                format: String,
                default: 'localhost',
                env: 'HOST'
            },
            port: {
                doc: 'The port that the API will run on',
                format: 'port',
                default: 7400,
                env: 'PORT'
            },
            protocol: {
                doc: 'The protocol that the API will run on',
                format: String,
                default: 'http',
                env: 'PROTOCL'
            }
        },
        Discord: {
            client: {
                doc: 'The client ID for discord OAUTH',
                format: String,
                default: null,
                env: 'DISCORD_CLIENT_ID'
            },
            secret: {
                doc: 'The secret key for discord OAUTH',
                format: String,
                default: null,
                env: 'DISCORD_SECRET_KEY',
                sensitive: true,
            }
        }
    });
    
    // Load from file for local development
    const fileconfig = Path.join(process.cwd(), '.env.json');
    config.loadFile(fileconfig);

    // Validate and return
    config.validate({allowed: 'strict'});
    return config;
}
