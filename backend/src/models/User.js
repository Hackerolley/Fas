import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// User schema stores shoppers and admins in one collection via a role field.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },
    avatar: {
      type: String,
      default: ""
    },
    // The saved address is used to prefill checkout; an order keeps its own snapshot.
    shippingAddress: {
      fullName: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
      phone: { type: String, default: "" }
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      whatsappNumber: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

// Hash passwords before saving whenever the password has changed.
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare login passwords without exposing hashing details to controllers.
userSchema.methods.matchPassword = async function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
