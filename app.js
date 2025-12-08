require("dotenv").config();
const express = require("express");
const app = express(); //Ye jo app hai yahi hame server side wali app create karne mai madadd karega , ye app ek OBJECT hai
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");//Listing(model) acces karne ke liye

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const ejsMate = require("ejs-mate");//help karta hai kayi sare templates create karne mai
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const path = require("path");//EJS ko setup karne ke liye
const { listingSchema, reviewSchema } = require("./schema.js");
const { valid } = require("joi");
const Review = require("./models/review.js");//Review model access karne keliye
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLASDB_URL;

//ab main ko call karenege
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});
//Ab database conncect karte hai , pehle ek async function likhenege
async function main() {
    await mongoose.connect(dbURL);
}


app.use(express.urlencoded({ extended: true }));//Taki humara sara jo data hai jo request ke andar aa rha hai wo parse ho paaye
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));//To use static files Static files = वो files jinka content fix hota hai, No logic, no DB, no dynamic calculation.

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto :{
        secret :process.env.SECRET,
    },
    touchAfter  : 24*3600,
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false, //Means: Don’t save the session into the store if nothing changed during the request
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,//in milliseconds hota hai
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
}//sessionOptions actually is a configuration object for the Express session middleware.
app.use(session(sessionOptions));




app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //Use static authenticate method of model in LocalStrategy.
passport.serializeUser(User.serializeUser());//user aaye to ek session mai info store karke rakhna
passport.deserializeUser(User.deserializeUser());

//
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// ROUTES
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingRouter);
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/", userRouter);


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).send(message);
});

let port = 3000;
app.listen(port, () => {
    console.log("Server is listening to port 3000");
}); //Listen ek web server banata hai jo incoming API request ke liye listen karta hai
//ab jabtak stop nahi karenge ye constanly listen karta rahega

