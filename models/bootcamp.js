const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const Bootcamp = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      maxlength: [50, "name length sould be less than 50"],
      trim: true,
      unique: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, "description is required"],
      maxlength: [500, "Description cannot be more than 500 characters"],
      trim: true,
    },
    website: {
      type: String,
      match: [
        /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
        "Please use a valid url",
      ],
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please use a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAdderss: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must not be greater than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Bootcamp.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

Bootcamp.pre("save", async function (next) {
  console.log(process.env.GEO_PROVIDER);
  const loc = await geocoder.geocode(this.address);
  console.log(loc);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAdderss: this.address,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].country,
  };
  this.address = undefined;
  next();
});

// Cascade delete all the courses related to bootcamp when bootcamp deleted
Bootcamp.pre("remove", async function (next) {
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with vertuals
Bootcamp.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", Bootcamp);
