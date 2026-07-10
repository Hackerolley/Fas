import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Returns a safe user payload plus token for frontend session storage.
const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id)
  });
};

// Registers a new customer account.
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
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
    const { email, password } = req.body;
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

// Returns the currently authenticated user's profile.
export const getMe = async (req, res) => {
  res.json(req.user);
};

// Lets a signed-in user update profile basics.
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    sendAuthResponse(res, updatedUser);
  } catch (error) {
    next(error);
  }
};
