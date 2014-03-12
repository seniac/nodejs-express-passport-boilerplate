module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
	app.get('/', function(req, res) {
		res.render('index');
	});

};