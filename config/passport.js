module.exports = function(app) {

    var passport = require('passport');
    var passportLocal = require('passport-local');
    var expressSession = require('express-session');
    var mongoose = require('mongoose');
    var User = require('../DBmodel/user.js');


    app.use(expressSession({
        secret: process.env.SESSION_SECRET || 'jitesanand',
        resave: false,
        saveUninitialized: false
    }));

    // var db = mongoose.connection;
    // db.on('error', console.error);
    // db.once('open', function() {
    // 	console.log("Connected to DB");
    // 	var User = mongoose.model('User');
    // });

    app.use(passport.initialize());
    app.use(passport.session());


    // route middleware to make sure a user is logged in
    // function isLoggedIn(req, res, next) {
    //     // if user is authenticated in the session, carry on 
    //     if (req.isAuthenticated())
    //         return next();
    //     // if they aren't redirect them to the home page
    //     res.redirect('/');
    // }


    passport.use('local-signin', new passportLocal.Strategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({
                email: email
            }, function(err, user,info) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { alert: 'Incorrect UserName,Please try again.' });
                }
                if (user.password != password) {
                    return done(null, false, { alert: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }));

    passport.use('local-signup', new passportLocal.Strategy({ email: 'email', password: 'password', passReqToCallback: true }, function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({ email: email }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, { alert: 'This email/User Name is already registered' });
                } else {
                    var usr = new User();
                    usr.email = req.body.email;
                    usr.password = req.body.password;
                    usr.userName = req.body.userName;
                    usr.save(function(err) {
                        if (err) {
                            //return done(err);
                            throw err;
                        } else {
                            return done(null, usr);
                        }
                    });
                }

            });
        });
    }));


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // function verifyAuthenticated(req, res, next) {
    //     if (req.isAuthenticated()) {

    //         next();
    //     } else {
    //         res.redirect('/')
    //     }
    // }


	// app.get('/dashboard', isLoggedIn, function(req, res) {
 //        res.render('dashboard.ejs', {
 //            user : req.user // get the user out of session and pass to template
 //        });
 //    });

    app.post('/signin', passport.authenticate('local-signin'), function(req, res) {
        console.log('executed signin');
        res.json(req.user);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.send(200);
    });

    app.post('/signup', passport.authenticate('local-signup', { 
    	successRedirect: '/dashboard',
    	failureRedirect: '/home'
     }));


};
