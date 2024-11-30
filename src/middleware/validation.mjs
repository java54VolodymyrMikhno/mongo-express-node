import Joi from "joi"

const schemas = {
    '/mflix/comments': {
        PUT: Joi.object({
            commentId: Joi.string().hex().length(24).required(),
            text: Joi.string().required()
        }),
        POST: Joi.object({
            movie_id: Joi.string().hex().length(24).required(),
            text: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().email().required()
        }),
        DELETE: {
            params: Joi.object({
                id: Joi.string().hex().length(24).required()
            })
        },
        GET: {
            params: Joi.object({
                id: Joi.string().hex().length(24).required()
            })
        }
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

export default function validation(schema){
    return(req,res,next)=>{
        const schema = schemas[req.path]?.[req.method];
       if(schema){
        const{error}=schema.validate(req.body);
        req.validated = true;
        if(error){
            req.error_message=error.details[0].message;
        }
       }
       next()
    }
    
}