const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
require("dotenv").config();

const itemsRoutes = require("./routes/items.routes");
const adminRoutes = require("./routes/admin.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express(); // ✅ MUST be before any app.use()

// Security + rate limit
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session middleware (AFTER app is created)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // ok for localhost
  })
);

// Static frontend
app.use(express.static(path.join(__dirname, "../public")));

// Test route
app.get("/api/test", (req, res) => res.json({ message: "API is working ✅" }));

// Routes
app.use("/api/items", itemsRoutes);
app.use("/api/admin", adminRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));