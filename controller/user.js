module.exports = function(app, passport) {

	/**************************
	 * GET
	 **************************/
	app.get('/user/login', function(req, res) {
		res.render('user/login', { message: req.flash('loginMessage') });
	});

	app.get('/user/logout', function(req, res) {
		req.session.destroy()
		req.logout();
		res.redirect('/');
	});

	app.get('/user/register', function(req, res) {
		res.render('user/register', { message: req.flash('signupMessage') });
	});

	app.get('/user/profile', isLoggedIn, function(req, res) {
		res.render('user/profile', {
			user: req.user
		});
	});

	/**************************
	 * POST
	 **************************/
	app.post('/user/register', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/user/register',
		failureFlash: true
	}));

	app.post('/user/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: true
	}));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the login page
	res.redirect('/user/login');
}