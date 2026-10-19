import "dotenv/config";
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
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import advertisementRoutes from "./routes/advertisementRoutes.js";
import { handlePaystackWebhook } from "./controllers/paystackController.js";

// Create the Express app in its own file so tests can import it without starting a server.
const app = express();

// Apply security headers, JSON parsing, request logging, and cross-origin access.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"]
    }
  }
}));
// Preserve the exact bytes for Paystack's HMAC signature check.
app.post("/api/paystack/webhook", express.raw({ type: "application/json", limit: "256kb" }), handlePaystackWebhook);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CLIENT_URL supports a single storefront host; CLIENT_URLS supports production
// aliases such as a Namecheap apex domain and its www variant. Origins—not full
// URLs with paths—are compared so credentialed CORS stays tightly scoped.
const toOrigin = (value) => {
  try { return new URL(value.trim()).origin; } catch { return null; }
};
const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
  .flatMap((value) => String(value || "").split(","))
  .map(toOrigin)
  .filter(Boolean);
const allowedOrigins = new Set([
  "https://froyalamitystore-nu.vercel.app",
  "https://froyalamity.com",
  "https://www.froyalamity.com",
  "http://localhost:5173",
  ...configuredOrigins
]);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header are health checks, server-to-server calls, or same-origin.
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

// Only credential-submission endpoints need a tight ceiling. Applying this to
// /auth/me would count normal session restores and could lock out an admin.
const authAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Too many authentication attempts. Please try again later." }
});
app.use(["/api/auth/login", "/api/auth/register"], authAttemptLimiter);

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
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/advertisements", advertisementRoutes);


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
