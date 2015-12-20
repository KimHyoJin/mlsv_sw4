// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		//res.render('home.ejs', {user: req.user}); // load the index.ejs file
		res.render('home.ejs', { message: req.flash('signupMessage')});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/mypqge', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
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
	res.render('mypage.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/error', isLoggedIn, function(req, res) {
	res.render('error.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/myvideo', function(req, res) {
	res.render('myvideo.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/videostore', function(req, res) {
	res.render('videostore.ejs', {
		user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/uploadvideo', function(req, res) {
	res.render('uploadvideo.ejs', {
		user : req.user // get the user out of session and pass to template
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
