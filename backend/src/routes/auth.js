const express = require("express");
const bcrypt = require("bcrypt");
const { getDb } = require("../lib/mongo");
const { signToken } = require("../utils/jwt");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const SALT_ROUNDS = 10;
const VALID_ROLES = ["USER", "ADMIN"];

const formatUser = (doc) => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  role: doc.role,
});

router.post("/signup", async (req, res) => {
  const { name, email, password, role = "USER" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password required" });
  }

  const normalizedRole = role.toUpperCase();

  if (!VALID_ROLES.includes(normalizedRole)) {
    return res.status(400).json({ message: "Role must be USER or ADMIN" });
  }

  try {
    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date();
    const insert = await users.insertOne({
      name,
      email,
      password: hashed,
      role: normalizedRole,
      createdAt: now,
      updatedAt: now,
    });

    const user = {
      id: insert.insertedId.toString(),
      name,
      email,
      role: normalizedRole,
    };

    const token = signToken({ sub: user.id, role: user.role });
    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Signup error", error);
    return res.status(500).json({ message: "Failed to create account" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const db = await getDb();
    const users = db.collection("users");

    const userDoc = await users.findOne({ email });
    if (!userDoc) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, userDoc.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = formatUser(userDoc);
    const token = signToken({ sub: safeUser.id, role: safeUser.role });

    return res.json({ user: safeUser, token });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Failed to login" });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
