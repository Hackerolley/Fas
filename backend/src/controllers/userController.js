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

    if (req.body.name !== undefined) {
      if (typeof req.body.name !== "string" || !req.body.name.trim() || req.body.name.length > 100) { res.status(400); throw new Error("User name is invalid."); }
      user.name = req.body.name.trim();
    }
    if (req.body.email !== undefined) {
      const email = String(req.body.email).trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) { res.status(400); throw new Error("User email is invalid."); }
      user.email = email;
    }
    if (req.body.role !== undefined) {
      if (!["customer", "admin"].includes(req.body.role)) { res.status(400); throw new Error("User role is invalid."); }
      if (user._id.toString() === req.user._id.toString() && req.body.role !== "admin") { res.status(400); throw new Error("You cannot remove your own admin access."); }
      user.role = req.body.role;
    }

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
    if (user._id.toString() === req.user._id.toString()) { res.status(400); throw new Error("You cannot delete your own account."); }
    if (user.role === "admin" && await User.countDocuments({ role: "admin" }) <= 1) { res.status(400); throw new Error("The last administrator cannot be deleted."); }

    await user.deleteOne();
    res.json({ message: "User deleted." });
  } catch (error) {
    next(error);
  }
};
