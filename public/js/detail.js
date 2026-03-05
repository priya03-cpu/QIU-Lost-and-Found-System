// public/js/detail.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const el = (x) => document.getElementById(x);

  const dTitle = el("dTitle");
  const dTypePill = el("dTypePill");
  const dStatusPill = el("dStatusPill");
  const dLocation = el("dLocation");
  const dDate = el("dDate");
  const dContact = el("dContact");
  const dDescription = el("dDescription");
  const msg = el("msg");

  const btnActive = el("btnActive");
  const btnClaimed = el("btnClaimed");
  const btnResolved = el("btnResolved");
  const btnDelete = el("btnDelete");
  const backBtn = el("backBtn");

  function typeLabel(cat) {
    const c = String(cat || "").toLowerCase();
    return c === "lost" ? "LOST" : "FOUND";
  }

  async function load() {
    if (!id) {
      dTitle.textContent = "Missing item id";
      if (msg) msg.textContent = "Missing id in URL.";
      return null;
    }

    if (msg) msg.textContent = "Loading…";

    const res = await fetch(`/api/items/${id}`);
    if (!res.ok) {
      if (msg) msg.textContent = "Failed to load item.";
      dTitle.textContent = "Item not found";
      return null;
    }

    const item = await res.json();
    const it = item?.item ? item.item : item;

    dTitle.textContent = it.title || "(No title)";
    dTypePill.textContent = `Type: ${typeLabel(it.category)}`;
    dStatusPill.textContent = `Status: ${it.status || "Active"}`;

    dLocation.textContent = it.location || "-";
    dDate.textContent = it.date || "-";
    dContact.textContent = it.contact || "-";

    const desc = it.description ?? it.details ?? "";
    dDescription.textContent = desc ? desc : "(No description)";

    // ✅ BACK BUTTON FIX:
    // If item is lost -> back goes to lost.html
    // If item is found -> back goes to found.html
    const cat = String(it.category || "").toLowerCase();
    if (backBtn) backBtn.href = (cat === "lost") ? "/lost.html" : "/found.html";

    if (msg) msg.textContent = "";
    return it;
  }

  async function isAdminLoggedIn() {
    const res = await fetch("/api/admin/me");
    return res.ok;
  }

  async function updateStatus(newStatus) {
    if (msg) msg.textContent = "Updating status…";

    const res = await fetch(`/api/items/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (msg) msg.textContent = data.message || "Unauthorized";
      return;
    }

    if (msg) msg.textContent = "Status updated ✅";
    await load();
  }

  async function deleteItem() {
    if (!confirm("Delete this report? This cannot be undone.")) return;

    if (msg) msg.textContent = "Deleting…";

    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (msg) msg.textContent = data.message || "Unauthorized";
      return;
    }

    if (msg) msg.textContent = "Deleted ✅ Redirecting…";
    setTimeout(() => (window.location.href = "/admin.html"), 700);
  }

  btnActive?.addEventListener("click", () => updateStatus("Active"));
  btnClaimed?.addEventListener("click", () => updateStatus("Claimed"));
  btnResolved?.addEventListener("click", () => updateStatus("Resolved"));
  btnDelete?.addEventListener("click", deleteItem);

  // ✅ On page load: load item, then check admin session.
  (async () => {
    await load();

    const adminOk = await isAdminLoggedIn().catch(() => false);

    if (!adminOk) {
      if (msg) msg.textContent = "Unauthorized (Admin login required)";
      if (btnActive) btnActive.disabled = true;
      if (btnClaimed) btnClaimed.disabled = true;
      if (btnResolved) btnResolved.disabled = true;
      if (btnDelete) btnDelete.disabled = true;
    } else {
      if (msg) msg.textContent = "";
    }
  })();
});