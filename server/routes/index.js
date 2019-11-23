import { Router } from 'express';
import apiUser from './apiUser';
import apiAirline from './apiAirline';
import apiAirport from './apiAirport';
import apiContract from './apiContract';

const app = Router();

app.use('/user', apiUser);
app.use('/airline', apiAirline);
app.use('/airport',apiAirport);
app.use('/contract',apiContract);

export default app 