// src/controllers/items.controller.js
const db = require("../db");

const clean = (v) => String(v ?? "").trim();

exports.createItem = async (req, res) => {
  try {
    const title = clean(req.body.title);
    const description = clean(req.body.description);
    const category = clean(req.body.category).toLowerCase();
    const location = clean(req.body.location);
    const date = clean(req.body.date); // expected YYYY-MM-DD
    const contact = clean(req.body.contact);
    const status = clean(req.body.status) || "Active";

    // Required fields
    if (!title || !description || !category || !location || !date || !contact) {
      return res.status(400).json({
        message:
          "All fields are required: title, description, category, location, date, contact.",
      });
    }

    // Category validation
    if (!(category === "lost" || category === "found")) {
      return res.status(400).json({ message: "Category must be lost or found." });
    }

    // ✅ Date validation (no future dates + basic format check)
    // Works because 'YYYY-MM-DD' compares correctly as strings.
    const today = new Date().toISOString().split("T")[0];

    // Basic YYYY-MM-DD format check
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // Future date block
    if (date > today) {
      return res.status(400).json({ message: "Date cannot be in the future." });
    }

    const sql = `
      INSERT INTO items (title, description, category, location, \`date\`, contact, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [title, description, category, location, date, contact, status];
    const [result] = await db.query(sql, params);

    return res.status(201).json({ message: "Created ✅", id: result.insertId });
  } catch (err) {
    console.error("❌ createItem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const category = clean(req.query.category).toLowerCase();

    let sql =
      "SELECT id, title, description, category, location, `date`, contact, status FROM items";
    const params = [];

    if (category === "lost" || category === "found") {
      sql += " WHERE category = ?";
      params.push(category);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error("❌ getItems error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const id = req.params.id;

    const sql =
      "SELECT id, title, description, category, location, `date`, contact, status FROM items WHERE id = ?";

    const [rows] = await db.query(sql, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("❌ getItemById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = clean(req.body.status);

    if (!status) return res.status(400).json({ message: "Status is required." });

    const allowed = ["Active", "Claimed", "Resolved"];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be Active, Claimed, or Resolved." });
    }

    const [result] = await db.query("UPDATE items SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({ message: "Status updated ✅" });
  } catch (err) {
    console.error("❌ updateStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await db.query("DELETE FROM items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({ message: "Deleted ✅" });
  } catch (err) {
    console.error("❌ deleteItem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};