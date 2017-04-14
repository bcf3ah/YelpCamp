var mongoose = require("mongoose");

//Campground Schema and model export=========
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    address: String,
    cityState: String,
    zip: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            rel: "User"
        },
        username: String
    }
});

//export the modoel
module.exports = mongoose.model("Campground", campgroundSchema);

