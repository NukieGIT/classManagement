// const http = require("http")
const express = require('express')
const db = require('./db')
const app = express()
const port = 5823
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
 
function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(allowCrossDomain)
 
class Response {
    constructor(values, errors, tooltip) {
        this.values = values
        this.errors = errors
        this.tooltip = tooltip
    }
}

app.get('/users', async (req, res) => {
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
})

app.post('/signin', async (req, res) => {
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
})

app.get('/perms', [verifyJWT, checkPerms("admin")], async (req, res) => {
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
})

app.post('/signup', [verifyJWT, checkPerms(["admin", "Head Teacher"])], async (req, res) => {
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
            const hash = await hashPass(password)
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

})

app.get('/rooms', verifyJWT, async (req, res) => {
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

        response.values = toJson(result)
    } catch (err) {
        res.status(500)
        response.errors = err
    } finally {
        if (conn) {
            conn.release()
        }
        res.send(response)
    }
})


app.get('/pcs', verifyJWT, async (req, res) => {
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
            CONCAT(
                '[',
                    GROUP_CONCAT(CONCAT(
                        '"',
                        pcSt.description,
                        '"'
                    ) ORDER BY pcSt.date DESC ${vals}),
                ']'
            ) as 'desc',
            CONCAT(
                '[',
                    GROUP_CONCAT(CONCAT(
                        '"',
                        DATE_FORMAT(pcSt.date, '%Y-%m-%d'),
                        '"'
                    ) ORDER BY pcSt.date DESC ${vals}),
                ']'
            ) as 'date',
            CONCAT(
                '[',
                    GROUP_CONCAT(CONCAT(
                        '"',
                        TIME_FORMAT(pcSt.date, '%H:%i'),
                        '"'
                    ) ORDER BY pcSt.date DESC ${vals}),
                ']'
            ) as 'hour',
            CONCAT(
                '[',
                    GROUP_CONCAT(CONCAT(
                        '"',
                        pcSt.condition,
                        '"'
                    ) ORDER BY pcSt.date DESC ${vals}),
                ']'
            ) as 'condition',
            (pcSt.pc_uuid IS NOT NULL) AS 'exists'
        FROM pcs pc
        LEFT JOIN (
            SELECT *
            FROM pcs_state
        ) pcSt
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
})

app.get('/pcs/:pc', verifyJWT, async (req, res) => {
    let conn
    const response = new Response()
    try {
        conn = await db.pool.getConnection()
        const query =
        `SELECT 
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
})

app.get('/verifyToken', verifyJWT, async (req, res) => {
    res.send(req.user)
})

// app.get('/verifyPerms', [verifyJWT, checkPerms()])

function checkPerms(reqPerms = ["teacher"]) {
    return async (req, res, next) => {
        if (!Array.isArray(reqPerms)) reqPerms = [reqPerms]
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
    

async function verifyJWT(req, res, next) {
    const response = new Response()
    const authHeader = req.headers["authorization"]
    
    if (authHeader == undefined) {
        response.errors = "No token present"
        res.status(401)
        res.send(response)
        return
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, user) => {
        if (err) {
            response.errors = err
            response.tooltip = true
            console.log(err);
            res.status(403)
            res.send(response)
            return
        }
        req.user = user
        next()
    })
}

function toJson(data) {
    if (data !== undefined) {
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
            .replace(/"(-?\d+)#bigint"/g, (_, a) => a);
    }
}


async function hashPass(pass) {
    try {
        const hash = await argon2.hash(pass, {
            type: argon2.argon2i
        })
        return hash
    } catch (error) {
        throw error
    }
}
 
app.listen(port, () => console.log(`Listening on port ${port}`));