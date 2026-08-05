import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ======================
    // BASIC INFORMATION
    // ======================
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "supplier"],
      required: true,
    },

    // ======================
    // BUSINESS
    // ======================
    businessName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    gstNumber: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },

    // ======================
    // ADDRESS
    // ======================
    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      default: "",
    },

    // ======================
    // PROFILE
    // ======================
    profileImage: {
      type: String,
      default:
        "https://ui-avatars.com/api/?background=4f46e5&color=fff&name=User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);