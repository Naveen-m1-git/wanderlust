const mongoose = require("mongoose");
const Review = require('../models/review');     
const Listing = require("../models/listing");

module.exports.createReview=async(req,res)=>{
    console.log(req.body)
    let listing = await Listing.findById(req.params.id);
    let newre= new Review(req.body.review);
    newre.author=req.user._id;
    console.log(newre);
    listing.reviews.push(newre)
    await newre.save();
    await listing.save();
    req.flash("success","Successfully added a review");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;

    // Convert reviewId to ObjectId type before pulling
    await Listing.findByIdAndUpdate(id, { 
        $pull: { reviews: new mongoose.Types.ObjectId(reviewId) } 
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}