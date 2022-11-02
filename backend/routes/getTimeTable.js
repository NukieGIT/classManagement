const timetable = require('../data/Timetable.json')

const getTimeTable = (req, res) => {
    res.json(timetable)
}

module.exports = getTimeTable