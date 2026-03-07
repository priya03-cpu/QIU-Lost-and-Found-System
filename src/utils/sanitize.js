const xss = require("xss");

function sanitizeString(value) {
  if (typeof value !== "string") return "";
  return xss(value.trim());
}

module.exports = { sanitizeString };
// improved validation logic