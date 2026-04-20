const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { isLoggedIn, isowner, validateListing } = require("../middleware");
const listingController = require("../controller/listing");
const multer = require('multer')
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));


router.get("/new", isLoggedIn, listingController.renderNewForm);


router.get("/search", wrapAsync(listingController.searchListings));

//New route for showing a listing and editing and deleting a listing
router.route("/:id")
    .get(wrapAsync(listingController.showlisting))
    .put(isLoggedIn, isowner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updatelisting))
    .delete(isLoggedIn, isowner, wrapAsync(listingController.deletelisting));

router.get("/:id/edit", isLoggedIn, isowner,
    wrapAsync(listingController.editlisting));

module.exports = router;