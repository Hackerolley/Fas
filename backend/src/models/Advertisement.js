import mongoose from "mongoose";

// Homepage/shop promotional placements managed from the admin dashboard.
const advertisementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 90 },
    subtitle: { type: String, trim: true, maxlength: 180, default: "" },
    image: { type: String, default: "" },
    ctaLabel: { type: String, trim: true, maxlength: 32, default: "Shop now" },
    ctaLink: { type: String, trim: true, default: "/shop" },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Advertisement", advertisementSchema);
