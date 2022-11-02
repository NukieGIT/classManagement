const db = require('../db')
const Response = require("../utils/Response")

const getUsers = async (req, res) => {
    let conn
    const response = new Response()
    try {
        conn = await db.pool.getConnection()
        const query = "SELECT login from users"
        const result = await conn.query(query)

        response.values = result
    } catch (err) {
        res.status(500)
        response.errors = err
    } finally {
        if (conn) {
            conn.release()
        }
        res.send(response)
    }
}

module.exports = getUsers