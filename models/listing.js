const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { type: String, default: "listingimage" },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1759054144138-a29eba0a18b5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",//jo hamara review model hai wo iske liye refrence banega
        },
    ],
    owner: { // ye user wala jo schema hai ye usko refer kar raha hoga qke owner ek registered user bhi hhona chahiye
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    //Is array ke andar object id store kara rhe honge review ke
});//Ye schema bana dee
//ab ise schema ko use karke hum ek model bananewale hai
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model("Listing", listingSchema);

//Ab is model ko export karenge app.js ke andar
module.exports = Listing;

