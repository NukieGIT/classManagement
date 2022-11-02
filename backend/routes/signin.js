const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

const db = require('../db')
const Response = require("../utils/Response")

const signin = async (req, res) => {
    let conn
    const response = new Response()
    const login = req.body.login
    const password = req.body.password

    try {
        conn = await db.pool.getConnection()
        const query = "SELECT * FROM users WHERE login = ?"
        const result = await conn.query(query, [login])

        if (result.length > 1) {
            response.errors = "db error"
            res.status(500)
        } else if (result.length == 1) {

            if (await argon2.verify(result[0].password, password)) {
                const token = jwt.sign(
                    { uuid: result[0].uuid, login: result[0].login },
                    process.env.JWT_TOKEN_KEY,
                    { expiresIn: "1h" }
                )
                response.values = "Bearer " + token
            } else {
                response.tooltip = "Niepoprawne dane"
                res.status(422)
            }
        } else {
            response.tooltip = "Niepoprawne dane"
            res.status(422)
        }
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

module.exports = signin