const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();

// Load all the Environment Variables
dotenv.config({ path: "./config/config.env" });

// import error handler middleware
const errorHandler = require("./middlewares/error");

// import function to connect to the database
const connectDB = require("./config/db");

// Route Files
const bootcamp = require("./routes/bootcamp");
const course = require("./routes/course");

// parese body
app.use(express.json());

// register logging middleware and use it  only in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// register different routes
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", course);

//use error handler middleware after all the routes
app.use(errorHandler);

// connect to the database and only start app if-
// successfully connected to database
connectDB(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      `app is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
    );
  });
});
