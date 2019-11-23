import {Router} from 'express';
import * as contractController from '../controller/apiContract';
import uploadMulterContractFile from '../middleware/multercontractAddFile';
import uploadMulterContractLogo from '../middleware/multerContractAddLogo';
import passport from 'passport';

const app = Router();

//Middleware
const checkAuth = passport.authenticate('jwt-auth',{session:false});
const checkAuthAdmin = passport.authenticate('jwt-auth-admin',{session:false});


// A logged user can check the basic info of airlines
app.post('/search', checkAuth, contractController.searchCommission);

// User must be a Admin
app.post('/', checkAuthAdmin, contractController.createContract);
app.delete('/:id', checkAuthAdmin, contractController.deleteContract);
app.post('/upFile', checkAuthAdmin,uploadMulterContractFile,contractController.upFile);
app.post('/upLogo', checkAuthAdmin,uploadMulterContractLogo,contractController.upLogo);
app.get('/basicInfo', checkAuthAdmin, contractController.getContractsBasic);
app.get('/:id',checkAuthAdmin, contractController.getContractById);
/* 
app.get('/fill', checkAuthAdmin, contractController.fill);
app.get('/editContract', checkAuthAdmin, contractController.getContractOwners);
app.put('/:id', checkAuthAdmin, contractController.editContract);
app.get('/find/:id', checkAuthAdmin, contractController.findContract);*/

export default app;