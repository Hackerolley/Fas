import User from "../models/User.js";

// Lists all users for admin dashboard tables.
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort("-createdAt");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Gets a single user record for admin editing.
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Updates basic admin-managed user fields.
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    next(error);
  }
};

// Deletes a user account from the admin dashboard.
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    await user.deleteOne();
    res.json({ message: "User deleted." });
  } catch (error) {
    next(error);
  }
};
