const {Pool} = require("pg");
const { DATABASE_CONNECTION } = require("../utils/getEnv");

const pool = new Pool({
    connectionString: DATABASE_CONNECTION
});

module.exports = pool;