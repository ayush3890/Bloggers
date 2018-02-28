var express         = require("express"),
	app             = express(),
	bodyParser      = require("body-parser"),
	mongoose        = require('mongoose'),
    passport		= require('passport'),
    localStrategy	= require('passport-local'),
	methodOverride	= require('method-override'),
	flash			= require('connect-flash'),
	CampGrounds     = require('./models/campground'),
	Comment     	= require("./models/comment"),
	User			= require('./models/user');
mongoose.Promise    = global.Promise;
mongoose.connect('mongodb://ayush3890:ayush3890@ds151908.mlab.com:51908/bloggers');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(flash());

app.use(methodOverride('_method'));
var commentRoutes 		= require('./routes/comment'),
    campgroundRoutes 	= require('./routes/campground'),
    indexRoutes 		= require('./routes/index');


app.use(require('express-session')({
    secret 				: 'Hi there im ayush jain',
    resave 				: false,
    saveUninitialized 	: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.error  	    = req.flash('error');
    res.locals.success      = req.flash('success');
    next();
});

app.use(commentRoutes);
app.use('/campGrounds', campgroundRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT | "3000", function() {
	console.log("Yelp Camp Server has Started");
});
