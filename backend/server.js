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

app.get('/perms', [verifyJWT, checkPerms(["admin"])], async (req, res) => {
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

app.get('/verifyToken', verifyJWT, async (req, res) => {
    res.send(req.user)
})

// app.get('/verifyPerms', [verifyJWT, checkPerms()])

function checkPerms(reqPerms = ["teacher"]) {
    return async (req, res, next) => {
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


    // if (token === null) {
    //     response.errors = "No token present"
    //     res.status(401)
    // }
    
    // const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user) => {
    //     if (err) {
    //         response.errors = err
    //         res.status(403)
    //     }
    //     req.user = user
    //     next()
    // })


// app.get('/users', async (req, res) => {
//     let conn
//     const errors = { error: false, errorMsg: "" }
//     let out = { errors }
//     try {
//         conn = await db.pool.getConnection()
//         const rows = await conn.query("SELECT login FROM users")
//         out.data = rows
//         conn.release()
//     } catch (err) {
//         out.errors.error = true
//         out.errors.errorMsg = err
//         conn.release()
//         throw err;
//     } finally {
//         res.send(out)
//     }
// });

// app.post('/signin', async (req, res) => {
//     let conn
//     const errors = { error: false, errorMsg: "" }
//     let out = { errors }
//     try {
//         conn = await db.pool.getConnection()
//         const user = req.body.user
//         const pass = req.body.password

//         const stmt = "SELECT * FROM users WHERE Login = ?"
//         const rows = await conn.query(stmt, [user])
//         if (rows.length > 1) {
//             console.warn("possible breach or error")
//             out.errors.error = true
//             out.errors.errorMsg = "Błąd"
//         } else if (rows.length == 1) {
//             if (await argon2.verify(rows[0].Password, pass)) {

//                 const token = jwt.sign(
//                     { uuid: rows[0].uuid, login: rows[0].Login },
//                     process.env.JWT_TOKEN_KEY,
//                     { expiresIn: "2h" }
//                 )

//                 out.data = "Bearer " + token
//             } else {
//                 out.errors.error = true
//                 out.errors.errorMsg = "Niepoprawne hasło"
//             }
//         } else {
//             out.errors.error = true
//             out.errors.errorMsg = "Taka nazwa użytkownika nie istnieje"
//         }

//         conn.release()
//     } catch (err) {
//         out.errors.error = true
//         out.errors.errorMsg = err
//         conn.release()
//         throw err;
//     } finally {
//         res.send(out)
//     }
// })

// app.get('/perms', verifyJWT, async (req, res) => {
//     let conn
//     let errorMsg = undefined
//     let data = undefined
    
//     try {
//         conn = await db.pool.getConnection()

//         const stmt = "SHOW COLUMNS FROM users LIKE 'Permissions'"
//         const result = await conn.query(stmt)
//         let resFormat = result[0]['Type']
//         resFormat = resFormat.match(/'.*?'/g)

//         resFormat = resFormat.map(val => val.replace(/[']+/g, ''))

//         data = resFormat

//     } catch (err) {
//         errorMsg = err
//         console.warn(err);
//     } finally {
//         res.send({ data, errorMsg })
//         conn.release()
//     }
// })

// app.post('/signup', verifyJWT, async (req, res) => {
//     let conn
//     const errors = { error: false, errorMsg: "" }
//     let out = { errors }

//     try {
//         conn = await db.pool.getConnection()
//         const login = req.body.login
//         const hash = await hashPass(req.body.password)
//         const perms = req.body.perms
//         const fname = req.body.fname
//         const lname = req.body.lname

//         const stmt = "INSERT INTO users(id, uuid, Login, Password, Permissions, FirstName, LastName) VALUES (NULL, UUID(), ?, ?, ?, ?, ?)"
//         const result = await conn.query(stmt, [login, hash, perms, fname, lname])

//         out.data = "success"
//         conn.release()
//     } catch (err) {
//         out.errors.error = true
//         out.errors.errorMsg = err
//         conn.release()
//         throw err;
//     } finally {
//         res.send(out)
//     }
// })

// app.get('/validateToken', verifyJWT, async (req, res) => {
//     res.sendStatus(200)
// })

// async function verifyJWT(req, res, next) {
//     const authHeader = req.headers["authorization"]
//     const token = authHeader ? authHeader.split(" ")[1] : null
//     if (token === null) {
//         res.sendStatus(401)
//         return
//     }
    
//     const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user) => {
//         if (err) {
//             res.sendStatus(403)
//             return
//         }
//         req.user = user
//         next()
//     })
// }

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