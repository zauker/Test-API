'use strict';

/**
 * Module dependencies.
 */
const config = require('config');
const fs = require('fs');
const express = require('express');
const boom = require('express-boom');
const bodyParser = require('body-parser');
const multer = require('multer');
//const logger = require('./app/lib/logger.js');

const fortuneRoutes = require('./app/routes/fortune.routes.js'); // rotte

const app = express();

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

/*********************
 * server handler
 *********************/

const http = require('http');

/*********************
 * express handler
 *********************/

// all environments
app.set('x-powered-by', false); // hide x-powered-by header!
app.use(boom());
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true; } }));
app.use(multer().array());

// Request tracker
app.use((req, res, next) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var date = new Date();
  var method = req.method;
  var protocol = req.protocol;
  var httpVersion = req.httpVersion;
  var path = req.path;
  var status = res.statusCode;
  var fullUrl = protocol + '://' + req.get('host') + req.originalUrl;
  var ua = req.get('User-Agent');
  console.log(`${ip} - [${date}] "${method} ${path} ${protocol}/${httpVersion}" ${status} "${fullUrl}" "${ua}"`);
  next();
});

//HANDLE ROUTES
app.use('/fortune', fortuneRoutes);

// Handle 404
app.use((req, res) => {
  console.error('page not found');
  res.boom.notFound();
});
// Handle 500
app.use((error, req, res, next) => {
  console.error('internal server error');
  console.error(error);
  res.boom.badImplementation();
 });

http.createServer(app)
  .listen(config.get('server.port'), () => {
    console.log(`Server started and listen on port ${config.get('server.port')}`);
});