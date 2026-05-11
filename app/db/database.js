const {Pool} = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_CONNECTION
});

module.exports = pool;