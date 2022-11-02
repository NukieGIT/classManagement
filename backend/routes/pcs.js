const db = require('../db')

const Utils = require("../utils/Ubackend")
const Response = require("../utils/Response")

const getPcs = async (req, res) => {
    let conn
    const response = new Response()
    const showAll = (isNaN(parseInt(req.query.fromto[0])) || isNaN(parseInt(req.query.fromto[1])))
    const vals = showAll ? "" : "LIMIT ?, ?"

    try {
        conn = await db.pool.getConnection()
        const query =
        `SELECT
            pc.room_pos, 
            pc.uuid,
            ${Utils.genConcatArr("pcSt.description", `ORDER BY pcSt.date DESC ${vals}`)} as 'desc',
            ${Utils.genConcatArr("DATE_FORMAT(pcSt.date, '%Y-%m-%d')", `ORDER BY pcSt.date DESC ${vals}`)} as 'date',
            ${Utils.genConcatArr("TIME_FORMAT(pcSt.date, '%H:%i')", `ORDER BY pcSt.date DESC ${vals}`)} as 'hour',
            ${Utils.genConcatArr("pcSt.condition", `ORDER BY pcSt.date DESC ${vals}`)} as 'condition',
            (pcSt.pc_uuid IS NOT NULL) AS 'exists'
        FROM pcs pc
        LEFT JOIN pcs_state pcSt
            ON pc.uuid = pcSt.pc_uuid
        INNER JOIN rooms rm
            ON rm.uuid = pc.room_uuid
        WHERE rm.room_num = ?
        GROUP BY pc.room_pos`

        const queryParams = showAll ? [req.query.room] :
        [
            parseInt(req.query.fromto[0]), parseInt(req.query.fromto[1]),
            parseInt(req.query.fromto[0]), parseInt(req.query.fromto[1]),
            parseInt(req.query.fromto[0]), parseInt(req.query.fromto[1]),
            parseInt(req.query.fromto[0]), parseInt(req.query.fromto[1]),
            req.query.room
        ]

        const result = await conn.query(query, queryParams)
        
        response.values = result
    } catch (err) {
        res.status(500)
        response.errors = err
        console.log(err);
    } finally {
        if (conn) {
            conn.release()
        }
        res.send(response)
    }
}

module.exports = getPcs