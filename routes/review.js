
const express=require("express")
const router=express.Router({mergeParams:true});// to access the review id from the parent 
const Review=require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn,validateReview,isauthor } = require("../middleware");
const review = require("../controller/review");

//Reviews
//post
router.post("/",isLoggedIn,validateReview,wrapAsync(review.createReview))


//delete route
router.delete("/:reviewId",isLoggedIn,isauthor, wrapAsync(review.deleteReview));

module.exports=router;