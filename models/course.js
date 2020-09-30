const mongoose = require("mongoose");

const Course = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please enter a title for course"],
    },
    description: {
      type: String,
      required: [true, "Please add full description to the course"],
    },
    weeks: {
      type: String,
      required: [true, "Please add number of weeks"],
    },
    tuition: {
      type: Number,
      required: [true, "Please add tution fees for this course"],
    },
    minimumSkill: {
      type: String,
      required: [true, "Please add required skill level"],
    },
    scholarshipsAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", Course);
