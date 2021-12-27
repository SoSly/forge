require('dotenv').config();

const join = require('path').join;

const config = {
    cli: {migrationsDir: 'src/migrations'},
    logging: true,
    migrations: [join(__dirname, 'src/migrations/{.ts,*.js}')],
    migrationsRun: true,
    synchronize: false,
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: (process.env.DATABASE_SSL == 'false') ? 'false' : undefined,
};
module.exports = config;
