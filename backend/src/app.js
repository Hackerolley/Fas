import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Create the Express app in its own file so tests can import it without starting a server.
const app = express();

// Apply security headers, JSON parsing, request logging, and cross-origin access.
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// Keep noisy or abusive clients from overwhelming public API endpoints.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// Health route for deployment platforms and quick local checks.
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "Froyal Amity-Store-api",
    message: "The API is running and ready to serve requests."
  });
});

// Versioned API routes grouped by feature.
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);

// Error middleware must sit after routes so it can catch route failures.
app.get("/", (req, res) => {
  res.json({
    message: "Froyal Amity Store API is running",
    status: "success"
  });
});
app.use(notFound);
app.use(errorHandler);

export default app;
