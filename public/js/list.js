// public/js/list.js
const tbody = document.getElementById("itemsTableBody");
const msg = document.getElementById("msg");
const countPill = document.getElementById("countPill");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

// category comes from <body data-category="lost"> or "found"
const category = (document.body.dataset.category || "").toLowerCase();

let allItems = [];

function escapeText(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function typeTagFor(cat) {
  if (cat === "lost") return `<span class="tag lost">LOST</span>`;
  return `<span class="tag found">FOUND</span>`;
}

function render(items) {
  if (!items || items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No items found.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const cat = String(item.category || category).toLowerCase();
    const typeTag = typeTagFor(cat);

    const title = escapeText(item.title);
    const location = escapeText(item.location);
    const date = escapeText(item.date);
    const contact = escapeText(item.contact);
    const status = escapeText(item.status || "Active");

    // details page
    const detailsUrl = `/details.html?id=${item.id}`;

    return `
      <tr>
        <td>${typeTag}</td>
        <td><a href="${detailsUrl}">${title}</a></td>
        <td>${location}</td>
        <td>${date}</td>
        <td>${contact}</td>
        <td>${status}</td>
        <td><a class="btn" href="${detailsUrl}">View</a></td>
      </tr>
    `;
  }).join("");
}

function applyFilters() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  const status = statusFilter?.value || "all";

  const filtered = allItems.filter(it => {
    const hay = `${it.title} ${it.location} ${it.contact}`.toLowerCase();
    const okSearch = !q || hay.includes(q);
    const okStatus = status === "all" || (it.status || "Active") === status;
    return okSearch && okStatus;
  });

  if (countPill) {
    countPill.textContent = `Showing: ${filtered.length} / ${allItems.length}`;
  }
  render(filtered);
}

async function loadItems() {
  try {
    if (!(category === "lost" || category === "found")) {
      tbody.innerHTML = `<tr><td colspan="7">Missing page category.</td></tr>`;
      return;
    }

    if (msg) msg.textContent = `Loading ${category} items…`;

    // ✅ your backend filter
    const res = await fetch(`/api/items?category=${category}`);
    if (!res.ok) throw new Error("Failed to load items");

    const data = await res.json();
    allItems = Array.isArray(data) ? data : [];

    if (countPill) countPill.textContent = `Total: ${allItems.length}`;
    if (msg) msg.textContent = "";

    applyFilters();
  } catch (e) {
    if (msg) msg.textContent = e.message;
    tbody.innerHTML = `<tr><td colspan="7">Error loading items.</td></tr>`;
  }
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (statusFilter) statusFilter.addEventListener("change", applyFilters);

loadItems();