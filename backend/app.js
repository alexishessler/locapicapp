var passport         = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
require('./models/bddconnect');
var UserModel = require('./models/user');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

passport.use(new FacebookStrategy({
    clientID: "",
    clientSecret: "",


    callbackURL: 'https://immense-cliffs-33805.herokuapp.com/auth/facebook/callback',


    profileFields: ['id', 'first_name', 'last_name', 'email', 'picture'],

    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    UserModel.findOne({facebookid: profile._json.id}, function(err, user){

      console.log("picture:", profile._json.picture);

      if(!user) {
        var newUser = new UserModel({
          firstname : profile._json.first_name,
          lastname: profile._json.last_name,
          email: profile._json.email,
          facebookid: profile._json.id
        });
        newUser.save();
      }
      var state = JSON.parse(req.query.state);

      //return done(null, {first_name : profile._json.first_name, last_name : profile._json.last_name, email : profile._json.email, id : profile._json.id , redirectUrl : state.redirectUrl});
      return done(null, {...profile._json, redirectUrl : state.redirectUrl});
    })
  }));

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
