const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Water Supply",
        "Road",
        "Electricity",
        "Sanitation",
        "Healthcare",
        "Education",
        "Street Light",
        "Drainage",
        "Other",
      ],
    },
    urgency: {
      type: String,
      required: [true, "Please select urgency level"],
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    location: {
      address: {
        type: String,
        required: [true, "Please provide location address"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    acceptedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
    ratedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

grievanceSchema.index({ "location.coordinates": "2dsphere" });

const Grievance = mongoose.model("Grievance", grievanceSchema);

module.exports = Grievance;
