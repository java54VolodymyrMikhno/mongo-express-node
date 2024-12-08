import { getError } from "../errors/error.mjs";

const userRequest = {};
const handleUserRequest = (username, USER_LIMIT, USER_TIME_WINDOW) => {
    const currentTime = Date.now();
    const requestTimes = userRequest[username] || [];
    const filteredTimes = requestTimes.filter(time => time > currentTime - USER_TIME_WINDOW * 1000);
    filteredTimes.push(currentTime);
    userRequest[username] = filteredTimes;

    if (filteredTimes.length > USER_LIMIT) {
        throw getError(429, "Too many requests");
    }
};
export function rateLimit() {
   
    return (req, res, next) => {
        const { role, user: username } = req;
        const { USER_LIMIT, USER_TIME_WINDOW } = process.env;

        if (role === "ADMIN") {
            throw getError(403, "");
        } else if (role === "USER") {
            handleUserRequest(username, USER_LIMIT, USER_TIME_WINDOW);
        } else {
            return next()
        }
        next();
    };
}