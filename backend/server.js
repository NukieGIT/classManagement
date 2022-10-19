// const http = require("http")
const express = require('express')
const db = require('./db')
const app = express()
const port = 5823
const crypto = require('crypto')
 
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
        console.log(req.body);
        conn = await db.pool.getConnection()
        // const rows = await conn.query(`SELECT * FROM users WHERE Login = ${req.body.login} AND Password = ${sha512.update(req.body.password)}`)
        // out.data = rows
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
 
app.listen(port, () => console.log(`Listening on port ${port}`));