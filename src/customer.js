import { experience } from "./data.js";

const EXTERNAL_COURSE_URL = "https://shortlink.win/1yTtJ";
const NOTION_GIFT_URL = "https://app.notion.com/p/Karena-ini-harimu-maka-tersenyumlah-3e6a0474ccce80cfb38bee4a26bc3d60?source=copy_link";
const CERTIFICATE_URL = "/assets/certificate-adoption.pdf";
const BACKGROUND_STORY_URL = "/assets/selfie-background-story.pdf";
const MUSIC_URL = "/assets/hanya-untukmu.m4a";
const EXTERNAL_KEY = "lovelingo-custom-01-external-course-opened";

let giftAudio = null;
let chestWasNaturallyUnlocked = false;
let enhancing = false;
let customerPathObserver = null;

function hasOpenedExternalCourse() {
  return localStorage.getItem(EXTERNAL_KEY) === "yes";
}

function areInternalLessonsComplete() {
  try {
    const progress = JSON.parse(localStorage.getItem("lovelingo-progress-v1"));
    const completed = Array.isArray(progress?.completed) ? progress.completed : [];
    return experience.lessons.every((lesson) => completed.includes(lesson.id));
  } catch {
    return false;
  }
}

function setTextIfChanged(element, text) {
  if (element && element.textContent !== text) element.textContent = text;
}

function openExternalCourse() {
  if (!areInternalLessonsComplete()) return;

  localStorage.setItem(EXTERNAL_KEY, "yes");
  window.open(EXTERNAL_COURSE_URL, "_blank", "noopener,noreferrer");
  const label = document.querySelector("[data-external-course] .lesson-copy span");
  const node = document.querySelector("[data-external-course] .custom-external-node");
  setTextIfChanged(label, "Sudah dibuka • buka lagi");
  node?.classList.add("custom-external-visited");
  guardChest();
}

function ensureExternalCourse() {
  const stage = document.querySelector(".path-stage");
  const chestStop = stage?.querySelector(".chest-stop");
  if (!stage || !chestStop || stage.querySelector("[data-external-course]")) return;

  const done = hasOpenedExternalCourse();
  const unlocked = areInternalLessonsComplete();
  const node = document.createElement("div");
  node.className = "path-stop right custom-external-stop";
  node.dataset.externalCourse = "true";
  node.innerHTML = `
    <button class="lesson-node ${unlocked ? "unlocked" : "locked"} custom-external-node ${done ? "custom-external-visited" : ""}" type="button" ${unlocked ? "" : "disabled"} aria-label="${unlocked ? "Buka course tambahan" : "Selesaikan semua lesson untuk membuka course tambahan"}">
      <span class="node-face"><span class="custom-external-icon"><i class="bi bi-journal-bookmark-fill"></i></span></span>
    </button>
    <div class="lesson-copy ${unlocked ? "unlocked" : "locked"}">
      <strong>Course tambahan</strong>
      <span>${unlocked ? (done ? "Sudah dibuka • buka lagi" : "Buka course di web luar") : "Selesaikan semua lesson dulu"}</span>
    </div>
  `;
  node.querySelector("button")?.addEventListener("click", openExternalCourse);
  chestStop.before(node);
  watchCustomerPath(stage);
  requestAnimationFrame(syncCustomerPathLine);
}

function syncExternalCourse() {
  const wrapper = document.querySelector("[data-external-course]");
  const node = wrapper?.querySelector(".custom-external-node");
  const copy = wrapper?.querySelector(".lesson-copy");
  const subtitle = copy?.querySelector("span");
  if (!node || !copy) return;

  const unlocked = areInternalLessonsComplete();
  const done = hasOpenedExternalCourse();
  node.disabled = !unlocked;
  node.classList.toggle("unlocked", unlocked);
  node.classList.toggle("locked", !unlocked);
  copy.classList.toggle("unlocked", unlocked);
  copy.classList.toggle("locked", !unlocked);
  node.setAttribute(
    "aria-label",
    unlocked ? "Buka course tambahan" : "Selesaikan semua lesson untuk membuka course tambahan"
  );
  setTextIfChanged(
    subtitle,
    unlocked ? (done ? "Sudah dibuka • buka lagi" : "Buka course di web luar") : "Selesaikan semua lesson dulu"
  );
}

