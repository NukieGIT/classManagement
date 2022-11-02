const db = require('../db')

const Response = require("../utils/Response")

const getPerms = async (req, res) => {
    let conn
    const response = new Response()
    const user = req.user

    try {
        conn = await db.pool.getConnection()
        const query = "SHOW COLUMNS FROM users LIKE 'Permissions'"
        const result = await conn.query(query, [user.uuid])

        let perms = result[0]['Type']
        perms = perms.match(/'.*?'/g)
        perms = perms.map(val => val.replace(/[']+/g, ''))

        response.values = perms

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

module.exports = getPerms