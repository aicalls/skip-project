const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDb() {
  try {

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.error("Could not connect to MongoDB...", err);
  }
} 

module.exports = connectToDb;