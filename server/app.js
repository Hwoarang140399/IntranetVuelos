import express from 'express'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes';
import cors from 'cors';
// import session from 'express-session';
import passport from 'passport';
import { createServer } from 'http';
import socketIO from './socketio';
import './database';
import './middleware/passport';
// import secrets from './secret';

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {

  const app = express();
  const server = createServer(app);
  socketIO(server);

  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(cors({credentials:true}));
  // 
  /* const sessionMiddleware = session({
    secret: secrets.expressSession.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: (60*60*1000) }
  }); */
  /* socketIO(server,sessionMiddleware);
  app.use(sessionMiddleware);
  app.use(passport.session()); */
  
  app.use('/api', routes);
  app.use('/public/airlines',express.static(__dirname+'/uploads/airlines'));
  app.use('/public/users',passport.authenticate('jwt-public',{session:false}),express.static(__dirname+'/uploads/usersImg'));
  app.use('/public/contracts/logos',passport.authenticate('jwt-publicA',{session:false}),express.static(__dirname+'/uploads/contractImg'));
  app.use('/public/contracts/files',passport.authenticate('jwt-publicA',{session:false}),express.static(__dirname+'/uploads/contractFiles'));
  
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(process.env.PORT || port, process.env.HOST || host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
