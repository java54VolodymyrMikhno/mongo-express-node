export function getError(code=500,message="unknown server error"){
    return {
        code,
        message
    }
}
export const NOT_FOUND = () => getError(404, 'Resource not found');
export const BAD_REQUEST = (message) => getError(400, message || 'Bad request');
export const VALIDATION_ERROR = (message) => getError(400, message || 'Validation error');
