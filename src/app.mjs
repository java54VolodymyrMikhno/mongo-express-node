import express from 'express';
import MflixService from './service/MflixService.mjs'
import asyncHandler from 'express-async-handler';
import validate, { schemas } from './middleware/validation.mjs'
import {getError} from './errors/error.mjs'
import valid from './middleware/valid.mjs';
const app = express();
const port = process.env.PORT || 3500;
const mflixService = new MflixService(process.env.MONGO_URI, process.env.DB_NAME,
    process.env.MOVIES_COLLECTION, process.env.COMMENTS_COLLECTION)
const server = app.listen(port);
server.on("listening", ()=>console.log(`server listening on port ${server.address().port}`));
app.use(express.json());
app.use(validate(schemas))
app.use(valid())

function errorHandler(error, req, res, next) {
    const err = error.code ? error : getError(500, error.message || "Unknown server error");
    res.status(err.code).end( err.message );
}


app.post("/mflix/comments", asyncHandler(async (req, res) => {
    const commentDB = await mflixService.addComment(req.body);
    res.status(201).end(JSON.stringify(commentDB));
}));
app.put("/mflix/comments", asyncHandler(async (req, res) => {
    const commentUpdated = await mflixService.updateCommentText(req.body);
    res.status(200).end(JSON.stringify(commentUpdated));
}));
app.delete("/mflix/comments/:id",asyncHandler( async (req, res) => {
   const deletedComment = await mflixService.deleteComment(req.params.id);
   res.status(200).end(JSON.stringify(deletedComment));
}))
app.get("/mflix/comments/:id",asyncHandler( async (req, res) => {
   const comment = await mflixService.getComment(req.params.id);
   res.status(200).end(JSON.stringify(comment));
}))
app.post("/mflix/movies/rated",asyncHandler( async (req, res) => {
   const movies = await mflixService.getMostRatedMovies(req.body);
   res.status(200).end(JSON.stringify(movies));
}))
app.use(errorHandler)