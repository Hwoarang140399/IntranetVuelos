import {Router} from 'express';
import passport from 'passport';
import User from '../models/userSchema';
import path from 'path';
import multer from 'multer';
import { unlink } from 'fs-extra';
import nodemailer from 'nodemailer';
import { v4 } from 'uuid';
import secrets from './../secret';
import emailContent from './../emails';
import JWT from 'jsonwebtoken';


const app = Router();

const storage = multer.diskStorage({
    destination: path.join(__dirname,'..','uploads','usersImg'),
    filename(req,file,cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null,true);
    else 
        cb(null,false);
};

const upload = multer({storage,fileFilter}).single('userImg');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: secrets.emailManageUsers.user,
        pass: secrets.emailManageUsers.pass
    }
});

/* app.get('/testing',passport.authenticate('jwt',{session:false}),(req,res)=>{
    console.log(req)
    res.json({status:'ok'})
}); */

app.post('/login',
    (req,res)=>{
        passport.authenticate('local-login',{session:false},(err,user,info)=>{
            if (err) { return res.status(500).json(err); }
            if (!user) { return res.status(500).json(info); }
            req.logIn(user,{session:false}, function(err) {
                if (err) { return res.json(err); }
                const userToSend = {_id:user._id,name:user.name,lastName:user.lastName,email:user.email,username:user.username,capability:user.capability,gender:user.gender,userImg:user.userImg,lastLogout:user.lastLogout,isActive:user.isActive}
                const token = JWT.sign(userToSend,secrets.passportJWT,{
                    expiresIn: '14d'
                })
                return res.json({token}); 
            });
        })(req, res);
    }
);

/* app.get('/logout',
    (req,res,next)=>{
        if(req.isAuthenticated()) { next(); }
        else {
            return res.status(500).json({error: 'There isnt a session to logout.'});
        }
    }, 
    async (req,res)=>{
        const user = await User.findById(req.user._id);
        user.lastLogout = Date.now();
        user.isActive = false;
        await user.save()
        req.logout();
        res.json({status:'Log out successfully'});
    }
); */

app.post('/forgot', async (req,res)=>{
    await User.findOne({
        $or: [
            {email:req.body.email},
            {username: req.body.email}
        ]
    }, async (err,user) => {
        if(err) { return res.status(500).json({message: 1}); }
        if(!user) { return res.status(500).json({message: 1}); }
        let a = user.email;
        let b = a.split('@');
        let c = b[1].split('.');
        let d = '';
        for(let i in c){ d+='***.'}
        let e = b[0].slice(0,3)+'*****'+b[0].slice(-2)+'@'+c[0].slice(0,2)+d.slice(0,-1)+c[c.length-1].slice(-2);
        if(user.resetPasswordToken==undefined){
            user.resetPasswordToken = v4();
            user.resetPasswordExpires = Date.now() + 1800000;
            await user.save();
            const mailOptions = {
                from: secrets.emailManageUsers.user,
                to: user.email,
                subject: `Password reset to Travelmax's intranet`,
                html: emailContent.forgotPassword(user)
            }
            transporter.sendMail(mailOptions)
                .then((info)=>{
                    return res.json({status: 1, email:e});
                })
                .catch((err)=>{
                    return res.status(500).json({message: 2});
                })
        } else {
            if(Date.now()<user.resetPasswordExpires){
                if(req.body.resend){
                    const mailOptions = {
                        from: secrets.emailManageUsers.user,
                        to: user.email,
                        subject: `Password reset to Travelmax's intranet`,
                        html: emailContent.forgotPassword(user)
                    }
                    transporter.sendMail(mailOptions)
                        .then((info)=>{
                            return res.json({status: 3, email:e});
                        })
                        .catch((err)=>{
                            return res.status(500).json({message: 2});
                        })
                } else {
                    res.json({status:2,email:e})
                }
            } else {
                user.resetPasswordToken = v4();
                user.resetPasswordExpires = Date.now() + 1800000;
                await user.save();
                const mailOptions = {
                    from: secrets.emailManageUsers.user,
                    to: user.email,
                    subject: `Password reset to Travelmax's intranet`,
                    html: emailContent.forgotPassword(user)
                }
                transporter.sendMail(mailOptions)
                    .then((info)=>{
                        return res.json({status: 1, email:e});
                    })
                    .catch((err)=>{
                        return res.status(500).json({message: 2});
                    })
            }
        }
        
    });
});

app.get('/reset/:token',async (req,res)=>{
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    });
    if (!user) {
        return res.status(500).json({error: 'Password reset token is invalid or has expired.'});
    }
    return res.json({user: user.id });
});

app.post('/reset', async (req,res) => {
    const user = await User.findById(req.body.user);
    user.password = await user.encryptPassword(req.body.password);
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    user.lastPwdChange = Date.now();
    await user.save();
    const mailOptions = {
        from: secrets.emailManageUsers.user,
        to: user.email,
        subject: `Your password has been changed - Travelmax's intranet`,
        html: emailContent.confirmResetPassword(user)
    }
    transporter.sendMail(mailOptions)
        .then((info)=>{
            return res.json({email: user.email});
        })
        .catch((err)=>{
            return res.status(500).json({message: 1});
        })
});

