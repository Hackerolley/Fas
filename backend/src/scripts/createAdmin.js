import "dotenv/config";
import mongoose from "mongoose";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import User from "../models/User.js";

const normaliseEmail = (email) => String(email || "").trim().toLowerCase();
const prompt = readline.createInterface({ input, output });

try {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing from backend/.env.");

  await mongoose.connect(process.env.MONGO_URI);
  const existingAdmin = await User.exists({ role: "admin" });
  if (existingAdmin) {
    throw new Error("An admin account already exists. Refusing to create another one.");
  }

  const name = (await prompt.question("Admin name: ")).trim();
  const email = normaliseEmail(await prompt.question("Admin email: "));
  const password = await prompt.question("Admin password (minimum 10 characters): ");

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 10) {
    throw new Error("Enter a name, valid email, and password of at least 10 characters.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("That email already belongs to an account. Use another email.");
  }

  await User.create({ name, email, password, role: "admin" });
  console.log(`Admin account created for ${email}. You can now sign in at /login.`);
} catch (error) {
  console.error(`Admin setup failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  prompt.close();
  await mongoose.disconnect();
}