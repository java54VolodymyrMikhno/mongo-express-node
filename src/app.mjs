import express from 'express';
import { mflix_route } from './routes/mflix.mjs';
import {validateBody, valid} from './middleware/validation.mjs'
import { accounts_route } from './routes/accounts.mjs';
import { errorHandler } from './errors/error.mjs';
import schemas from './validation-schemas/schemas.mjs';
const app = express();
const port = process.env.PORT || 3500;

const server = app.listen(port);


server.on("listening", ()=>console.log(`server listening on port ${server.address().port}`));
app.use(express.json());
app.use(validateBody(schemas));
app.use(valid);
app.use('/mflix',mflix_route);
app.use('/accounts', accounts_route);
app.use(errorHandler);
