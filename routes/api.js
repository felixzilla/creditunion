"use strick";

//API Calls

var fs = require('fs')
	, mysql = require('mysql');


var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'creditunion'
});


exports.isAuthenticated = function(req, res, next) {
	if (req.session.user && req.session.user.isAuthenticated) {
		next();
	}else{
		res.redirect('/');
	}
};

exports.session = function(req, res) {
	if (req.session.user && req.session.user.isAuthenticated) {
		res.json(req.session.user);
	}
};

exports.allAccount = function(req, res) {
	var queryString = "SELECT accountid, firstname, lastname, address1, phone, accounttype, accountbalance FROM account";
		
	con.connect(function() {
		console.log('Connection Made for All account');
	});
	
	var query = con.query(queryString, function(err, result) {
		if (err) {throw err;}
		console.log(result);
		res.json(result);
	});
};

exports.newAccount = function(req, res) {
	var params = req.body
		, str = new Date().getTime()
		, id = 'ACN' + str
		, queryString = "INSERT INTO account SET ?";
		
	con.connect(function() {
		console.log('Connection Made for new account');
	});
		
	var values = {accountid: id
				, password: 'acnpass'
				, firstName: params.firstName
				, lastName: params.lastName
				, address1: params.address1
				, address2: params.address2
				, phone: params.phone
				, email: params.email
				, nkfullName: params.nextFullName
				, nkaddress: params.nextAddress
				, nkphone: params.nextPhone
				, accounttype: params.accountType
				, accountinitialdeposite: params.initialDeposite
				, accountBalance: params.initialDeposite
	};
	
	con.query(queryString, values, function(err, result) {
		if (err) {throw err;}
		res.json({id: id, success: true});
	});
};

exports.showAccount = function(req, res) {
	var params = req.params
				, queryString = "SELECT accountid, firstname, lastname, address1, phone, accounttype, accountbalance FROM account WHERE accountid = ?";
		
	con.connect(function() {
		console.log('Connection Made for show account');
	});
	
	var query = con.query(queryString, [params.id], function(err, result) {
		if (err) {throw err;}
		res.json(result[0]);
	});	
};

exports.editAccount = function(req, res) {
	res.json({success: true});
};

exports.deleteAccount = function(req, res) {
	res.json({success: true});
};

exports.depositeAccount = function(req, res) {
	var params = req.body
		, queryString1 = "INSERT INTO deposite SET ?"
		, queryString2 = "UPDATE account SET accountbalance = accountbalance + ? WHERE accountid = ?";
		
	con.connect(function() {
		console.log("MySQL Connection Made for Deposite");
	});
	
	var values = {
		accountid: params.accountid,
		depositeamount: params.deposite
	};
	
	var query = con.query(queryString1, values, function(err, result) {
		if (err) {throw err;}
		var q = con.query(queryString2, [params.deposite, params.accountid], function(err, result) {
			if (err) {throw err;}
			res.json({success: true});
		});
		console.log(q.sql);	
	});
	
	console.log(query.sql);
	
};

exports.withdrawAccount = function(req, res) {
	var params = req.body
		, queryString1 = "INSERT INTO withdraw SET ?"
		, queryString2 = "UPDATE account SET accountbalance = accountbalance - ? WHERE accountid = ?";
		
	con.connect(function() {
		console.log("MySQL Connection Made for Deposite");
	});
	
	var values = {
		accountid: params.accountid,
		withdrawamount: params.withdraw
	};
	
	var query = con.query(queryString1, values, function(err, result) {
		if (err) {throw err;}
		var q = con.query(queryString2, [params.withdraw, params.accountid], function(err, result) {
			if (err) {throw err;}
			res.json({success: true});
		});
		console.log(q.sql);	
	});
	
	console.log(query.sql);
};

exports.loanGet = function(req, res) {
	var params = req.params
		, queryString = "SELECT loanid, firstname, lastname, loanamount, loanperiod, firstpaymentdate FROM loan WHERE accountid = ?";
	
	con.connect(function() {
		console.log("MySQL Connection Made for Loan Get");
	});
	
	var query = con.query(queryString, [params.id], function(err, result) {
		if (err) {throw err;}
		res.json(result);
	});
};

exports.loanPost = function(req, res) {
	var params = req.body
		, queryString = "INSERT INTO loan SET ?";
		
	con.connect(function() {
		console.log('Connection Made for All account');
	});
	
	var values = {
		firstname: params.firstname,
		lastname: params.lastname,
		address: params.address,
		employer: params.employer,
		homephone: params.hphone,
		mobilephone: params.mphone,
		email: params.email,
		provident: params.provident,
		agriculture: params.agriculture,
		business: params.business,
		loanamount: params.loan,
		loanperiod: params.loanperiod,
		loandate: params.loandate,
		firstpaymentdate: params.firstpayment,
		accountid: params.guarantee
	}
	
	var query = con.query(queryString, values, function(err, result) {
		if (err) {throw err;}
		res.json({success: true, id: params.guarantee});
	});
	
	console.log(query.sql);
};


//login
exports.login = function(req, res) {
	var params = req.body
		, queryString = "SELECT username, password, logintype FROM login WHERE username = ? AND password = ?";
	
	var login = {
		username: params.username,
		password: params.password
	};
	
	var query = con.query(queryString, [login.username, login.password], function(err, result) {
		if (result.length > 0) {
			if (result[0].username == login.username && result[0].password == login.password) {
				req.session.user = {
					username: result[0].username,
					logintype: result[0].logintype,
					isAuthenticated: true
				};
			
				res.redirect('/app');
			}else{
				res.redirect('/');
			}
		}else{
				res.redirect('/');
		}
		
	});
	
	console.log(query.sql);
};

//logout
exports.logout = function(req, res) {
	req.session.user = null;
	res.redirect('/');
};



