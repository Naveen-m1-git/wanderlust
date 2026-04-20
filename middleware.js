const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const {reviewSchema } = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }  
    next();
};

module.exports.saveRedirectTo = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }   
  next();
};  

module.exports.isowner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); 
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }   
};


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }   
};

module.exports.isauthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
