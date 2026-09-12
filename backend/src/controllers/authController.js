import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const normaliseEmail = (email) => String(email || "").trim().toLowerCase();
const safeString = (value, max) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
// The Vercel storefront and Render API are different browser sites. Cross-site
// sessions require SameSite=None and Secure, even if NODE_ENV was misconfigured.
const cookieOptions = () => {
  const secure = process.env.NODE_ENV === "production" || process.env.CLIENT_URL?.startsWith("https://");
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  };
};

// Keeps the bearer token out of JavaScript-readable browser storage.
const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  res.cookie("froyal_access_token", token, cookieOptions());
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    shippingAddress: user.shippingAddress,
    notificationPreferences: user.notificationPreferences
  });
};

// Registers a new customer account.
export const registerUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const email = normaliseEmail(req.body.email);
    if (!safeString(name, 100) || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== "string" || password.length < 10) {
      res.status(400); throw new Error("Provide a name, valid email, and password of at least 10 characters.");
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("A user with this email already exists.");
    }

    const user = await User.create({ name, email, password });
    sendAuthResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

// Authenticates an existing user with email and password.
export const loginUser = async (req, res, next) => {
  try {
    const email = normaliseEmail(req.body.email);
    const { password } = req.body;
    if (!email || typeof password !== "string") { res.status(400); throw new Error("Email and password are required."); }
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return sendAuthResponse(res, user);
    }

    res.status(401);
    throw new Error("Invalid email or password.");
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  const options = cookieOptions();
  delete options.maxAge;
  res.clearCookie("froyal_access_token", options);
  res.status(204).end();
};

// Returns the currently authenticated user's profile.
export const getMe = async (req, res) => {
  res.json(req.user);
};

// Lets a signed-in user update profile basics.
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name !== undefined) {
      if (!safeString(req.body.name, 100)) { res.status(400); throw new Error("Name must be between 1 and 100 characters."); }
      user.name = req.body.name.trim();
    }
    if (req.body.email !== undefined) {
      const email = normaliseEmail(req.body.email);
      if (!/^\S+@\S+\.\S+$/.test(email)) { res.status(400); throw new Error("Provide a valid email."); }
      user.email = email;
    }
    if (req.body.avatar !== undefined && typeof req.body.avatar === "string" && req.body.avatar.length <= 2048) user.avatar = req.body.avatar;
    if (req.body.shippingAddress) {
      const address = req.body.shippingAddress;
      const fields = ["fullName", "address", "city", "postalCode", "country", "phone"];
      if (typeof address !== "object" || Object.entries(address).some(([key, value]) => !fields.includes(key) || typeof value !== "string" || value.length > 160)) { res.status(400); throw new Error("Shipping address is invalid."); }
      user.shippingAddress = { ...user.shippingAddress.toObject(), ...address };
    }
    if (req.body.notificationPreferences) {
      const preferences = req.body.notificationPreferences;
      if (typeof preferences !== "object" || (preferences.email !== undefined && typeof preferences.email !== "boolean") || (preferences.whatsapp !== undefined && typeof preferences.whatsapp !== "boolean") || (preferences.whatsappNumber !== undefined && (typeof preferences.whatsappNumber !== "string" || preferences.whatsappNumber.length > 30))) { res.status(400); throw new Error("Notification preferences are invalid."); }
      user.notificationPreferences = { ...user.notificationPreferences.toObject(), ...preferences };
    }

    // Require the existing password before changing credentials on an active session.
    if (req.body.password) {
      if (typeof req.body.password !== "string" || req.body.password.length < 10) { res.status(400); throw new Error("New password must be at least 10 characters."); }
      if (!req.body.currentPassword || !(await user.matchPassword(req.body.currentPassword))) {
        res.status(400);
        throw new Error("Your current password is incorrect.");
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    sendAuthResponse(res, updatedUser);
  } catch (error) {
    next(error);
  }
};
