const config = require('./config');
const logger = require('log4js').getLogger('app');
const path = require('path');

const express = require('express');

const app = express();

const server = require('http').createServer(app);

server.listen(config.port);

const methodOver = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// uncomment after placing your favicon in /public
app.use(cookieParser());
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// allow overriding methods in query (?_method=put)
app.use(methodOver('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  logger.debug('\n----------- New Request ---------\n%s: %s\nquery: %s\nbody: %s\n--------------------------------- ', req.method, req.originalUrl, JSON.stringify(req.query), JSON.stringify(req.body));
  next();
});

app.use('/', require('./routers/index'));
