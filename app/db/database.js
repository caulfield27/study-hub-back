const {Pool} = require("pg");
const { DATABASE_CONNECTION } = require("../utils/getEnv");

console.log('connection string: ', DATABASE_CONNECTION, process.env.DATABASE_CONNECTION)
const pool = new Pool({
    connectionString: DATABASE_CONNECTION
});

module.exports = pool;