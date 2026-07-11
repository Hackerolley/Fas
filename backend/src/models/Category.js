import mongoose from "mongoose";

// Categories are managed separately so the catalog stays consistent across products.
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    department: { type: String, required: true, enum: ["fashion", "beauty"] },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
