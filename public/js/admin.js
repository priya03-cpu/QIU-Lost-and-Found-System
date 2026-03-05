// public/js/admin.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Logging in...";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      msg.textContent = "Please fill in both fields.";
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        msg.textContent = data.message || "Login failed.";
        return;
      }

      msg.textContent = "Login successful ✅ Redirecting...";
      // change this to your admin page path
      setTimeout(() => (window.location.href = "/admin.html"), 600);

    } catch (err) {
      msg.textContent = "Server error. Try again.";
      console.error(err);
    }
  });
});