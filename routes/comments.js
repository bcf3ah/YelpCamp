var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");


//NEW Comment Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, site) {
       if (err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: site});
       }
   });
});

//CREATE Comment Route
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
   Campground.findById(req.params.id, function(err, site){
       if (err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           //create new comment
           Comment.create(req.body.comment, function(err, comment){
               if (err){
                   console.log(err);
                   req.flash("error", "Uh oh! Something went wrong...");
                   res.redirect("/campgrounds");
               } else {
                   //associate comment to user and save
                   comment.author.username = req.user.username;
                   comment.author.id = req.user._id;
                   comment.save();
                   //associate new comment to campground
                   site.comments.push(comment);
                   site.save(function(err){
                       if (err){
                           console.log(err);
                           res.redirect("/campgrounds");
                       } else {
                           req.flash("success", "Comment created successfully!"),
                           //redirect
                           res.redirect("/campgrounds/"+site._id);
                       }
                   });
               }
           });
       }
   });
});

//EDIT Route
router.get("/:commentID/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.commentID, function(err, foundComment) {
       if (err){
           console.log(err);
           res.redirect("back");
       } else {
           //this is passing through the CAMPGROUND's id, which is appended to this get url from app.js
            res.render("comments/edit", {campgroundID: req.params.id, comment: foundComment});

       }
   });
});

//UPDATE Route
router.put("/:commentID", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function(err, newComment){
       if(err){
           req.flash("error", "Uh oh! Something went wrong...");
           return res.redirec("back");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//DESTROY Route
router.delete("/:commentID", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentID, function(err){
       if (err){
           req.flash("error", "Uh oh! Something went wrong...");
           res.redirect("back");
       } else {
           req.flash("success", "Comment successfully deleted!");
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
})

module.exports = router;