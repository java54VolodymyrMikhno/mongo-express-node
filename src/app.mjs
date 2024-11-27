import express from 'express';
import MflixService from './service/MflixService.mjs'
const app = express();
const port = process.env.PORT || 3500;
const mflixService = new MflixService(process.env.MONGO_URI, process.env.DB_NAME,
    process.env.MOVIES_COLLECTION, process.env.COMMENTS_COLLECTION)
const server = app.listen(port);
server.on("listening", ()=>console.log(`server listening on port ${server.address().port}`));
app.use(express.json());
app.post("/mflix/comments", async (req, res) => {
    const commentDB = await mflixService.addComment(req.body);
    res.status(201).end(JSON.stringify(commentDB));
});
app.put("/mflix/comments", async (req, res) => {
    
    const comment = await mflixService.updateComment(req.body);
    res.status(200).end(JSON.stringify(comment));

});
app.delete("/mflix/comments/:id", async (req, res) => {
    
   const comment = await mflixService.deleteComment(req.params.id);
    res.status(200).end(JSON.stringify(comment));
})
app.get("/mflix/comments/:id", async (req, res) => {
   
   const comment = await mflixService.getComment(req.params.id);
    res.status(200).end(JSON.stringify(comment));
})
app.post("/mflix/movies/rated", async (req, res) => {
    
   const movies = await mflixService.getRatedMovies(req.body);
    res.status(200).end(JSON.stringify(movies));

})
