const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const session = require('express-session');

require('./db.js');

const server = express();

server.name = 'API';

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  // res.header('Content-Security-Policy', "style-src 'self' https://www.gstatic.com 'unsafe-inline' *.mercadopago.com");
  res.header('Content-Security-Policy', "script-src 'nonce-5fdqtuzg9t7TxPuYTvFClA==' 'strict-dynamic' 'unsafe-eval' 'report-sample' https: 'unsafe-inline' https://http2.mlstatic.com; style-src 'self' https://www.gstatic.com 'unsafe-inline'");
  next();
});
server.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: 'none',
      secure: true
    }
  }));
server.use('/', routes);

//Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;