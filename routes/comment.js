var express     = require('express');
var router      = express.Router();
var CampGrounds = require('../models/campground');
var Comment     = require('../models/comment');

router.get('/campGrounds/:id/comments/new',isLoggedIn,  function(req,res) {
    CampGrounds.findById(req.params.id, function(err, foundcampgrd) {
        if(err) {
            console.log(err);
        } else {
            res.render('comment/new.ejs', {campground : foundcampgrd});
        }
    });

});

router.post('/campGrounds/:id/comments', isLoggedIn, function(req,res) {
    CampGrounds.findById(req.params.id, function(err, foundcampgrd) {
        if(err) {
            console.log(err);
        } else {
            Comment.create(
                {
                    text : req.body.ncommenttext,
                    author : req.body.ncommentauthor
                }, function(err, newcomment) {
                    if(err) {
                        console.log(err);
                    } else {
                        req.flash('success', 'Comment created');
                        newcomment.author.id = req.user._id;
                        newcomment.author.username = req.user.username;
                        newcomment.save();
                        foundcampgrd.comments.push(newcomment);
                        foundcampgrd.save();
                        res.redirect('/campGrounds/' + req.params.id);
                    }
                });
        }
    });
});

router.get('/campGrounds/:id/comments/:comment_id/edit', checkCommentOwnership, function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect('back');
        } else {
            res.render('comment/edit.ejs', {campground_id : req.params.id, comment : foundComment});

        }
    });
});

router.put('/campGrounds/:id/comments/:comment_id/edit', checkCommentOwnership, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,
        {
            text : req.body.ncommenttext
        }, function(err) {
        if(err) {
            console.log(err);
        } else {
            req.flash('success', 'comment edited');
            res.redirect('/campGrounds/' + req.params.id);
        }
    });
});

router.delete('/campGrounds/:id/comments/:comment_id', checkCommentOwnership, function(req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'comment deleted');
            res.redirect('/campGrounds/' + req.params.id);
        }
    })
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'you need to be logged in first');
    res.redirect('/login');
};

function checkCommentOwnership(req, res, next) {
      if(req.isAuthenticated()) {
          Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err) {
                    res.redirect('back');
                } else {
                    if(req.user._id.equals(foundComment.author.id)) {
                        next();
                    } else {
                        req.flash('error', 'You are not the owner');
                        res.render('back')
                    }
                }
          });
      } else {
          req.flash('error', 'You need to Login First');
          res.redirect('back');
      }
};

module.exports = router;