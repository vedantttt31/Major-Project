const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middlewares.js");
const ListingController = require('../controllers/listings.js');

 const { listingSchema, reviewSchema } = require("../schema.js");
 const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else next();
};


//Index Route
router.get("/", wrapAsync(ListingController.index));

//New Route
router.get("/new", ListingController.renderNewForm);

//Show Route , iska basically kaam hoga har ek individual Listing ka pura-kapura data dikhana
router.get("/:id", wrapAsync(ListingController.display));


//Create route
router.post("/", isLoggedIn, validateListing, wrapAsync(ListingController.createListing));



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(ListingController.UpdateListing));


//Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ListingController.destroyListing));

module.exports = router;