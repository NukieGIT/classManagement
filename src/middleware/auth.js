import axios from "axios";
import authHeaderToken from "../services/authHeaderToken.js";
import { useLoginState } from "../stores/loginState.js";

export default async function auth() {

    const loginState = useLoginState()

    try {
        const res = await axios.get('http://localhost:5823/verifyToken', authHeaderToken())
        console.log(res.data);
        return true
    } catch (err) {
        if (err.response.data.tooltip) {
            loginState.isJWTExpired(true)
        }
        console.log(err);
        return false
    }

}