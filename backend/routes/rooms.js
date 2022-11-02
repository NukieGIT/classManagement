const db = require('../db')
const Response = require("../utils/Response")
const Utils = require('../utils/Ubackend')

const getRooms = async (req, res) => {
    let conn
    const response = new Response()
    try {
        conn = await db.pool.getConnection()
        const query =
        `SELECT rooms.room_num, COUNT(pcs.id) AS pc_count
        FROM rooms
        LEFT JOIN pcs
        ON rooms.uuid=pcs.room_uuid
        GROUP BY rooms.room_num
        ORDER BY COUNT(pcs.id) DESC`
        const result = await conn.query(query)

        response.values = Utils.toJsonBigInt(result)
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

module.exports = getRooms