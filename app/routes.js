// app/routes.js
module.exports = function(app, passport) {



	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	var connection = mysql.createConnection(dbconfig.connection);

	connection.query('USE ' + dbconfig.database);



	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		//res.render('home.ejs', {user: req.user}); // load the index.ejs file
		res.render('home.ejs', { message: req.flash('signupMessage'), message2: req.flash('loginMessage')});
	});

	// process the login form
	app.post('/signin', passport.authenticate('local-login', {
            successRedirect : '/mypage', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/mypage');
    });

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/mypage', // redirect to the secure profile section
		failureRedirect : '/error', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/mypage', isLoggedIn, function(req, res) {

		connection.query("SELECT * FROM msv_friends WHERE user1 = ?",[req.user['email']], function(err, rows) {
        if (err)
            return done(err);
        if (rows.length) {
        	console.log("[mypage] 친구있음");
        	res.render('mypage', {
				user: req.user, result: rows});
        } 
        else
        {
        	console.log("[mypage] 친구없음");
        	res.render('mypage', {
				user: req.user, result: null});
        }
    	});	
	});

	app.get('/error', isLoggedIn, function(req, res) {
	res.render('error.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/myvideo', isLoggedIn, function(req, res) {
	res.render('myvideo.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/videostore',isLoggedIn, function(req, res) {
	res.render('videostore.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/uploadvideo',isLoggedIn, function(req, res) {
	res.render('uploadvideo.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});


	// 채팅
	app.get('/startchat',isLoggedIn, function(req, res){
	res.render('startchat.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});


	// 친구 추가 관련
	app.post('/addFriend', function(req, res){

		var friendEmail = req.body.friendEmail;
		console.log("email: "+friendEmail);

		connection.query("SELECT * FROM msv_users WHERE email = ?",[friendEmail], function(err, rows) {
        if (err)
            return done(err);
        if (rows.length) {

        	connection.query("select * from msv_friends where user1 = ? and user2 = ?", [req.user['email'], friendEmail], function(err, rows){
        		if(err)
        			return done(err);
        		if(rows.length){
        			console.log("[addfirend] 이미 친구 있음");
        			//res.send(req.flash('addfriendMessage', 'Already Friends!'));
        			//res.render('mypage', {
					//	user : req.user, addfriendMessage: "Already Friends!"});
        		}
        		else{
		            var insertQuery = "INSERT INTO msv_friends (user1, user2) values (?,?)";
		            connection.query(insertQuery,[req.user['email'], friendEmail],function(err, rows) {
		           	
		            console.log("addfirend] 친구추가 성공!");
		            });
        		}
        	});

        } else {
        	//req.flash('addfriendMessage', 'That email is not exists');
        	console.log("addfirend] email is not exists");
        }

        res.redirect('/mypage');
    });
	});
	
	//
	var fs = require('fs');

	app.post('/upload', function(req, res) {
	    var fstream;
	    req.pipe(req.busboy);
	    req.busboy.on('file', function (fieldname, file, filename) {
	        console.log("Uploading: " + filename); 
	        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
	       	console.log("Uploading finish: " + filename); 

	        file.pipe(fstream);
	        fstream.on('close', function () {
	            res.redirect('back');
	        });

	    });
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
