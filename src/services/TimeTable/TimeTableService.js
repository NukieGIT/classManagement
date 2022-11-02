import axios from "axios";

let timetable
axios.get('http://localhost:5823/timetable').then(res => timetable = res.data)

export default class TimeTable {
    static getClassID(time) {
        for (let i = 0; i < timetable.length; i++) {
            if (time < timetable[i].Time[0]) {
                if (time > timetable[i-1]?.Time[1] && time < timetable[i].Time[0]) {
                    return `Podczas przerwy (${time}), następna lekcja: ${timetable[i].classID}`
                }
                continue
            }
            if (time < timetable[i].Time[1]) {
                return `${timetable[i].classID} (${time})`
            }
        }
        return `Poza planem lekcji (${time})`
    }

}