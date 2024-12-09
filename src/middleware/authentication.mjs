import bcrypt from 'bcrypt'
import { getError } from '../errors/error.mjs';
const BASIC = "Basic ";
export function authenticate(accountingService) {
    return async (req, res, next) => {
        const authHeader = req.header("Authorization")
        if (authHeader) {
            if (authHeader.startsWith(BASIC)) {
                await basicAuth(authHeader, req, accountingService)
            }
        }
        next();
    }
}
export function auth(...skipRoutes) {
    return (req, res, next) => {
        if (!skipRoutes.includes(JSON.stringify({ path: req.path, method: req.method }))) {
            if (!req.user) {
                throw getError(401, "");
            }

        }
        next();
    }
}
async function basicAuth(authHeader, req, accountingService) {
    const userPasswordBase64 = authHeader.substring(BASIC.length);
    const userPasswordAscii = Buffer.from(userPasswordBase64, 'base64').toString("ascii");
    const [username, password] = userPasswordAscii.split(":");
    const { SET_ROLE_USERNAME, SET_ROLE_PASSWORD } = process.env;
    if (SET_ROLE_USERNAME == username && SET_ROLE_PASSWORD == password) {
        req.user = username;
        req.role = "ADMIN";
    } else {
        try {
            const account = await accountingService.getAccount(username);
            if (account && await bcrypt.compare(password, account.hashPassword)) {
                req.user = account._id;
                req.role = account.role || "USER";
            }
        } catch (error) {

        }
    }
}
