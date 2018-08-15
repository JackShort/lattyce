import express from 'express';
import path from 'path';
import { 
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import postgraphile from 'postgraphile';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

import cors from 'cors';
import db from './src/db';

import passport from './passport';
import { User, Entity, Graph, Nodes, Links } from './src/models';
import { schema } from './src/schema';

const PORT = 4000;

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

server.use('*', cors({ origin: 'http://localhost:3000' }));
server.use('*', cors({ origin: 'http://localhost:3000/login' }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

server.use(passport.initialize());
server.use(flash());
server.use(passport.session()); server.use(express.static(path.join(__dirname, '../build')));

server.get('/', (req, res) => {
  res.send('that shit worked');
})

server.post('/login', passport.authenticate('local-login', { failureFlash: true }), (req, res, next) => {
  req.session.save((err) => {
    if (err) {
        return next(err);
    }

    res.status(200).send('OK');
  });
});

server.post('/register', passport.authenticate('local-signup', {
  failureFlash: true,
}), (req, res, next) => {
  req.session.save((err) => {
    if (err) {
        return next(err);
    }

    res.status(200).send('OK');
  }); 
});

server.get('/login', (req, res) =>{
  res.send('login did not work');
});

server.get('/register', (req, res) =>{
  res.send('register did not work');
});

server.get('/user', (req, res) => {
  console.log(req)
  if(req.user) {
		return res.status(200).json({
			user: req.user,
			authenticated: true
		});
	} else {
		return res.status(401).json({
			error: 'User is not authenticated',
			authenticated: false
		});
	}
});

server.get('/logout', (req, res) => {
  req.logout();
	req.session.save((err) => {
    if (err) {
      return next(err);
    }
      res.status(200).send('OK');
  });
});

// this is for postgres
// server.use(postgraphile('postgres://localhost:5432', 'public', {graphiql: true}));

// this is for the express server
db.sync();
server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
