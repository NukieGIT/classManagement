import axios from "axios";
import authHeaderToken from "../services/authHeaderToken.js";

export default async function auth() {

    try {
        const res = await axios.get('http://localhost:5823/verifyToken', authHeaderToken())
        console.log(res.data);
        return true
    } catch (err) {
        console.log(err);
        return false
    }

}