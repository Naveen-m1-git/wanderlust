const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
    const allistings = await Listing.find({});
    res.render("listings/index", { allistings, searchQuery: "" });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showlisting = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id).populate(
            {
                path: "reviews",
                populate: { path: "author" },
            }
        ).populate("owner");
        if (!listing) {
            req.flash("error", "Listing you requested does not exist!");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing, currUser: req.user });
    } catch (err) {
        next(new ExpressError(500, "Something went wrong"));
    }
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
}

module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    let originalImageurl = listing.image.url;
    originalImageurl = originalImageurl.replace("uploads/", "upload/w_300,h_200/"
    );
    req.flash("success", "Successfully Edited listing");
    res.render("listings/edit", { listing, originalImageurl });
}

module.exports.updatelisting = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Successfully Updated listing");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deletelisting = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted listing");
    res.redirect("/listings");
}

module.exports.searchListings = async (req, res) => {
    const { query } = req.query;
    if (!query || query.trim() === "") {
        return res.redirect("/listings");
    }

    const searchResults = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ]
    }).populate("owner");

    res.render("listings/index", { allistings: searchResults, searchQuery: query });
}