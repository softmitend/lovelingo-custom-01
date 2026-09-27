const EXTERNAL_COURSE_URL = "https://shortlink.win/1yTtJ";
const NOTION_GIFT_URL = "https://app.notion.com/p/Karena-ini-harimu-maka-tersenyumlah-3e6a0474ccce80cfb38bee4a26bc3d60?source=copy_link";
const CERTIFICATE_URL = "/assets/certificate-adoption.pdf";
const MUSIC_URL = "/assets/hanya-untukmu.m4a";
const EXTERNAL_KEY = "lovelingo-custom-01-external-course-opened";

let giftAudio = null;
let chestWasNaturallyUnlocked = false;
let enhancing = false;

function hasOpenedExternalCourse() {
  return localStorage.getItem(EXTERNAL_KEY) === "yes";
}

function openExternalCourse() {
  localStorage.setItem(EXTERNAL_KEY, "yes");
  window.open(EXTERNAL_COURSE_URL, "_blank", "noopener,noreferrer");
  enhanceHome();
}

function ensureExternalCourse() {
  const stage = document.querySelector(".path-stage");
  const chestStop = stage?.querySelector(".chest-stop");
  if (!stage || !chestStop || stage.querySelector("[data-external-course]")) return;

  const done = hasOpenedExternalCourse();
  const node = document.createElement("div");
  node.className = "path-stop right custom-external-stop";
  node.dataset.externalCourse = "true";
  node.innerHTML = `
    <button class="lesson-node unlocked custom-external-node" type="button" aria-label="Buka course tambahan">
      <span class="node-face"><span class="custom-external-icon"><i class="bi bi-box-arrow-up-right"></i></span></span>
    </button>
    <div class="lesson-copy unlocked">
      <strong>Course tambahan</strong>
      <span>${done ? "Sudah dibuka • buka lagi" : "Buka course di web luar"}</span>
    </div>
  `;
  node.querySelector("button")?.addEventListener("click", openExternalCourse);
  chestStop.before(node);
}

function guardChest() {
  const chest = document.querySelector("[data-chest]");
  if (!chest) return;

  if (!chest.dataset.customerObserved) {
    chestWasNaturallyUnlocked = !chest.disabled && (chest.classList.contains("unlocked") || chest.classList.contains("opened"));
    chest.dataset.customerObserved = "true";
  }

  const copy = chest.closest(".chest-stop")?.querySelector(".lesson-copy");
  if (!hasOpenedExternalCourse()) {
    if (!chest.disabled) chestWasNaturallyUnlocked = true;
    chest.disabled = true;
    chest.classList.remove("unlocked");
    chest.classList.add("locked", "custom-course-pending");
    if (copy && chestWasNaturallyUnlocked) {
      copy.classList.remove("unlocked");
      copy.classList.add("locked");
      copy.querySelector("strong")?.replaceChildren(document.createTextNode("Final chest"));
      copy.querySelector("span")?.replaceChildren(document.createTextNode("Buka course tambahan dulu"));
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
      copy.querySelector("span")?.replaceChildren(document.createTextNode("Ada sesuatu untukmu"));
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
    guardChest();
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
window.addEventListener("load", enhanceHome);
enhanceHome();
