const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); // PLugin hashing , salting ye sab automatically implement kardeta hai so no need to build from scratch.

module.exports = mongoose.model("User", userSchema);