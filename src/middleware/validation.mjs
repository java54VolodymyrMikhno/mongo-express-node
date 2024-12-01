
export default function validation(schemas) {
    return (req, res, next) => {
        const schema = schemas[req.path]?.[req.method];
        if (schema) {
            const { error } = schema.validate(req.body);
            req.validated = !error;
            if (error) {
                req.error_message = error.details[0].message;
            }
               } 
        next();
    };
   
}

