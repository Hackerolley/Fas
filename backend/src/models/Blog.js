import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

// Store editorial posts and their signed-in customer discussions together.
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 320 },
    content: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    author: { type: String, default: "Froyal Amity Store" },
    type: { type: String, enum: ["blog", "journal"], default: "journal" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    comments: [commentSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
