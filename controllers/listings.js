const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    //Listing is your Mongoose model (tied to the listings collection in MongoDB).
    //.find({}) fetches all documents from the listings collection (empty object {} = no filter).
    res.render("listings/index", { allListings });
    //The second argument { allListings } passes the fetched data into the EJS template.
};

module.exports.renderNewForm = async(req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must login to continue!");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
};

module.exports.display = async (req, res) => {
    //This sets up a GET route where the path has a dynamic segment :id.
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested not found");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    console.log("Logged-in user while creating listing:", req.user);

    const newListing = new Listing(req.body.listing);

    // Fix: handle string image input
    if (typeof req.body.listing.image === "string") {
        newListing.image = {
            filename: "listingimage",
            url: req.body.listing.image
        };
    }

    newListing.owner = req.user._id;
    await newListing.save();

    console.log("New Listing saved:", newListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};
// Yaha async await isliye use krte hai because you’re not just running a local operation. You’re asking your server to:
// Serialize data (convert the JS object into MongoDB format)    
// Send it across the network to the database
// Wait for MongoDB to respond (“okay, saved successfully” or “error, validation failed”)
// That whole trip — app → DB → app — is asynchronous because:
// It doesn’t happen instantly.
// It depends on external I/O (database or network).
// Blocking the event loop would freeze other users’ requests.
// So Mongoose’s save() method doesn’t return the final object directly — it returns a Promise.To get the actual saved document, you must wait until the operation finishes. "await newListing.save();"

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.UpdateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);


    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Update text fields
    listing.set(req.body.listing);

    // If a new image URL is provided, update it
    if (req.body.listing.image && req.body.listing.image.trim() !== "") {
        listing.image = {
            filename: "listingimage",
            url: req.body.listing.image
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing =async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};