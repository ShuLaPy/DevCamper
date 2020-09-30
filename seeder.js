const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

// load environment variables
dotenv.config({ path: "./config/config.env" });

// import Bootcamp model
const Bootcamp = require("./models/bootcamp");
const Course = require("./models/course");

//connect to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertIntoDatabase = async () => {
  try {
    const bootcamps = JSON.parse(
      fs.readFileSync(path.join(__dirname, "_data", "bootcamps.json"))
    );
    const courses = JSON.parse(
      fs.readFileSync(path.join(__dirname, "_data", "courses.json"))
    );
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.info("Successfully Inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

const deleteDocuments = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.info("Deleted Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  insertIntoDatabase();
} else if (process.argv[2] === "-d") {
  deleteDocuments();
}
