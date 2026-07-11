import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load environment variables before any app-level setup needs them.
dotenv.config();

// Pick a safe development port when the host does not provide one.
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first so the API does not accept traffic before storage is ready.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Froyal Amity Store API running on port ${PORT}`);
  });
});
