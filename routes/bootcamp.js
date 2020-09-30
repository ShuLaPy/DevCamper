const express = require("express");
const router = express.Router();
const bootcamp = require("../controllers/bootcamp");

// Include other resource router
const courseRouter = require("./course");

// Re-route specific routes to other erource route handler
router.use("/:bootcampID/courses", courseRouter);

router.route("/").get(bootcamp.getAllBootcamps).post(bootcamp.postBootcamp);

router
  .route("/:id")
  .get(bootcamp.getSingleBootcamp)
  .put(bootcamp.updateBootcamp)
  .delete(bootcamp.deleteBootcamp);

router.route("/radius/:zipcode/:radius").get(bootcamp.getBootcampsByRadi);

module.exports = router;
