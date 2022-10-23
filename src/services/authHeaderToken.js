export default function authHeaderToken() {
    return Object.freeze({
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
}