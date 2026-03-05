// public/js/admin-panel.js
document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("adminItemsTable");
  const statusFilter = document.getElementById("statusFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const refreshBtn = document.getElementById("refreshBtn");

  if (!tbody) {
    console.error("adminItemsTable not found in admin.html");
    return;
  }

  function escapeText(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function typeTagFor(cat) {
    const c = String(cat || "").toLowerCase();
    if (c === "lost") return `<span class="tag lost">LOST</span>`;
    return `<span class="tag found">FOUND</span>`;
  }

  function render(items) {
    if (!items || items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">No reports found.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const typeTag = typeTagFor(item.category);
      const detailsUrl = `/details.html?id=${item.id}`;

      return `
        <tr>
          <td>${typeTag}</td>
          <td><a href="${detailsUrl}">${escapeText(item.title)}</a></td>
          <td>${escapeText(item.location)}</td>
          <td>${escapeText(item.date)}</td>
          <td>${escapeText(item.status || "Active")}</td>
          <td>${escapeText(item.contact)}</td>
          <td><a class="btn" href="${detailsUrl}">View</a></td>
        </tr>
      `;
    }).join("");
  }

  async function loadAdminItems() {
    try {
      tbody.innerHTML = `<tr><td colspan="7">Loading…</td></tr>`;

      // ✅ Load all items first (admin can see everything)
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to load items");

      let items = await res.json();
      if (!Array.isArray(items)) items = [];

      // apply filters
      const s = (statusFilter?.value || "").toLowerCase();
      const c = (categoryFilter?.value || "").toLowerCase();

      if (s) {
        items = items.filter(it => String(it.status || "Active").toLowerCase() === s);
      }
      if (c) {
        items = items.filter(it => String(it.category || "").toLowerCase() === c);
      }

      render(items);
    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="7">Error loading reports.</td></tr>`;
    }
  }

  refreshBtn?.addEventListener("click", loadAdminItems);
  statusFilter?.addEventListener("change", loadAdminItems);
  categoryFilter?.addEventListener("change", loadAdminItems);

  loadAdminItems();
});