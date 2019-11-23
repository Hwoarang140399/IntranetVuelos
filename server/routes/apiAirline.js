import {Router} from 'express';
import * as airlineController from '../controller/apiAirline';
import passport from 'passport';

const checkAuth = passport.authenticate('jwt-auth',{session:false});
const checkAuthAdmin = passport.authenticate('jwt-auth-admin',{session:false});
const app = Router();

// A logged user can check the basic info of airlines
app.get('/fixed', checkAuth, airlineController.fixed);
app.get('/find/:text', checkAuth, airlineController.getAirlinesQuery);

// User must be a Admin
app.get('/', checkAuthAdmin, airlineController.getAirlines);
app.post('/', checkAuthAdmin, airlineController.createAirline);

export default app;