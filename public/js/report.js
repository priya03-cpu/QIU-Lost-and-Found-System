// public/js/report.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");
  const msg = document.getElementById("msg");
  const today = new Date().toISOString().split("T")[0];
document.getElementById("date").setAttribute("max", today);

  function showMessage(text, ok = false) {
    msg.textContent = text;
    msg.style.color = ok ? "#6ee7b7" : "#ff7b7b";
  }

  const clean = (v) => String(v ?? "").trim();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = clean(document.getElementById("category").value);
    const title = clean(document.getElementById("title").value);
    const location = clean(document.getElementById("location").value);
    const date = clean(document.getElementById("date").value);
    const description = clean(document.getElementById("description").value);
    const contact_name = clean(document.getElementById("contact_name").value);
    const contact_phone = clean(document.getElementById("contact_phone").value);

    if (!category) return showMessage("Please select Lost or Found.");
    if (title.length < 3) return showMessage("Item Name must be at least 3 characters.");
    if (location.length < 2) return showMessage("Location is required.");
    if (!date) return showMessage("Date is required.");
    if (description.length < 5) return showMessage("Description must be at least 5 characters.");
    if (contact_name.length < 2) return showMessage("Contact Name is required.");
    if (contact_phone.length < 7) return showMessage("Contact Phone is required.");

    const contact = `${contact_name} (${contact_phone})`;
    const payload = { title, description, category, location, date, contact };

    try {
      showMessage("Submitting…");

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        return showMessage(result.message || "Failed to submit report.");
      }

      showMessage("Report submitted ✅", true);
      form.reset();

      setTimeout(() => {
        window.location.href = category === "lost" ? "/lost.html" : "/found.html";
      }, 700);

    } catch (err) {
      console.error(err);
      showMessage("Network/server error.");
    }
  });
});