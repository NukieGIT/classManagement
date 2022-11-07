const db = require('../db')

const Response = require("../utils/Response")

const getStates = async (req, res) => {
    let conn
    const response = new Response()

    try {
        conn = await db.pool.getConnection()
        const query = "SHOW COLUMNS FROM pcs_state LIKE 'condition'"
        const result = await conn.query(query)

        let states = result[0]['Type']
        states = states.match(/'.*?'/g)
        states = states.map(val => val.replace(/[']+/g, ''))

        response.values = states

    } catch (err) {
        res.status(500)
        console.log(err);
        response.errors = err
    } finally {
        if (conn) {
            conn.release()
        }
        res.send(response)
    }
}

module.exports = getStates