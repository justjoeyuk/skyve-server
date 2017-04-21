var constants = require('./models/constants')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var mongoose = require('mongoose');

var index = require('./routes/index');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var users = require('./routes/api/users');
var bookings = require('./routes/api/bookings');
var allocations = require('./routes/api/allocations');

var User = require("./models/user");
var app = express();


// MARK: View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// MARK: Standard Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'apidoc')));
app.use(express.static(path.join(__dirname, 'public')));


// MARK: Authorization Handlers

// we can use JWT in the headers of as queries
function extractJWT (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  else if (req.cookies.access_token) {
    return req.cookies.access_token
  }

  return null;
}

// use JWT authentication unless on specific paths
app.use(jwt({ secret: constants.JWT_SECRET, getToken: extractJWT }).unless({
  path: [/\/api\/users\/login/g, /\/docs.*/g, /\/auth.*/g]
}))

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).redirect('/auth/login');
    next(err)
  }
});

// convert the jwt-user into a mongoose user
app.use(function (req, res, next) {
  if (!req.user) { next(); return }

  req.user._doc["pwd"] = undefined
  var user = new User(req.user._doc)

  req.user = user
  next()
})

// checks for admin priviledge in the "/admin" pages
app.use('/admin', function (req, res, next) {
  if (!req.user) {
    res.redirect('/auth/login');
  }
  else if (req.user.acc_type != "admin") {
    var err = new Error('Unauthorized');
    err.status = 401;
    next(err);
  }
  else {
    next('route')
  }
})


// MARK: Endpoints

app.use('/', index)
app.use('/auth', auth)
app.use('/admin', admin)

app.use('/api/users', users);
app.use('/api/bookings', bookings)
app.use('/api/allocations', allocations)


// MARK: Error Handling

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
