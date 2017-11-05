var express     = require('express');
var router      = express.Router();
var CampGrounds = require('../models/campground');
var Comment     = require('../models/comment');
var User        = require('../models/user');
var passport    = require('passport');

//get request to home page
router.get("/", function(req, res) {
    res.render("landing.ejs");
});

router.get('/register', function(req, res) {
    res.render('register.ejs');
});

router.post('/register', function(req,res) {
    User.register(new User({username:req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req,res,function() {
                req.flash('success', 'Succesfully Signed Up');
                res.redirect('/campGrounds')
            })
        }
    });
})

router.get('/login', function(req,res) {
        res.render('login.ejs');
});

router.post('/login',passport.authenticate('local', {
    successRedirect : '/campGrounds',
    failureRedirect : '/login'
}), function(req,res)  {
    req.flash('success', 'Logged In');
});

router.get('/logout', function(req,res) {
    req.logout();
    req.flash('success', 'Succesfully Logged OUT');
    res.redirect('/campGrounds');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
        req.flash('error', 'You need to login first'),
        res.redirect('/login');
};

module.exports = router;