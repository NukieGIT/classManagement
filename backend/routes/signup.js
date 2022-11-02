const db = require('../db')
const Response = require("../utils/Response")
const Utils = require('../utils/Ubackend')

const signup = async (req, res) => {
    let conn
    const response = new Response()
    const user = req.user

    const login = req.body.login
    const password = req.body.password
    const userPerms = req.body.perms
    const fname = req.body.fname
    const lname = req.body.lname

    try {
        async function addUser(login, password, perms, fname, lname) {
            const hash = await Utils.hashPass(password)
            const query = "INSERT INTO users(id, uuid, login, password, permissions, firstName, lastName, added_by_uuid) VALUES (NULL, UUID(), ?, ?, ?, ?, ?, ?)"
            const result = await conn.query(query, [login, hash, perms, fname, lname, user.uuid])
            return result
        }

        conn = await db.pool.getConnection()
        
        addUser(login, password, userPerms, fname, lname)

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

module.exports = signup