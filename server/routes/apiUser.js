import {Router} from 'express';
import * as userController from '../controller/apiUser';
import uploadMulter from '../middleware/multerUserImg';
import passport from 'passport';
// import * as authJwt from '../middleware/auth';

const checkAuth = passport.authenticate('jwt-auth',{session:false});
const checkAuthManager = passport.authenticate('jwt-auth-manager',{session:false});
const app = Router();

//Don't need to be authenticated for this routes
app.post('/login', userController.login);
app.post('/forgot', userController.forgot);
app.get('/reset/:token', userController.resetToken);
app.post('/reset', userController.reset);

// User must be authenticated
app.get('/validtoken', checkAuth, userController.validToken);
app.put('/login/:id', checkAuth, userController.loginID);
app.put('/:id', checkAuth, uploadMulter, userController.editUser);
app.put('/data/:id', checkAuth, userController.editDataUser);
app.get('/find/:username', checkAuth, userController.findUser);

// User must be a Manager or Admin
app.get('/findone/:username', checkAuthManager, userController.getUserID);
app.get('/', checkAuthManager, userController.getUsers); 
app.post('/signup', checkAuthManager, userController.signUp);
app.delete('/:username', checkAuthManager, userController.deleteUser);

export default app;