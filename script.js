const sidebar = document.getElementById("sidebar");
const tab = document.getElementById("sidebarTab");
const overlay = document.getElementById("sidebarOverlay");
const pin = document.getElementById("sidebarPin");

let pinned = false;

function openSidebar() {
  sidebar.classList.add("is-open");
  tab.setAttribute("aria-expanded", "true");
  overlay.hidden = false;
}

function closeSidebar() {
  if (pinned) return;
  sidebar.classList.remove("is-open");
  tab.setAttribute("aria-expanded", "false");
  overlay.hidden = true;
}

tab?.addEventListener("click", () => {
  const isOpen = sidebar.classList.contains("is-open");
  if (isOpen) closeSidebar();
  else openSidebar();
});

overlay?.addEventListener("click", closeSidebar);

pin?.addEventListener("click", () => {
  pinned = !pinned;
  pin.setAttribute("aria-pressed", String(pinned));
  pin.textContent = pinned ? "Pinned" : "Pin";
  if (pinned) openSidebar();
  else closeSidebar();
});

/* zavřít klávesou ESC */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});
