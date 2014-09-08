// set up ======================================================================
// get all the tools we need
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var fs = require('fs');
var nib = require('nib');
var stylus = require('stylus');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('cookie-session');
var logger = require('morgan');

var configDB = require('./lib/database.js');

var app = express();

// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

require('./lib/passport')(passport);

// set up our express application
app.use(favicon);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser); // get information from html forms
app.use(cookieParser); // read cookies (needed for auth)
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ keys: ['ilovescotchscotchyscotchscotch', 'wtfsomuchswag'] })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// dynamically include routes (Controller)
fs.readdirSync('./controller').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        route = require('./controller/' + file);
        route(app, passport);
    }
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// launch ======================================================================
module.exports = app;
