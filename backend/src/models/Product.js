import mongoose from "mongoose";

// Review subdocument keeps product ratings close to the product they describe.
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Product schema supports storefront filtering, inventory, images, and reviews.
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger
    },
    compareAtPrice: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active"
    },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

productSchema.index({ status: 1, featured: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
