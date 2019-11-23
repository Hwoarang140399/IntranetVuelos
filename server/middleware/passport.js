import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTStrategy} from 'passport-jwt';
import {ExtractJwt} from 'passport-jwt';
import User from '../models/userSchema';
import generator from 'generate-password';
import nodemailer from 'nodemailer';
import secrets from './../secret';
import emailContent from './../emails';
import Cookies from 'universal-cookie';

let cookieExtractor = function(req){
    let token = null;
    if(req && req.headers.cookie){
        const cookies = new Cookies(req.headers.cookie);
        token = cookies.get('token');
    }
    return token;
};

passport.use('jwt-public',new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secrets.passportJWT
}, async(jwtPayload,cb)=>{
    if(new Date().getTime()<jwtPayload.exp) { return cb(null,false,{message:1}) }
    try{
        const user = await User.findById(jwtPayload.id);
        if(!user) { return cb(null,false)}
        return cb(null,user._id)
    } catch(err) {
        return cb(err)
    }
}));

passport.use('jwt-publicA',new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secrets.passportJWT
}, async(jwtPayload,cb)=>{
    if(new Date().getTime()<jwtPayload.exp) { return cb(null,false,{message:1}) }
    try{
        const user = await User.findById(jwtPayload.id);
        if(!user) { return cb(null,false)}
        if(user.capability!='admin') { return cb(null,false)}
        return cb(null,user._id)
    } catch(err) {
        return cb(err)
    }
}));

passport.use('jwt-auth',new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secrets.passportJWT
}, async (jwtPayload, cb) =>{
    if(new Date().getTime()<jwtPayload.exp) { return cb(null,false,{message:1}) }
    try{
        const user = await User.findById(jwtPayload.id);
        if(!user) { return cb(null,false)}
        return cb(null,user)
    } catch(err) {
        return cb(err)
    }
}));

passport.use('jwt-auth-manager',new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secrets.passportJWT
}, async (jwtPayload, cb) =>{
    if(new Date().getTime()<jwtPayload.exp) { return cb(null,false,{message:1}) }
    try{
        const user = await User.findById(jwtPayload.id);
        if(!user) { return cb(null,false)}
        if(user.capability=='manager'||user.capability=='admin'){
            return cb(null,user)
        } else {
            return cb(null,false,{message:2})
        }
    } catch(err) {
        return cb(err)
    }
}));

passport.use('jwt-auth-admin',new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secrets.passportJWT
}, async (jwtPayload, cb) =>{
    if(new Date().getTime()<jwtPayload.exp) { return cb(null,false,{message:1}) }
    try{
        const user = await User.findById(jwtPayload.id);
        if(!user) { return cb(null,false)}
        if(user.capability=='admin'){
            return cb(null,user)
        } else {
            return cb(null,false,{message:2})
        }
    } catch(err) {
        return cb(err)
    }
}));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: secrets.emailManageUsers.user,
        pass: secrets.emailManageUsers.pass
    }
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'gender',
    passReqToCallback: true
}, async (req, email, gender, done) => {
    const password = generator.generate({length:10,numbers:true});
    const name = (email.split('@'))[0];
    let userTest = new User({
        username: name,
        email: email,
        name: name,
        capability: req.body.capability,
        lvlAgent: req.body.capability=='agent'?req.body.lvlAgent:undefined,
        password: password,
        gender: gender,
        creationDate: new Date(),
        userImg: gender=='male'?'defaultMale.jpg':'defaultFemale.jpg'
    })
    userTest.password = await userTest.encryptPassword(password);

    userTest.save()
        .then((output)=>{
            const mailOptions = {
                from: secrets.emailManageUsers.user,
                to: userTest.email,
                subject: `Welcome to Travelmax's intranet`,
                html: emailContent.signinEmail(userTest,password)
            }
            transporter.sendMail(mailOptions)
                .then((info)=>{
                    return done(null,userTest,{message: password})
                })
                .catch((err)=>{
                    return done(null,false,{message: 2})
                })
        })
        .catch((error)=>{
            return done(null,false,{message: 1});
        })
} ));

passport.use('local-forgot', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'email',
    passReqToCallback: true
}, async (req,email,done)=>{
    const user = await User.findOne({
        $or: [
            {email:email},
            {username: email}
        ]
    });
    if(!user) { return done(null,false,{message: `${email} cannot be found.`}); }

    return done(null,user);
} ));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    
    const user = await User.findOne({
        $or: [
            {email: email},
            {username: email}
        ]
    });

    if(!user) { return done(null,false,{message: 0, field: email}); }
    const comparedPassword = await user.comparePassword(password);
    if(!comparedPassword) { return done(null,false,{message: 1}); }
    user.isActive = true;
    await user.save();
    return done(null,user);
} ));

passport.use('local-firstLogin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findById(req.params.id,async function(err,user){
        if(err) { return done(null,false,{message: `${email} cannot be found.`}); }
        if(!user) { return done(null,false,{message: `${email} cannot be found.`}); }
        user.password = await user.encryptPassword(password);
        user.lastLogout = Date.now();
        user.lastPwdChange = Date.now();
        await user.save();
        return done(null,user);
    });
} ));