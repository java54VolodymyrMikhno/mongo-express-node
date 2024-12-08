import bcrypt from 'bcrypt';
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

    try {
        const { SET_ROLE_USERNAME, SET_ROLE_PASSWORD } = process.env;
        const account = await accountingService.getAccount(username);
        if (username === SET_ROLE_USERNAME && password === SET_ROLE_PASSWORD) {
            req.user = SET_ROLE_USERNAME;
            req.role = 'ADMIN';
        } else if (account && await bcrypt.compare(password, account.hashPassword)) {
            req.user = account._id;
            req.role = account.role || 'USER';
        } else {
            throw getError(401, "Invalid username or password");
        }
    } catch (error) {
        throw getError(401, error.message || "Authentication failed");
    }
}