function syncCustomerPathLine() {
  const stage = document.querySelector(".path-stage");
  const svg = stage?.querySelector(".path-line");
  const path = svg?.querySelector("path");
  if (!stage || !svg || !path) return;

  const nodes = [
    ...stage.querySelectorAll(".lesson-node:not(.custom-external-node)"),
    stage.querySelector(".custom-external-node"),
    stage.querySelector(".chest-node")
  ].filter(Boolean);
  if (nodes.length < 2) return;

  const stageRect = stage.getBoundingClientRect();
  const width = stage.clientWidth;
  const height = stage.scrollHeight;
  const points = nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return {
      x: rect.left - stageRect.left + rect.width / 2,
      y: rect.top - stageRect.top + rect.height / 2
    };
  });

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const point = points[i];
    const midY = (previous.y + point.y) / 2;
    d += ` C ${previous.x.toFixed(2)} ${midY.toFixed(2)}, ${point.x.toFixed(2)} ${midY.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }
  path.setAttribute("d", d);
}

function watchCustomerPath(stage) {
  if (!("ResizeObserver" in window)) return;
  customerPathObserver?.disconnect();
  customerPathObserver = new ResizeObserver(() => requestAnimationFrame(syncCustomerPathLine));
  customerPathObserver.observe(stage);
}

function guardChest() {
  const chest = document.querySelector("[data-chest]");
  if (!chest) return;

  if (!chest.dataset.customerObserved) {
    chestWasNaturallyUnlocked = !chest.disabled && (chest.classList.contains("unlocked") || chest.classList.contains("opened"));
    chest.dataset.customerObserved = "true";
  }

  const copy = chest.closest(".chest-stop")?.querySelector(".lesson-copy");
  const title = copy?.querySelector("strong");
  const subtitle = copy?.querySelector("span");

  if (!hasOpenedExternalCourse()) {
    if (!chest.disabled) chestWasNaturallyUnlocked = true;
    chest.disabled = true;
    chest.classList.remove("unlocked");
    chest.classList.add("locked", "custom-course-pending");
    if (copy && chestWasNaturallyUnlocked) {
      copy.classList.remove("unlocked");
      copy.classList.add("locked");
      setTextIfChanged(title, "Final chest");
      setTextIfChanged(subtitle, "Buka course tambahan dulu");
    }
    return;
  }

  if (chestWasNaturallyUnlocked) {
    chest.disabled = false;
    chest.classList.remove("locked", "custom-course-pending");
    chest.classList.add("unlocked");
    if (copy) {
      copy.classList.remove("locked");
      copy.classList.add("unlocked");
      setTextIfChanged(subtitle, "Ada sesuatu untukmu");
    }
  }
}

function ensureAudio() {
  if (giftAudio) return giftAudio;
  giftAudio = new Audio(MUSIC_URL);
  giftAudio.preload = "auto";
  giftAudio.volume = 0.82;
  giftAudio.loop = false;
  document.body.appendChild(giftAudio);
  return giftAudio;
}

function startGiftMusic() {
  const audio = ensureAudio();
  if (!audio.paused) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function addMusicHook() {
  const chest = document.querySelector("#big-chest");
  if (!chest || chest.dataset.musicHooked) return;
  chest.dataset.musicHooked = "true";
  chest.addEventListener("click", startGiftMusic, { once: true });
}

function enhanceFinalGift() {
  const letter = document.querySelector(".final-letter");
  if (!letter || letter.querySelector(".customer-gift-section")) return;

  const divider = letter.querySelector(".letter-divider");
  const gift = document.createElement("section");
  gift.className = "customer-gift-section";
  gift.innerHTML = `
    <div class="customer-gift-intro">
      <span class="customer-gift-spark"><i class="bi bi-gift-fill"></i></span>
      <div>
        <p class="customer-gift-kicker">ONE MORE THING</p>
        <h3>Ada dua hadiah kecil yang menunggumu.</h3>
      </div>
    </div>
    <p class="customer-gift-story">Ada satu hadiah lagi yang nggak bisa dimasukin ke dalam kotak ini, jadi aku titipkan jalannya di sini. Dan hari ini ternyata bukan cuma tentang kamu. Ada satu makhluk kecil bernama <strong>Selfie</strong> yang juga mendapat dukungan lewat sebuah adopsi. Buka satu per satu, ya.</p>
    <div class="customer-gift-actions">
      <a class="customer-gift-button notion" href="${NOTION_GIFT_URL}" target="_blank" rel="noopener noreferrer">
        <i class="bi bi-stars"></i><span><b>Buka hadiah untukmu</b><small>Membuka halaman Notion di tab baru</small></span><i class="bi bi-arrow-up-right"></i>
      </a>
      <a class="customer-gift-button certificate" href="${CERTIFICATE_URL}" target="_blank" rel="noopener noreferrer">
        <i class="bi bi-patch-check-fill"></i><span><b>Lihat sertifikat adopsi Selfie</b><small>PDF certificate of adoption</small></span><i class="bi bi-arrow-up-right"></i>
      </a>
      <a class="customer-gift-button story" href="${BACKGROUND_STORY_URL}" target="_blank" rel="noopener noreferrer">
        <i class="bi bi-journal-heart"></i><span><b>Baca kisah Selfie</b><small>Perjalanan penyelamatan dan rehabilitasinya</small></span><i class="bi bi-arrow-up-right"></i>
      </a>
    </div>
    <div class="customer-music-note"><i class="bi bi-music-note-beamed"></i><span>Lagu akan tetap diputar selama halaman LoveLingo ini tetap terbuka. Link hadiah sengaja dibuka di tab baru.</span></div>
  `;
  divider?.before(gift);
}

function enhanceHome() {
  if (enhancing) return;
  enhancing = true;
  try {
    ensureExternalCourse();
    syncExternalCourse();
    guardChest();
    requestAnimationFrame(syncCustomerPathLine);
  } finally {
    enhancing = false;
  }
}

const observer = new MutationObserver(() => {
  enhanceHome();
  addMusicHook();
  enhanceFinalGift();
});

observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener("resize", () => requestAnimationFrame(syncCustomerPathLine));
window.addEventListener("load", enhanceHome);
enhanceHome();
