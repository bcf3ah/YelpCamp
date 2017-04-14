var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, site){
        if (err){
            req.flash("error", "Uh oh! Campground not found!");
            res.redirect("back");
        } else {
            //check for Authorization
            if (site.author.id.equals(req.user._id)){
            next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Nice try. You need to be logged in to do that.");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentID, function(err, comment){
        if (err){
            req.flash("error", "Uh oh! Comment not found!");
            res.redirect("back");
        } else {
            //check for Authorization
            if (comment.author.id.equals(req.user._id)){
            next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else {
        res.redirect("back");
    }
};


module.exports = middlewareObj;

