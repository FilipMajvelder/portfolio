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

/* =========================
   PORTFOLIO LIGHTBOX GALLERY
   - tiles: .tile[data-gallery="musical|church|..."]
   - modal: #lightbox + elements inside
========================= */

/** 1) DOPLŇ SI CESTY K FOTKÁM **/
const GALLERIES = {
  musical: [
    { src: "img/jchs-scena/musical_1.jpg", caption: "JCHS — scéna 1" },
    { src: "img/jchs-scena/musical_2.jpg", caption: "JCHS — scéna 2" },
    { src: "img/jchs-scena/musical_3.jpg", caption: "JCHS — scéna 3" },
    { src: "img/jchs-scena/musical_4.jpg", caption: "JCHS — scéna 4" },
    { src: "img/jchs-scena/musical_5.jpg", caption: "JCHS — scéna 5" },
    { src: "img/jchs-scena/musical_6.jpg", caption: "JCHS — scéna 6" },
    { src: "img/jchs-scena/musical_7.jpg", caption: "JCHS — scéna 7" },
    { src: "img/jchs-scena/musical_8.jpg", caption: "JCHS — scéna 8" },
    { src: "img/jchs-scena/musical_9.jpg", caption: "JCHS — scéna 9" },
    { src: "img/jchs-scena/musical_10.jpg", caption: "JCHS — scéna 10" },
    { src: "img/jchs-scena/musical_11.jpg", caption: "JCHS — scéna 11" },
    { src: "img/jchs-scena/musical_12.jpg", caption: "JCHS — scéna 12" },

  ],
  church: [
    { src: "img/church/1.jpg", caption: "Koncert v kostele — warm atmosphere" },
    { src: "img/church/2.jpg", caption: "Koncert v kostele — beams & architecture" },
    { src: "img/church/3.jpg", caption: "Koncert v kostele — detail" },
  ],
  // led: [] // zatím prázdné -> tile může být disabled
};

(function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return; // když nemáš modal v HTML, nic se nespustí

  const imgEl = document.getElementById("lightboxImg");
  const capEl = document.getElementById("lightboxCaption");
  const thumbsEl = document.getElementById("lightboxThumbs");

  const btnNext = lightbox.querySelector("[data-next]");
  const btnPrev = lightbox.querySelector("[data-prev]");

  let currentGalleryKey = null;
  let currentIndex = 0;
  let lastFocusedEl = null;

  const isOpen = () => lightbox.classList.contains("is-open");

  function openLightbox(galleryKey, startIndex = 0) {
    const items = GALLERIES[galleryKey];
    if (!items || !items.length) return;

    currentGalleryKey = galleryKey;
    currentIndex = startIndex;
    lastFocusedEl = document.activeElement;

    renderThumbs();
    renderImage();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");

    // lock scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // focus close (první [data-close] je backdrop, tak bereme close button uvnitř panelu)
    const closeBtn = lightbox.querySelector(".lightbox__close");
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function renderImage() {
    const items = GALLERIES[currentGalleryKey] || [];
    if (!items.length) return;

    // wrap index
    currentIndex = (currentIndex + items.length) % items.length;

    const item = items[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.caption || "";
    capEl.textContent = item.caption || "";

    // highlight thumbs
    thumbsEl.querySelectorAll("button").forEach((btn, i) => {
      btn.setAttribute("aria-current", i === currentIndex ? "true" : "false");
    });

    // keep active thumb in view
    const active = thumbsEl.querySelector(`button[data-index="${currentIndex}"]`);
    if (active) active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function renderThumbs() {
    const items = GALLERIES[currentGalleryKey] || [];
    thumbsEl.innerHTML = "";

    items.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.index = i;
      btn.setAttribute("aria-label", `Open photo ${i + 1}`);
      btn.setAttribute("aria-current", i === currentIndex ? "true" : "false");

      const im = document.createElement("img");
      im.src = item.src;
      im.alt = item.caption || "";

      btn.appendChild(im);
      btn.addEventListener("click", () => {
        currentIndex = i;
        renderImage();
      });

      thumbsEl.appendChild(btn);
    });
  }

  function next() {
    currentIndex += 1;
    renderImage();
  }

  function prev() {
    currentIndex -= 1;
    renderImage();
  }

  /** Tile clicky **/
  document.querySelectorAll(".tile[data-gallery]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const key = tile.dataset.gallery;
      openLightbox(key, 0);
    });
  });

  /** Close: klik na backdrop nebo tlačítko X **/
  lightbox.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeLightbox();
  });

  /** Nav **/
  btnNext && btnNext.addEventListener("click", next);
  btnPrev && btnPrev.addEventListener("click", prev);

  /** Klávesy **/
  window.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  /** Swipe (mobil) **/
  let startX = null;
  imgEl.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  imgEl.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;

    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    startX = null;
  }, { passive: true });

  /** Expose pro debug (nepovinné) **/
  window.__openGallery = openLightbox;
})();