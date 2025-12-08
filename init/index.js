const mongoose = require("mongoose");
const initData = require("./data.js");  // Ye file se apna dummy data (seed data) import kar rahe hai
const Listing = require("../models/listing.js"); // Apna Listing model import kiya


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Ab connection establish karenge DB se
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// Async function banaya connection ke liye
async function main() {
    await mongoose.connect(MONGO_URL);  // Ye line actually MongoDB se connect karti hai.
}

// Ab ek function banate hai jo DB ko initialize karega
const initDB = async () => {

    await Listing.deleteMany({});
    // iska matlab: agar me already data pada hai, sab saaf kar do
    // basically reset karna DB ko, taki naya fresh data dal sake.


    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "69155635d987fea85ed5eab5",
    }));
    // Step 2: initData ke andar jo "data" array hai, usko DB me insert kar do
    await Listing.insertMany(initData.data);
    // Matlab ab hum ek hi baar me multiple Listings database me daal rahe hai

    console.log("data was initialized");
    // Ye sirf confirm karne ke liye print ho raha ki data successfully insert ho gaya
};

// Finally initDB ko call kar diya taki process chal jaye
initDB();
