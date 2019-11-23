import {Router} from 'express';
import * as airportController from '../controller/apiAirport';
import passport from 'passport';

const checkAuth = passport.authenticate('jwt-auth',{session:false});
const checkAuthAdmin = passport.authenticate('jwt-auth-admin',{session:false});
const app = Router();

// A logged user can check the basic info of airlines
app.get('/fixed', checkAuth, airportController.fixed);
app.get('/find/:text', checkAuth, airportController.getAirportsQuery);

// User must be a Admin
app.get('/', checkAuthAdmin, airportController.getAirports);
/* app.post('/', checkAuthAdmin, airportController.createAirport); */
app.post('/', airportController.createAirport);

export default app;