const pool = require("../db/database");

async function selectQuizes(){
    const result = await pool.query("SELECT id,name,complexity,img FROM quizes");
    return result.rows;
}

async function selectQuizById(id) {
    const query = "SELECT * FROM quizes WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {selectQuizes, selectQuizById};