const Bootcamp = require("../models/bootcamp");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc        get all bootcamps
// @route       GET /api/v1/bootcamp
// @access      public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  //destructure the req.query parameters
  let reqQuery = { ...req.query };

  // special queries to remove from reqQuery
  const removeQuery = ["select", "sort", "page", "limit"];

  // remove special queries from main reqQuery
  removeQuery.forEach((query) => delete reqQuery[query]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // generate the operators ($gt, $lt, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, (match) => `$${match}`);

  // Finding resources
  const query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // Selecting fields to send to user
  if (req.query.select) {
    const select = req.query.select.split(",").join(" ");
    query.select(select);
  }

  // sorting results
  if (req.query.sort) {
    query.sort(req.query.sort);
  } else {
    query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments(JSON.parse(queryStr));

  query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamp = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (startIndex)
    if (!bootcamp) {
      // throw new Error("bootcamp is not presnt");
      next(new ErrorResponse("Bootcamp is not present", 404));
    }
  res.status(200).json({
    success: true,
    total,
    pagination,
    body: bootcamp,
  });
});

// @desc        create a new bootcamp
// @route       POST /api/v1/bootcamp
// @access      private
exports.postBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  if (!bootcamp) {
    // return res.status(400).json({
    //   success: false,
    // });
    next(new ErrorResponse("Bootcamp not created", 404));
  }
  res.status(201).json({
    status: "success",
    body: bootcamp,
  });
});

// @desc        update existing bootcamp
// @route       PUT /api/v1/bootcamp/:id
// @access      private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    // return res.status(400).json({
    //   success: false,
    // });
    next(new ErrorResponse("Bootcamp not updated", 404));
  }
  res.status(200).json({
    status: "success",
    body: bootcamp,
  });
});

// @desc        delete a bootcamp
// @route       DELETE /api/v1/bootcamp/:id
// @access      private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    // return res.status(400).json({
    //   success: false,
    // });
    next(new ErrorResponse("Bootcamp not deleted", 404));
  }

  bootcamp.remove();

  res.status(201).json({
    status: "success",
    body: bootcamp,
  });
});

// @desc        update existing bootcamp
// @route       GET /api/v1/bootcamp/:id
// @access      public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    next(
      new ErrorResponse(`bootcamp with ID ${req.params.id} not present`, 404)
    );
    throw new Error();
  }
  res.status(200).json({
    status: "success",
    body: bootcamp,
  });
});

// @desc        get bootacamp within radius
// @route       GET /api/v1/bootcamp/radius/:zipcode/:radius (km)
// @access      public
exports.getBootcampsByRadi = asyncHandler(async (req, res, next) => {
  const { zipcode, radius } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const log = loc[0].longitude;

  //The equatorial radius of the Earth is
  //approximately 3, 963.2 miles or 6, 378.1 kilometers.
  const radi = radius / 6378.1;

  const bootcamp = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[log, lat], radi],
      },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});