app.use((req,res,next)=>{
    const auth = req.isAuthenticated();
    if(auth) {  next(); }
    else {
        return res.status(500).json({error: 'The user isnt authenticated.'});
    }
});

app.put('/login/:id',(req,res)=>{
    passport.authenticate('local-firstLogin',(err,user,info)=>{
        if (err) { return res.status(500).json(err); }
        if (!user) { return res.status(500).json(info); }
        res.json({status: `Welcome to travelmax ${user.username}!.`});
    })(req, res);
});

app.put('/:id',upload, async (req,res)=>{
    if(req.user._id==req.params.id || req.user.capability=='admin' || req.user.capability=='manager'){
        const user = await User.findById(req.params.id);
        for(const field in req.body){
            // if(field!=='password') { 
                user[field] = req.body[field] 
            /* }
            else { user[field] = await user.encryptPassword(req.body[field]) } */
        }
        user.save()
            .then(async (output)=>{
                const userFinal = await User.findById(req.params.id)
                if(req.file){
                    if(userFinal.userImg!='defaultMale.jpg' && userFinal.userImg!='defaultFemale.jpg'){
                        unlink(path.join(__dirname,'..','uploads','usersImg',userFinal.userImg)) 
                    }
                    const userFinalImg = req.file.filename; 
                    userFinal.userImg = userFinalImg;
                }
                userFinal.save()
                    .then((output)=>{
                        res.json({img: req.file.filename})
                    })
                    .catch((error)=>{
                        res.status(500).json({message: 1});
                    })
            })
            .catch((error)=>{
                unlink(path.join(__dirname,'..','uploads','usersImg',req.file.filename));
                res.status(500).json({message: Object.keys(error.errors)});
            })
    } else {
        res.json({message:0})
    } 
});

app.put('/data/:id', async (req,res)=>{
    if(req.user._id==req.params.id || req.user.capability=='admin' || req.user.capability=='manager'){
        const user = await User.findById(req.params.id);
        for(const field in req.body){
            if(field!=='password') { 
                if(req.body[field]!=null){
                    user[field] = req.body[field]
                }
            }
            else { 
                user[field] = await user.encryptPassword(req.body[field]) 
            }
        }
        user.save()
            .then(async (output)=>{
                if(req.body['password']){
                    const mailOptions = {
                        from: secrets.emailManageUsers.user,
                        to: user.email,
                        subject: `Your password has been changed - Travelmax's intranet`,
                        html: emailContent.confirmResetPassword(user)
                    }
                    transporter.sendMail(mailOptions)
                        .then((info)=>{
                            return res.json({email: user.email});
                        })
                        .catch((err)=>{
                            return res.status(500).json({message: 1});
                        })
                } else {
                    res.json({status: 'Contact updated'})
                }
            })
            .catch((error)=>{
                res.status(500).json({message: Object.keys(error.errors)});
            }) 
    } else {
        res.json({message:0})
    }
})

/* 

const mailOptions = {
        from: secrets.emailManageUsers.user,
        to: user.email,
        subject: `Your password has been changed - Travelmax's intranet`,
        html: emailContent.confirmResetPassword(user)
    }
    transporter.sendMail(mailOptions)
        .then((info)=>{
            return res.json({email: user.email});
        })
        .catch((err)=>{
            return res.status(500).json({message: 1});
        })

*/

/* 
app.get('/status',(req,res)=>{
    res.json(req.user);
});
*/

app.get('/find/:username', async(req,res)=>{
    const user = await User.findOne({username:req.params.username},{password:0,capability:0,_id:0,lastPwdChange:0});
    res.json(user);
});

/* app.post('/edit', upload, (req,res)=>{
    passport.authenticate('local-signup', (err,user,info)=>{
        if (err) { 
            unlink(path.resolve('./uploads/usersImg/'+req.file.filename));
            return res.status(500).json(err); 
        }
        if (!user) { 
            unlink(path.resolve('./uploads/usersImg/'+req.file.filename));
            return res.status(500).json(info); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                unlink(path.resolve('./uploads/usersImg/'+req.file.filename));
                return res.json(err); 
            }
            return res.json({status: `The user ${user.username} has been created.`});
        });
    })(req, res);
}); */

app.use((req,res,next)=>{
    if(req.user.capability==='admin' || req.user.capability==='manager') { next(); }
    else {
        return res.status(500).json({error: "The user doesn't have the privileges."});
    }
});

app.get('/findone/:username', async(req,res)=>{
    const user = await User.findOne({username:req.params.username},{_id:1});
    res.json(user);
});

app.get('/', async(req,res)=>{
    const users = await User.find({},{password:0});
    res.json(users);
}); 

app.post('/signup', (req,res)=>{
    passport.authenticate('local-signup', (err,user,info)=>{
        if (err) { 
            return res.status(500).json(err); 
        }
        if (!user) { 
            return res.status(500).json(info); 
        }
        return res.json({status:'ok'})
    })(req, res);
});

app.delete('/:username', async(req,res)=>{
    User.findOneAndDelete({username: req.params.username})
        .then((output)=>{
            unlink(path.join(__dirname,'..',output.userImg))
            res.json({status: `The user ${output.username} has been deleted.`});
        })
        .catch((error)=>{
            res.json({status: `The user ${req.params.username} cannot be found.`});
        })
});

export default app;