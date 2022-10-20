// const http = require("http")
const express = require('express')
const db = require('./db')
const app = express()
const port = 5823
// const crypto = require('crypto')
const argon2 = require('argon2')
const { uuidv4 } = require('uuid')
 
function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(allowCrossDomain)
 
app.get('/users', async (req, res) => {
    let conn
    const errors = { error: false, errorMsg: "" }
    let out = { errors }
    try {
        conn = await db.pool.getConnection()
        const rows = await conn.query("SELECT login FROM users")
        out.data = rows
        conn.release()
    } catch (err) {
        out.errors.error = true
        out.errors.errorMsg = err
        conn.release()
        throw err;
    } finally {
        res.send(out)
    }
});

app.post('/signin', async (req, res) => {
    let conn
    const errors = { error: false, errorMsg: "" }
    let out = { errors }
    try {
        conn = await db.pool.getConnection()
        const user = req.body.user
        const pass = req.body.password

        const stmt = "SELECT * FROM users WHERE Login = ?"
        const rows = await conn.query(stmt, [user])
        if (rows.length > 1) {
            console.warn("possible breach or error")
            out.data = "Błąd"
        } else if (rows.length == 1) {
            if (await argon2.verify(rows[0].Password, pass)) {
                out.data = "Zalogowano"
            } else {
                out.data = "Niepoprawne hasło"
            }
        } else {
            out.data = "Taka nazwa użytkownika nie istnieje"
        }

        conn.release()
    } catch (err) {
        out.errors.error = true
        out.errors.errorMsg = err
        conn.release()
        throw err;
    } finally {
        res.send(out)
    }
})

app.post('/signup', async (req, res) => {
    let conn
    const errors = { error: false, errorMsg: "" }
    let out = { errors }
    try {
        conn = await db.pool.getConnection()
        const login = req.body.login
        const hash = await hashPass(req.body.password)
        const fname = req.body.fname
        const lname = req.body.lname

        const stmt = "INSERT INTO users(id, uuid, Login, Password, FirstName, LastName) VALUES (NULL, UUID(), ?, ?, ?, ?)"
        const result = await conn.query(stmt, [login, hash, fname, lname])

        out.data = "success"
        conn.release()
    } catch (err) {
        out.errors.error = true
        out.errors.errorMsg = err
        conn.release()
        throw err;
    } finally {
        res.send(out)
    }
})

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