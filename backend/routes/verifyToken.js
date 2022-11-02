async function verifyToken(req, res) {
    res.send(req.user);
}

module.exports = verifyToken