const db = require('../db')

const Response = require("../utils/Response")

const getPcInfo = async (req, res) => {
    let conn
    const response = new Response()
    try {
        conn = await db.pool.getConnection()
        const query =
        `SELECT 
            p.room_pos,
            pcSt.description,
            DATE_FORMAT(pcSt.date, '%Y-%m-%d') AS date,
            TIME_FORMAT(pcSt.date, '%H:%i') AS hour,
            pcSt.condition
        FROM pcs_state pcSt, rooms rm, pcs p
        WHERE pcSt.pc_uuid = p.uuid
            AND p.room_uuid = rm.uuid
            AND rm.room_num = ?
            AND p.uuid = ?
            ORDER BY pcSt.date DESC`
        const result = await conn.query(query, [req.query.room, req.params.pc])

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

module.exports = getPcInfo