import MongoConnection from '../mongo/MongoConnection.mjs'
import { ObjectId } from 'mongodb'
export default class MflixService {
    #moviesCollection
    #commentsCollection
    #connection
    constructor(uri, dbName, moviesCollection, commentsCollection){
        this.#connection = new MongoConnection(uri, dbName);
        this.#moviesCollection = this.#connection.getCollection(moviesCollection);
        this.#commentsCollection = this.#connection.getCollection(commentsCollection);
        
    }
    shutdown() {
        this.#connection.closeConnection();
    }
    async addComment(commentDto) {
        
        const commentDB = this.#toComment(commentDto);
        const result = await this.#commentsCollection.insertOne(commentDB);
        commentDB._id = result.insertedId;
        return commentDB;
    }
    #toComment(commentDto) {
        const movieId = ObjectId.createFromHexString(commentDto.movie_id);
        return {...commentDto,'movie_id': movieId}
    }
    async updateComment(commentDto) {
        const commentId = ObjectId.createFromHexString(commentDto.commentId);
        const result = await this.#commentsCollection.updateOne(
            { _id: commentId },
            { $set: { text: commentDto.text } }
        );
        return { _id: commentId, text: commentDto.text };
    
    }
    async deleteComment(id) {
        const commentId = ObjectId.createFromHexString(id);
        const result = await this.#commentsCollection.deleteOne({ _id: commentId });
        return result.deletedCount;
    }
    async getComment(id) {
        const result = await this.#commentsCollection.findOne({_id: ObjectId.createFromHexString(id)});
        return result;
    }
    async getRatedMovies(ratedMoviesDto) {
        const matchCriteria = {
            year: ratedMoviesDto.year || { $exists: true },
            cast: ratedMoviesDto.actor || { $exists: true }
        };
        if (ratedMoviesDto.actor) {
            matchCriteria.cast = { $regex: ratedMoviesDto.actor, $options: "i" }; 
        }

        const pipeline = [
            {
              '$match': matchCriteria
              
            }, {
              '$unwind': {
                'path': '$genres'
              }
            }, {
              '$unwind': {
                'path': '$cast'
              }
            }, {
              '$limit': ratedMoviesDto.amount || 10
            }, {
              '$sort': {
                'imdb.rating': -1
              }
            }, {
              '$project': {
                'title': 1, 
                'year': 1, 
                'genres': 1, 
                'cast': 1, 
                'imdb.rating': 1, 
                '_id': 0
                
              }
            }
          ];

        const result = await this.#moviesCollection.aggregate(pipeline).toArray();
        return result;
    }

}