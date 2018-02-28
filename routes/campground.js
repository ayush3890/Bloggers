var express     = require('express');
var router      = express.Router();
var CampGrounds = require('../models/campground');
var Comment     = require('../models/comment');

//get request to camp grounds page
router.get("/", function(req, res) {
    console.log(req.user);
    CampGrounds.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("index.ejs", {campgrounds : campgrounds});
        }
    });
});

// post request to campgrounds page
router.post('/',isLoggedIn,  function(req,res) {
    var newName = req.body.name;
    var newimage = req.body.image;
    var discreption = req.body.discreption;
    CampGrounds.create(
        {
            name:newName,
            image:newimage,
            description: discreption,
            likes : 0
        }, function(err, foundcampgrd){
            if(err){
                console.log(err);
            } else {
                req.flash('success', 'Campground created succesfully');
                foundcampgrd.author.id = req.user._id;
                foundcampgrd.author.username = req.user.username;
                foundcampgrd.save();
            }
        }
    );
    res.redirect('/campGrounds');
});

//get request from our form
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campground/new.ejs");
});

router.get("/:id", function(req, res){
    var idrecieved = req.params.id;
    CampGrounds.findById(idrecieved).populate("comments").exec(function(err, foundCampground) {
        res.render('campground/show.ejs', {campground : foundCampground});
    });
});

//edit
router.get('/:id/edit', checkOwnership, function(req,res) {
    CampGrounds.findById(req.params.id, function(err, foundcampground) {
        if(err) {
            console.log(err);
        } else {
            res.render('campground/edit.ejs', {foundcampground : foundcampground});
        }
    });
});

//Update
router.put('/:id', checkOwnership, function(req ,res) {
    console.log('reached' + req.params.id);
    CampGrounds.findByIdAndUpdate(req.params.id,
        {
            name : req.body.name,
            image : req.body.image,
            description : req.body.description
        }, function(err, updatedCampground) {
            if(err){
                console.log(err)
            } else {
                req.flash('success', 'Campground Updated');
                res.redirect('/campGrounds/' + req.params.id);
            }
        })
});

//destroy
router.delete('/:id', checkOwnership, function(req, res) {
    CampGrounds.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            req.flash('success', 'Campground Deleted');
            res.redirect('/campGrounds');
        }
    });
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Login First To make a new campground');
    res.redirect('/login');
};

function checkOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        CampGrounds.findById(req.params.id, function(err, foundcampground) {
            if(err) {
                console.log(err);
            } else {
                if(foundcampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You are not the owner of the Comment')
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to login first');
        res.redirect('back');
    }
}

module.exports = router;