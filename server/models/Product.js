import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    moq: {
      type: Number,
      default: 1,
    },

    colors: [
      {
        type: String,
      },
    ],

    image: {
      type: String,
      default: "",
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);