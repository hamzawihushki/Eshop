const mongoose = require("mongoose");

const dbConnection = () => {
  // Connect to MongoDB
  mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB");
  });
};

module.exports = dbConnection;
