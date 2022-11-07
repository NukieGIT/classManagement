import axios from "axios";

let timetable
axios.get('http://localhost:5823/timetable').then(res => timetable = res.data)

export default class TimeTable {
    static getClassID(time) {
        for (let i = 0; i < timetable.length; i++) {
            if (time < timetable[i].Time[0]) {
                if (time > timetable[i-1]?.Time[1] && time < timetable[i].Time[0]) {
                    return {
                        "time": timetable[i].Time,
                        "timeGiven": time,
                        "class": timetable[i].classID,
                        "error": "Podczas przerwy"
                    }
                }
                continue
            }
            if (time <= timetable[i].Time[1]) {
                return {
                    "time": timetable[i].Time,
                    "timeGiven": time,
                    "class": timetable[i].classID,
                    "error": null
                }
            }
        }
        return {
            "time": null,
            "timeGiven": time,
            "class": null,
            "error": "Poza planem lekcji"
        }
    }

    static getTime(classNum) {
        for (let i = 0; i < timetable.length; i++) {
            if (timetable[i].classID == classNum) {
                return timetable[i].Time[0]
            }
        }
        return null
    }

    static formatTimeTable(result) {
        if (!result.error) {
            return `${result.class} (${result.timeGiven})`
        } else {
            if (result.class) {
                return `${result.error} (${result.timeGiven}), Następna lekcja: ${result.class}`
            }
            return `${result.error} (${result.timeGiven})`
        }
    }

    static getTimeTableLen() {
        return timetable.length
    }

}