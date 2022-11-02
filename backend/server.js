// const http = require("http")
const express = require('express')
const db = require('./db')
const app = express()
const port = 5823

const getPcInfo = require('./routes/pc')
const getPcs = require('./routes/pcs')
const verifyToken = require('./routes/verifyToken')
const getUsers = require('./routes/users')
const signin = require('./routes/signin')
const signup = require('./routes/signup')
const getPerms = require('./routes/perms')
const getRooms = require('./routes/rooms')

const verifyJWT = require('./middleware/verifyJWT')
const checkPerms = require('./middleware/permsCheck')
 
function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(allowCrossDomain)


app.get('/users', getUsers)

app.post('/signin', signin)

app.get('/perms', [verifyJWT, checkPerms("admin")], getPerms)

app.post('/signup', [verifyJWT, checkPerms(["admin", "Head Teacher"])], signup)

app.get('/rooms', verifyJWT, getRooms)


app.get('/pcs', verifyJWT, getPcs)

app.get('/pcs/:pc', verifyJWT, getPcInfo)

app.get('/verifyToken', verifyJWT, verifyToken)


app.listen(port, () => console.log(`Listening on port ${port}`));