var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    request = require("request");



//setup INDEX route that shows all campgrounds
router.get("/", function(req, res){
    //get all campground sites from the DB
    Campground.find({}, function(err, sites){
        if (err){
            console.log(err);
            res.send("Uh oh spaghettio!");
        } else {
            res.render("campgrounds/index", {campgrounds:sites});
        }
    });

});

//setup NEW route that displays form to submit new site
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");
});

//setup CREATE route to add new campgrounds
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    // var name = req.body.name;
    // var image = req.body.image;
    // var description = req.body.description;
    // var newSite = {name: name, image: image, description: description};
    //add newSite to DB
    Campground.create(req.body.campground, function(err, site){
       if(err){
         req.flash("error", "Uh oh! Something went wrong...");
         console.log(err);
         res.redirect("/campgrounds");
       } else {
         //Associate new campground with logged in user AND SAVE
         site.author.id = req.user._id;
         site.author.username = req.user.username;
         site.save();
         //redirect to campgrounds page
         req.flash("success", "Campground created successfully!");
         res.redirect("/campgrounds");
       }
    });
});

//setup SHOW route to show specific campground
router.get("/:id", function(req, res){
    //want to find() site with this id, then render the show template
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundSite){ //added ).populate("comments").exec( in middel to get comments showing
       if (err){
           console.log(err);
       } else {

           request("http://api.wunderground.com/api/1f9c1f7e82f2900e/conditions/q/"+foundSite.zip+".json", function(error, response, body){
               if (!error && response.statusCode == 200){
                   var parsedBody = JSON.parse(body);
                   var weather = parsedBody["current_observation"]["weather"];
                   res.render("campgrounds/show", {campground: foundSite, weather: weather});
                   console.log(weather);
               } else {
                   console.log(error);
               }
           });

       }
    });
});

//EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res, next){
    Campground.findById(req.params.id, function(err, site){
        if (err){
            req.flash("error", err.message);
        } else {
            res.render("campgrounds/edit", {campground: site});
        }
    });
});

//UPDATE Route
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, site){
       if (err){
           req.flash("error", "Uh oh! Something went wrong...");
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Campground updated succesfully!");
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//DESTROY Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if (err){
           req.flash("error", "Uh oh! Something went wrong...");
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Campground deleted successfully!");
           res.redirect("/campgrounds");
       }
    });
});

module.exports = router;
