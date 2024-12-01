import Joi from "joi"

export const schemas = {
    '/mflix/comments': {
        PUT: Joi.object({
            commentId: Joi.string().hex().length(24).required(),
            text: Joi.string().required()
        }),
        POST: Joi.object({
            email: Joi.string().email().required(),
            movie_id: Joi.string().hex().length(24).required(),
            text: Joi.string().required()
        })
    },
    '/mflix/movies/rated': {
        POST: Joi.object({
            year: Joi.number().optional(),
            genre: Joi.string().optional(),
            acter: Joi.string().optional(),
            amount: Joi.number().required()
        })
    }
};


export default function validation(schemas) {
    return (req, res, next) => {
        const schema = schemas[req.path]?.[req.method];
        if (schema) {
            const { error } = schema.validate(req.body);
            if (error) {
                console.log(error.details); 
               req.validated = false;
                req.error_message = error.details[0].message;
            }else{
                req.validated = true;
            }
           
        } 
        next();
    };
   
}

