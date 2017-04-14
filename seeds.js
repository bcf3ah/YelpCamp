var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Lake Chichibo",
        image: "http://wmich.edu/asylumlake/index/AsylumLake_2012.jpg",
        description: "Bacon ipsum dolor amet pig turducken doner, shank boudin pork chop pastrami. Ribeye short ribs jowl pork belly meatloaf tenderloin kielbasa chicken. Boudin prosciutto tail bacon ham hock. Strip steak jerky swine, ham hock pig tail meatloaf landjaeger flank shank. Ribeye turkey pork loin ground round sirloin venison short ribs turducken rump tri-tip. Shoulder pork cow, spare ribs chicken shankle sirloin jowl."
    },
    {
        name: "Lake Bochichi",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/A_photo_of_a_lake.png",
        description: "Bacon ipsum dolor amet pig turducken doner, shank boudin pork chop pastrami. Ribeye short ribs jowl pork belly meatloaf tenderloin kielbasa chicken. Boudin prosciutto tail bacon ham hock. Strip steak jerky swine, ham hock pig tail meatloaf landjaeger flank shank. Ribeye turkey pork loin ground round sirloin venison short ribs turducken rump tri-tip. Shoulder pork cow, spare ribs chicken shankle sirloin jowl."
    },
    {
        name: "Lake Chibochi",
        image: "http://www.townoflakelure.com/myimages/sailingbcox.jpg",
        description: "Bacon ipsum dolor amet pig turducken doner, shank boudin pork chop pastrami. Ribeye short ribs jowl pork belly meatloaf tenderloin kielbasa chicken. Boudin prosciutto tail bacon ham hock. Strip steak jerky swine, ham hock pig tail meatloaf landjaeger flank shank. Ribeye turkey pork loin ground round sirloin venison short ribs turducken rump tri-tip. Shoulder pork cow, spare ribs chicken shankle sirloin jowl."
    }
];

function seedDB(){
    //remove all prior campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("Campgrounds removed!");
            //add new campgrounds from data array using forEach
            data.forEach(function(seed){
                Campground.create(seed, function(err, seedCampground){
                     if (err){
                        console.log(err);
                    } else {
                        console.log("Seed campground added");
                        //Add a seed comment
                        Comment.create({
                            text: "This lake is very beautiful!",
                            author: "Bfitty1"
                        }, function(err, comment){
                            if (err){
                                console.log(err);
                            } else {
                                //push comment to campgrounds comment array, which we need to create later, for association
                                seedCampground.comments.push(comment);
                                seedCampground.save();
                                console.log("Comment saved.");
                            }
                        })
                    }
                });
            });
        }
    });
}//end of function seedDB

module.exports = seedDB;
