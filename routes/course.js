const express = require("express");
const course = require("../controllers/course");

// use this for merge multiple routes
const router = express.Router({ mergeParams: true });

router.route("/").get(course.getCourses);

module.exports = router;
