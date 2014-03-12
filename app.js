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

var configDB = require('./lib/database.js');

var app = express();
var port = process.env.PORT || 3000;

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./lib/passport')(passport);

// set up our express application
app.use(express.logger('dev')); // log every request to the console
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(express.bodyParser()); // get information from html forms

app.use(stylus.middleware({ src: __dirname + '/public', compile: function (str) {
        return stylus(str).set('filename', path).use(nib());
    }
}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// required for passport
app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// dynamically include routes (Controller)
fs.readdirSync('./controller').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        route = require('./controller/' + file);
        route(app, passport);
    }
});

// launch ======================================================================
app.listen(port);
console.log('Express server listening on port ' + port);