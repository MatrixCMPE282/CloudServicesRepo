//hello
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , register = require('./routes/Register')
  , dashboard = require('./routes/dashboard')
  , tester = require('./routes/tester')
  , appdeveloper= require('./routes/appdeveloper')//neelam
  , path = require('path');

var app = express();
app.use(express.cookieParser());
app.use(express.session({secret:'mtaas',duration:30*60*1000}));

// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/tr_dashboard', dashboard.tr_dashboard);
app.get('/ap_dashboard', dashboard.ap_dashboard);
app.post('/signin', register.signin);
app.post('/signup', register.signup);
app.get('/snupform', register.ap_signup);
app.post('/logout', register.logout);
app.post('/test', tester.test);
app.get('/checkLogin', register.checkLogin);
app.post('/newpro',tester.newpro);
app.post('/nwpr_dec',tester.nwpr_dec);
app.post('/curpro', tester.curpro);
app.post('/profil', tester.profil);
app.post('/repbug',tester.repbug);
app.post('/bilpay',tester.bilpay);
app.post('/newProject',appdeveloper.newProject);//neelam
app.post('/findTester',appdeveloper.findTester);//neelam
app.post('/acceptTester',appdeveloper.acceptTester);//neelam
app.post('/billing',appdeveloper.billing); //dvora
app.post('/billingClosure',appdeveloper.billingClosure); 
app.post('/runningProjects',appdeveloper.runningProjects); 



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
