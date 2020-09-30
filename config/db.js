const mongoose = require("mongoose");

const connectDB = async (cb) => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database");
    cb();
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
