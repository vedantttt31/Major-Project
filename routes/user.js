const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require('../controllers/users.js');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});
router.post(
    "/signup",
    wrapAsync(userController.signup)
);


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", { // ye middle ware hain jisme pehle strategy pass karte hai
        failureRedirect: "/login",
        failureFlash: true, // isko true kiya matlab jabhi bhi hit ho ek tarah message kuch jayega 
    }),
    userController.login
);

router.get("/logout", userController.logout);

module.exports = router;