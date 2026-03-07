const Database = require("better-sqlite3");

// creates database file automatically
const db = new Database("database.db");

// create table if not exists
db.prepare(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  date TEXT,
  contact TEXT,
  status TEXT DEFAULT 'Active'
)
`).run();

module.exports = db;