const jwt = require('jsonwebtoken')

const Response = require("../utils/Response")

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

module.exports = verifyJWT