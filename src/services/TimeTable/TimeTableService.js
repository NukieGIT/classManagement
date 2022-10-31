import timetable from "@/services/TimeTable/Timetable.json";

export default class TimeTable {
    static getClassID(time) {
        for (const elem of timetable) {
            if (time < elem.Time[0]) continue
            if (time < elem.Time[1]) {
                return elem.classID
            }
        }
        return `Poza planem lekcji (${time})`
    }

}