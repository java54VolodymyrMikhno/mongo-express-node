import { getError } from "../errors/error.mjs";



export default function valid() {
    return (req, res, next) => {
        if (req.error_message) {
            throw getError(
                400, 
                req.error_message 
            );
        }
        next();
    };
}
