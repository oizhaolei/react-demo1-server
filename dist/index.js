'use strict';

var config = require('./config');
var logger = require('log4js').getLogger('app');
var path = require('path');

var express = require('express');

var app = express();

var server = require('http').Server(app);

server.listen(config.port);

var methodOver = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// uncomment after placing your favicon in /public
app.use(cookieParser());
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// allow overriding methods in query (?_method=put)
app.use(methodOver('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  logger.debug('\n----------- New Request ---------\n%s: %s\nquery: %s\nbody: %s\n--------------------------------- ', req.method, req.originalUrl, JSON.stringify(req.query), JSON.stringify(req.body));
  next();
});

app.use('/', require('./routers/index'));