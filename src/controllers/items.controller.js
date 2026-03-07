const db = require("../database/db");

// Create item
exports.createItem = (req, res) => {
  try {
    const { title, description, category, location, date, contact } = req.body;

    if (!title || !description || !category || !location || !date || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const stmt = db.prepare(`
      INSERT INTO items (title, description, category, location, date, contact, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      description,
      category,
      location,
      date,
      contact,
      "Active"
    );

    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      message: "Item reported successfully ✅",
    });
  } catch (error) {
    console.error("createItem error:", error);
    res.status(500).json({ message: "Server error while creating item" });
  }
};

// Get all items
exports.getItems = (req, res) => {
  try {
    const { category } = req.query;
    let items;

    if (category) {
      items = db
        .prepare("SELECT * FROM items WHERE LOWER(category) = LOWER(?) ORDER BY id DESC")
        .all(category);
    } else {
      items = db.prepare("SELECT * FROM items ORDER BY id DESC").all();
    }

    res.json(items);
  } catch (error) {
    console.error("getItems error:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

// Get one item by ID
exports.getItemById = (req, res) => {
  try {
    const { id } = req.params;

    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("getItemById error:", error);
    res.status(500).json({ message: "Server error while fetching item" });
  }
};

// Update item status
exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const stmt = db.prepare("UPDATE items SET status = ? WHERE id = ?");
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      success: true,
      message: "Status updated successfully ✅",
    });
  } catch (error) {
    console.error("updateStatus error:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};

// Delete item
exports.deleteItem = (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare("DELETE FROM items WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      success: true,
      message: "Item deleted successfully ✅",
    });
  } catch (error) {
    console.error("deleteItem error:", error);
    res.status(500).json({ message: "Server error while deleting item" });
  }
};