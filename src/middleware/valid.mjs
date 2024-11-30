import { VALIDATION_ERROR } from "../errors/error.mjs"

export default function valid(){
  return (req, res, next) => {
    if (req.validated && req.error_message
    ) {
      throw VALIDATION_ERROR(req.error_message)
    } 
    next()
  }
}