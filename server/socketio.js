import socketIO from 'socket.io';
import fs, { read } from 'fs';
import path from 'path';
import User from './models/userSchema';

// export default function(server,sessionMiddleware){
export default function(server){   
    const io = socketIO(server);
    let sockets = {};
    let users = {};
    
    /* io.use(function(socket, next){
        sessionMiddleware(socket.request, {}, next);
    }); */

    /* io.on('connection',function(socket){
        sockets[socket.request.sessionID]=socket.id;
        socket.on('login', async (val) => {
            users[socket.request.sessionID]=val;
            const user = await User.findById(val);
            user.isActive = true;
            await user.save()
        });

        socket.on('logout',(val)=>{
            for(let key in users){
                if(users[key]==val){
                    delete users[key];
                }
            }
        });

        socket.on('isAbsent',(val)=>{
            console.log(`The user ${val.id} is absent`)
        });

        socket.on('return',(val)=>{
            console.log(`The user ${val.id} has return`)
        });

        socket.on('findImg',(val)=>{
            let readStream = fs.createReadStream(path.join(__dirname,val),{
                encoding:'binary'
            }),chunks=[];
            readStream.on('data',(chunk)=>{
                chunks.push(chunk);
            });
            readStream.on('end',()=>{
                socket.emit('imgFound',chunks)
            });
        });

        socket.on('getImgUser',(val)=>{
            let readStreamUser = fs.createReadStream(path.join(__dirname,val.img),{
                encoding:'binary'
            }),chunksUser=[];
            readStreamUser.on('data',(chunk)=>{
                chunksUser.push(chunk);
            });
            readStreamUser.on('end',()=>{
                socket.emit('imgFoundUser',{id:val.id,chunk:chunksUser})
            });
        });

        socket.on('disconnect', async (val)=>{
            if(users[socket.request.sessionID]!=undefined){
                const user = await User.findById(users[socket.request.sessionID]);
                user.lastLogout = Date.now();
                user.isActive = false;
                await user.save();
                delete users[socket.request.sessionID];
            }
            delete sockets[socket.request.sessionID];
        });
    }); */
}