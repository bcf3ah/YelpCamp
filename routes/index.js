var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user"),
    passport   = require("passport"),
    middleware  = require("../middleware");

//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

//REGISTER ROUTES
router.get("/register", function(req, res){
   res.render("authentication/register");
});

router.post("/register", function(req, res) {
    var username = req.body.username,
        password = req.body.password;
    User.register(new User({username: username}), password, function(err, user){
        if (err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome "+user.username+"! You are now signed up!");
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN ROUTES
router.get("/login", function(req, res) {
    res.render("authentication/login");
});

router.post("/login", passport.authenticate("local", {
        failerFlash: true,
        successFlash: "Welcome back!",
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){});


//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.flash("success", "Bye bye!");
    req.logout();
    res.redirect("/campgrounds");
});


module.exports = router;