// src/routes/admin.routes.js
const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const adminUser = (process.env.ADMIN_USER || "").trim();
  const adminPass = (process.env.ADMIN_PASSWORD || "").trim();

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }

  if (username.trim() === adminUser && password === adminPass) {
    // set session
    req.session.isAdmin = true;
    return res.json({ message: "Login success" });
  }

  return res.status(401).json({ message: "Invalid admin credentials." });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

router.get("/me", (req, res) => {
  if (req.session && req.session.isAdmin) return res.json({ ok: true });
  return res.status(401).json({ ok: false });
});

module.exports = router;
