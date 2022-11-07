const db = require('../db')
const Response = require("../utils/Response")

const addState = async (req, res) => {
    let conn
    const response = new Response()
    const user = req.user

    const pcUUID = req.body.pcUUID
    const desc = req.body.desc
    const date = req.body.date
    const condition = req.body.condition

    try {
        conn = await db.pool.getConnection()

        const query = "INSERT INTO `pcs_state`(`id`, `uuid`, `pc_uuid`, `user_uuid`, `description`, `date`, `added_at`, `condition`) VALUES (NULL, UUID(), ?, ?, ?, ?, NULL, ?)"
        const result = await conn.query(query, [pcUUID, user.uuid, desc, date, condition])


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

module.exports = addState