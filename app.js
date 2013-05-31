
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , approute = require('./routes/app')
  , api = require('./routes/api')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'the new york reds and kops'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//App Routes
app.get('/app', api.isAuthenticated, approute.index);

//API Routes
	//	Get
	app.get('/api/account', api.allAccount);
	app.get('/api/account/:id', api.showAccount);
	app.get('/api/session', api.session);
	app.get('/api/loan/:id', api.loanGet);
	//	Post
	app.post('/api/account', api.newAccount);
	app.post('/api/account/deposite', api.depositeAccount);
	app.post('/api/account/withdraw', api.withdrawAccount);
	app.post('/api/loan', api.loanPost);
	
	//	Put/Patch Update
	app.put('/api/account/:id', api.editAccount);
	
	//	Delete 
	app.delete('/api/account/:id', api.deleteAccount);
	
//login
app.post('/login', api.login);

//logout
app.get('/logout', api.logout);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
