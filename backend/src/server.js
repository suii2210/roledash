require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const { initDb } = require("./lib/mongo");

const app = express();
const PORT = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const rawOrigins = process.env.CLIENT_URL || "*";
const normalizeOrigin = (value) =>
  value === "*" ? "*" : value.replace(/\/$/, "").trim();

const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

const corsOptions = {
  origin: (origin, callback) => {
    const requestOrigin = origin ? normalizeOrigin(origin) : null;
    if (
      !requestOrigin ||
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(requestOrigin)
    ) {
      callback(null, requestOrigin || true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);
app.options(/.*/, corsMiddleware);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unexpected error", err);
  res.status(500).json({ message: "Unexpected error" });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
