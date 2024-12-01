import { getError } from "../errors/error.mjs";



export default function valid() {
    return (req, res, next) => {
        if (req._body) {
            if (req.error_message) {
                throw getError(401, req.error_message);
            }
            if (!req.validated) {
                throw getError(400, "Invalid request body");
            }
        }

        next();
    };
}
