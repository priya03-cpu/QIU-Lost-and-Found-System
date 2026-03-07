function isValidDate(dateStr) {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function validateItem(body) {
  const errors = [];
  const { title, description, category, location, date, contact_info, status } = body;

  if (!title || title.trim().length < 3) errors.push("Title must be at least 3 characters.");
  if (!description || description.trim().length < 5) errors.push("Description must be at least 5 characters.");
  if (!["Lost", "Found"].includes(category)) errors.push("Category must be Lost or Found.");
  if (!location || location.trim().length < 2) errors.push("Location is required.");
  if (!date || !isValidDate(date)) errors.push("Date is invalid.");
  if (!contact_info || contact_info.trim().length < 5) errors.push("Contact info is required.");
  if (status && !["Active", "Claimed", "Resolved"].includes(status)) errors.push("Status is invalid.");

  return errors;
}

module.exports = { validateItem };
// improved validation logic