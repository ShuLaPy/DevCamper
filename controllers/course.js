const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/course");

// @desc        get Courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampID/courses
// @access      public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampID) {
    query = Course.find({ bootcamp: req.params.bootcampID });
  } else {
    query = Course.find({});
  }

  const courses = await query.populate({
    path: "bootcamp",
    select: "name description",
  });

  res.status(200).json({
    success: true,
    total: courses.length,
    data: courses,
  });
});
