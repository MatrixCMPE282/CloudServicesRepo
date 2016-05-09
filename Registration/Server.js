var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['register']);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var favicon = require('serve-favicon');
var path = require('path');
var http = require('http');
var hash = require('./pass').hash;

/*
Database and Models
*/
mongoose.connect("mongodb://localhost/contactlist");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    city: String,
    salt: String,
    hash: String
});

var User = mongoose.model('users', UserSchema);

/*
Middlewares and configurations 
*/
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Sputnik'));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
           // console.log("User exists");
            req.session.error = "User Exist";
            return res.status(500).json({status: 'User exists'});
        }
    });
}

/*
Helper Functions
*/
function authenticate(name, pass, fn) {
    //if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

app.post("/register", userExist, function (req, res) {
    var password = req.body.password;
    var username = req.body.username;
    var email = req.body.email;
    var city = req.body.city;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            email: email,
            city: city,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.username, password, function(err, user){
                if (err) {
                    return res.status(500).json({err: err});
                }
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        return res.status(200).json({status: 'Registration successful!',username: newUser.username, email:newUser.email, city:newUser.city});
                    });
                }
            });
        });
    });
});

app.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                //console.log(req.session.user.username);
                //console.log(req.session.user.city);
                //console.log(req.session.user.email);
                return res.status(200).json({status: 'Login successful!',username: req.session.user.username, email:req.session.user.email, city:req.session.user.city});
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            return res.status(500).json({status: 'Invalid Username/Password'});
        }
    });
});


app.post("/first", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                //req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/index');
        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.status(200).json({status: 'Done!'});
    });
});

app.listen(3000);
console.log("server running on port 3000");