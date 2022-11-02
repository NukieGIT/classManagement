const db = require('../db')

const Response = require("../utils/Response")

function checkPerms(reqPerms = ["teacher"]) {
    return async (req, res, next) => {
        if (!Array.isArray(reqPerms)) reqPerms = [ reqPerms ]
        const response = new Response()
        const user = req.user

        if (user == undefined) {
            res.status(401)
            res.send(response)
            return
        }

        try {
            conn = await db.pool.getConnection()
            const query = "SELECT permissions FROM users WHERE uuid = ?; SHOW COLUMNS FROM users LIKE 'Permissions'"
            const result = await conn.query(query, [user.uuid])

            const perm = result[0][0].permissions

            let perms = result[1][0]['Type']
            perms = perms.match(/'.*?'/g)
            perms = perms.map(val => val.replace(/[']+/g, ''))


            let anyPermGood = false
            for (const reqPerm of reqPerms) {
                if (reqPerm == perm) {
                    res.status(200)
                    anyPermGood = true
                    next()
                    break
                } else {
                    res.status(401)
                }
            }
            if (!anyPermGood) {
                response.tooltip = "Nie posiadasz potrzebnych uprawnień aby wykonać tę operację"
                res.send(response)
                return
            }

        } catch (err) {
            res.status(500)
            console.log(err)
            response.errors = err
            res.send(response)
        } finally {
            if (conn) {
                conn.release()
            }
        }
    }
}

module.exports = checkPerms