const {Pool} = require("pg");
const { DATABASE_CONNECTION } = require("../utils/getEnv");

const pool = new Pool({
    connectionString: process.env.DATABASE_CONNECTION
});

module.exports = pool;