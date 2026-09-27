import "./style.css";
import { experience } from "./data.js";

const STORAGE_KEY = "lovelingo-progress-v1";
const THEME_KEY = "lovelingo-theme";
const EXTERNAL_COURSE_KEY = "lovelingo-custom-01-external-course-opened";
const defaultState = {
  completed: [],
  xp: 0,
  hearts: 5,
  chestOpened: false,
  streak: 1
};

let state = loadState();
let currentLessonIndex = null;
let exerciseIndex = 0;
let selectedAnswer = null;
let exerciseLocked = false;
let exerciseOutcome = null;
let pathResizeObserver = null;
let matchState = null;
let arrangeState = null;

const app = document.querySelector("#app");

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isLessonUnlocked(index) {
  if (index === 0) return true;
  return state.completed.includes(experience.lessons[index - 1].id);
}

function isLessonComplete(index) {
  return state.completed.includes(experience.lessons[index].id);
}

function isChestUnlocked() {
  return experience.lessons.every((lesson) => state.completed.includes(lesson.id));
}

function duoGemIcon() {
  return `
    <span class="svg-icon duo-gem-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M5.3 4.5h13.4L22 9.2 12 20 2 9.2l3.3-4.7Z"></path>
        <path d="M2.3 9.2h19.4M5.3 4.5l3.2 4.7L12 20l3.5-10.8 3.2-4.7M8.5 9.2h7"></path>
      </svg>
    </span>
  `;
}

function duoCheckIcon() {
  return `
    <span class="svg-icon duo-check-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="presentation" focusable="false">
        <path d="M14 24.5l6.1 6.1L34 16.8" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </span>
  `;
}

function duoWrongIcon() {
  return `
    <span class="svg-icon duo-wrong-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="presentation" focusable="false">
        <path d="M17 17l14 14M31 17L17 31" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </span>
  `;
}

function icon(name) {
  if (name === "gem") return duoGemIcon();
  if (name === "check") return duoCheckIcon();

  const icons = {
    home: "house-door-fill",
    letter: "envelope-heart-fill",
    heart: "heart-fill",
    star: "star-fill",
    crown: "trophy-fill",
    sound: "volume-up-fill",
    close: "x-lg",
    check: "check-lg",
    lock: "lock-fill",
    guide: "journal-text",
    rotate: "arrow-counterclockwise",
    fire: "fire",
    gem: "gem",
    eye: "eye-fill",
    gift: "gift-fill",
    warning: "exclamation-lg",
    bolt: "lightning-charge-fill",
    moon: "moon-stars-fill",
    sun: "sun-fill"
  };
  return `<span class="svg-icon" aria-hidden="true"><i class="bi bi-${icons[name] || icons.heart}"></i></span>`;
}

function duoStarIcon() {
  return `
    <span class="duo-star duo-love-badge" aria-hidden="true">
      <svg viewBox="0 0 88 80" role="presentation" focusable="false">
        <defs>
          <linearGradient id="loveBadgeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#84ea2d" />
            <stop offset="100%" stop-color="#58cc02" />
          </linearGradient>
          <linearGradient id="loveBadgeGloss" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="M20 14c4.8-4.6 10.7-7 17.6-7h12.8C66.4 7 78 18.6 78 32.9v12.4C78 59 67.1 70 53.4 70H34.1C20.4 70 10 59.5 10 45.8V31.9C10 25 13.8 18.4 20 14Z" fill="#49a400"></path>
        <path d="M20 9c4.8-4.6 10.7-7 17.6-7h12.8C66.4 2 78 13.6 78 27.9v12.4C78 54 67.1 65 53.4 65H34.1C20.4 65 10 54.5 10 40.8V26.9C10 20 13.8 13.4 20 9Z" fill="url(#loveBadgeFill)"></path>
        <rect x="18" y="10" width="30" height="13" rx="7" fill="url(#loveBadgeGloss)"></rect>
        <path d="M44 49.5l-4-3.5C29.3 36.7 22.5 30.6 22.5 23.2c0-5.9 4.6-10.5 10.5-10.5c3.4 0 6.5 1.6 8.5 4.2c1.1 1.4 1.9 2.9 2.5 4.4c.6-1.5 1.4-3 2.5-4.4c2-2.6 5.1-4.2 8.5-4.2c5.9 0 10.5 4.6 10.5 10.5c0 7.4-6.8 13.5-17.5 22.8L44 49.5Z" fill="#ffffff"></path>
      </svg>
    </span>
  `;
}

function lessonSymbol(lesson) {
  return `<span class="node-symbol node-symbol-${lesson.icon}">${duoStarIcon()}</span>`;
}

function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setTheme(theme, { persist = true } = {}) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  if (persist) localStorage.setItem(THEME_KEY, nextTheme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", nextTheme === "dark" ? "#131f24" : "#ffffff");

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const isDark = nextTheme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap");
    const iconSlot = button.querySelector("[data-theme-icon]");
    const copy = button.querySelector("[data-theme-copy]");
    if (iconSlot) iconSlot.innerHTML = icon(isDark ? "sun" : "moon");
    if (copy) copy.textContent = isDark ? "MODE TERANG" : "MODE GELAP";
  });
}

function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

function themeToggleMarkup({ compact = false } = {}) {
  const isDark = getTheme() === "dark";
  return `
    <button class="theme-toggle ${compact ? "theme-toggle-compact" : ""}" data-theme-toggle type="button" aria-pressed="${isDark}" aria-label="${isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}">
      <span class="theme-toggle-icon" data-theme-icon>${icon(isDark ? "sun" : "moon")}</span>
      ${compact ? "" : `<span class="theme-toggle-label" data-theme-copy>${isDark ? "MODE TERANG" : "MODE GELAP"}</span>`}
      <span class="theme-switch-track" aria-hidden="true"><span class="theme-switch-knob"></span></span>
    </button>
  `;
}

let loveLingoTransitionActive = false;

function loveLingoLoaderMarkup(message = "Menyiapkan perjalananmu...") {
  return `
    <div class="lovelingo-loader" role="status" aria-live="polite" aria-label="${escapeAttr(message)}">
      <div class="lovelingo-loader-inner">
        <div class="lovelingo-loader-track" aria-hidden="true">
          <span class="lovelingo-loader-shadow"></span>
          <div class="lovelingo-loader-mover">
            <div class="lovelingo-loader-character">
              <span class="lovelingo-loader-shine"></span>
              <span class="lovelingo-loader-eye left"><i></i></span>
              <span class="lovelingo-loader-eye right"><i></i></span>
              <span class="lovelingo-loader-heart">♥</span>
              <span class="lovelingo-loader-foot left"></span>
              <span class="lovelingo-loader-foot right"></span>
            </div>
          </div>
        </div>
        <div class="lovelingo-loader-wordmark"><span>Love</span>Lingo</div>
        <p>${message}<span class="lovelingo-loader-dots" aria-hidden="true"><i></i><i></i><i></i></span></p>
        <div class="lovelingo-loader-progress" aria-hidden="true"><span></span></div>
      </div>
    </div>
  `;
}

function withLoveLingoLoading(action, { message = "Menyiapkan perjalananmu...", duration = 1400 } = {}) {
  if (loveLingoTransitionActive) return;
  loveLingoTransitionActive = true;

  document.querySelector(".lovelingo-loader")?.remove();
  const holder = document.createElement("div");
  holder.innerHTML = loveLingoLoaderMarkup(message);
  const loader = holder.firstElementChild;
  document.body.appendChild(loader);
  document.body.setAttribute("aria-busy", "true");

  requestAnimationFrame(() => loader.classList.add("is-visible"));

  window.setTimeout(() => {
    try {
      action?.();
    } finally {
      loader.classList.add("is-leaving");
      window.setTimeout(() => {
        loader.remove();
        document.body.removeAttribute("aria-busy");
        loveLingoTransitionActive = false;
      }, 190);
    }
  }, duration);
}

function renderApp() {
  app.innerHTML = `
    <div class="app-shell">
      ${desktopSidebar()}
      <main class="course-shell">
        ${mobileTopbar()}
        <div class="course-column">
          ${unitHeader()}
          ${pathMarkup()}
        </div>
      </main>
      ${rightRail()}
      ${mobileNav()}
    </div>
    <div id="overlay-root"></div>
  `;
  bindHomeEvents();
  requestAnimationFrame(syncPathLine);
  observePathLine();
}

function desktopSidebar() {
  return `
    <aside class="sidebar">
      <button class="brand" aria-label="LoveLingo home">
        <span class="brand-mark">${icon("heart")}</span><span>${experience.brand}</span>
      </button>
      <nav class="side-nav">
        <button class="nav-item active">${icon("home")}<span>BELAJAR</span></button>
        <button class="nav-item" data-scroll-card>${icon("letter")}<span>PESAN</span></button>
      </nav>
      <div class="sidebar-bottom">
        ${themeToggleMarkup()}
        <button class="nav-item reset-link" data-reset>${icon("rotate")}<span>ULANGI</span></button>
      </div>
    </aside>
  `;
}

function mobileTopbar() {
  return `
    <div class="mobile-topbar">
      <div class="mini-stat">${icon("fire")}<b>${state.streak}</b></div>
      <div class="mini-stat">${icon("gem")}<b>${state.xp}</b></div>
      <div class="mini-stat hearts-stat">${icon("heart")}<b>${state.hearts}</b></div>
      ${themeToggleMarkup({ compact: true })}
    </div>
  `;
}

function unitHeader() {
  return `
    <section class="unit-card">
      <div>
        <p>${experience.section}, ${experience.unit}</p>
        <h1>${experience.unitTitle}</h1>
      </div>
      <button class="guide-button" data-guide>${icon("guide")}<span>GUIDEBOOK</span></button>
    </section>
  `;
}

function pathMarkup() {
  const positions = ["center", "right", "left"];
  const nodes = experience.lessons.map((lesson, index) => {
    const complete = isLessonComplete(index);
    const unlocked = isLessonUnlocked(index);
    const status = complete ? "complete" : unlocked ? "unlocked" : "locked";
    const startPill = index === 0 && !complete ? `<div class="start-pill">START</div>` : "";
    return `
      <div class="path-stop ${positions[index % positions.length]}" data-path-stop="${index}">
        ${startPill}
        <button class="lesson-node ${status}" data-lesson="${index}" ${unlocked ? "" : "disabled"} aria-label="${lesson.label}">
          <span class="node-face">${complete ? duoStarIcon() : unlocked ? lessonSymbol(lesson) : icon("lock")}</span>
        </button>
        <div class="lesson-copy ${status}">
          <strong>${lesson.label}</strong>
          <span>${complete ? "Selesai" : unlocked ? lesson.shortLabel : "Terkunci"}</span>
        </div>
      </div>
    `;
  }).join("");

  const chestUnlocked = isChestUnlocked();
  const chestStatus = state.chestOpened ? "opened" : chestUnlocked ? "unlocked" : "locked";
  const companions = experience.topThreeCards.map((card, index) => companionMarkup(card, index)).join("");

  return `
    <section class="path-stage">
      <svg class="path-line" aria-hidden="true"><path></path></svg>
      ${nodes}
      <div class="path-stop center chest-stop" data-path-stop="chest">
        <button class="chest-node ${chestStatus}" data-chest ${chestUnlocked ? "" : "disabled"} aria-label="Final chest">
          ${chestMarkup("small", chestStatus)}
        </button>
        <div class="lesson-copy ${chestUnlocked ? "unlocked" : "locked"}">
          <strong>${state.chestOpened ? "Suratmu sudah terbuka" : "Final chest"}</strong>
          <span>${chestUnlocked ? "Ada sesuatu untukmu" : "Selesaikan semua level"}</span>
        </div>
      </div>
      ${companions}
    </section>
    <div class="cheer-card">
      <div class="cheer-face">${icon("heart")}</div>
      <div><strong>${progressPercent()}% selesai</strong><span>${isChestUnlocked() ? "Chest sudah siap dibuka!" : "Sedikit demi sedikit."}</span></div>
    </div>
  `;
}

function companionMarkup(card, index) {
  const positions = ["left-top", "right-middle"];
  const variation = index % 2 === 0 ? "lime" : "blue";
  const alignLesson = index === 0 ? 1 : 2;
  const alignAttr = ` data-align-lesson="${alignLesson}"`;
  return `
    <button class="path-companion ${positions[index % positions.length]}" data-top-card="${index}"${alignAttr} aria-label="${card.title}">
      <div class="companion-badge companion-${variation}">
        <div class="mascot mascot-${variation}">
          <span class="mascot-eye left"></span>
          <span class="mascot-eye right"></span>
          <span class="mascot-pupil left"></span>
          <span class="mascot-pupil right"></span>
          <span class="mascot-foot left"></span>
          <span class="mascot-foot right"></span>
          <span class="mascot-wing"></span>
        </div>
      </div>
      <div class="companion-stars">${duoMiniStars()}</div>
      <span class="companion-title">TOP 3</span>
    </button>
  `;
}

function duoMiniStars() {
  return Array.from({ length: 3 }, () => `<span class="mini-star">${icon("star")}</span>`).join("");
}

function chestMarkup(size, status) {
  const lock = status === "locked" ? `<span class="chest-small-lock">${icon("lock")}</span>` : "";
  const baseClass = size === "big" ? "duo-chest duo-chest-big" : "duo-chest";
  return `
    <span class="${baseClass}">
      <span class="chest-shadow"></span>
      <span class="chest-crate">
        <span class="crate-lid"></span>
        <span class="crate-body"></span>
        <span class="strap strap-left"></span>
        <span class="strap strap-right"></span>
        <span class="belt belt-horizontal"></span>
        <span class="chest-lock-core"></span>
      </span>
      ${lock}
    </span>
  `;
}

function rightRail() {
  return `
    <aside class="right-rail">
      <div class="rail-stats">
        <div class="rail-stat">${icon("fire")}<b>${state.streak}</b></div>
        <div class="rail-stat">${icon("gem")}<b>${state.xp}</b></div>
        <div class="rail-stat hearts-stat">${icon("heart")}<b>${state.hearts}</b></div>
      </div>
      <section class="rail-card">
        <div class="rail-title"><h3>Progress</h3><span>${progressPercent()}%</span></div>
        <div class="rail-progress"><span style="width:${progressPercent()}%"></span></div>
        <p>${completedProgressSteps()} dari ${totalProgressSteps()} tahap selesai</p>
      </section>
      <section class="rail-card streak-card">
        <div class="streak-emoji">${icon("letter")}</div>
        <div><h3>Pesan rahasia</h3><p>Chest terakhir akan membuka kartu ucapan sesungguhnya.</p></div>
      </section>
    </aside>
  `;
}

function mobileNav() {
  return `
    <nav class="mobile-nav">
      <button class="active">${icon("home")}<span>Belajar</span></button>
      <button data-scroll-card>${icon("letter")}<span>Pesan</span></button>
      <button data-reset>${icon("rotate")}<span>Ulangi</span></button>
    </nav>
  `;
}

function progressPercent() {
  return Math.round((completedProgressSteps() / totalProgressSteps()) * 100);
}

function totalProgressSteps() {
  return experience.lessons.length + 2;
}

function completedProgressSteps() {
  const lessonIds = new Set(experience.lessons.map((lesson) => lesson.id));
  const completedLessons = new Set(state.completed.filter((id) => lessonIds.has(id))).size;
  const lessonsComplete = completedLessons === experience.lessons.length;
  const externalCourseOpened = lessonsComplete && localStorage.getItem(EXTERNAL_COURSE_KEY) === "yes";
  const chestOpened = externalCourseOpened && state.chestOpened;
  return completedLessons + (externalCourseOpened ? 1 : 0) + (chestOpened ? 1 : 0);
}

function scrollIntoVerticalCenter(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const top = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function bindHomeEvents() {
  document.querySelectorAll("[data-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      const lessonIndex = Number(button.dataset.lesson);
      if (!isLessonUnlocked(lessonIndex)) return;
      withLoveLingoLoading(() => openLesson(lessonIndex), { message: "Menyiapkan lesson..." });
    });
  });
  document.querySelector("[data-chest]")?.addEventListener("click", () => {
    if (!isChestUnlocked()) return;
    withLoveLingoLoading(openChest, { message: "Membuka pesan spesial...", duration: 1550 });
  });
  document.querySelectorAll("[data-reset]").forEach((button) => button.addEventListener("click", resetProgress));
  document.querySelector("[data-guide]")?.addEventListener("click", openGuide);
  document.querySelectorAll("[data-scroll-card]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isChestUnlocked()) {
        withLoveLingoLoading(openChest, { message: "Membuka pesan spesial...", duration: 1550 });
      } else {
        scrollIntoVerticalCenter(document.querySelector(".chest-stop"));
      }
    });
  });
  document.querySelectorAll("[data-top-card]").forEach((button) => {
    button.addEventListener("click", () => openTopThree(Number(button.dataset.topCard)));
  });
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });
}

function observePathLine() {
  pathResizeObserver?.disconnect();
  const stage = document.querySelector(".path-stage");
  if (!stage || !("ResizeObserver" in window)) return;
  pathResizeObserver = new ResizeObserver(() => syncPathLine());
  pathResizeObserver.observe(stage);
}

function stablePathPoint(stageRect, node) {
  const rect = node.getBoundingClientRect();
  let ownTranslateX = 0;
  let ownTranslateY = 0;
  const transform = getComputedStyle(node).transform;

  if (transform && transform !== "none") {
    try {
      const matrix = new DOMMatrixReadOnly(transform);
      ownTranslateX = matrix.m41;
      ownTranslateY = matrix.m42;
    } catch {
      // The visual center is still a safe fallback in older browsers.
    }
  }

  return {
    x: rect.left - stageRect.left + rect.width / 2 - ownTranslateX,
    y: rect.top - stageRect.top + rect.height / 2 - ownTranslateY
  };
}

function syncPathLine() {
  const stage = document.querySelector(".path-stage");
  const svg = stage?.querySelector(".path-line");
  const path = svg?.querySelector("path");
  if (!stage || !svg || !path) return;

  // A transformed stop can make scrollIntoView move this overflow container
  // sideways. Keep the route in its intended horizontal coordinate space.
  if (stage.scrollLeft !== 0) stage.scrollLeft = 0;

  const nodes = [
    ...stage.querySelectorAll(".lesson-node"),
    stage.querySelector(".chest-node")
  ].filter(Boolean);
  if (nodes.length < 2) return;

  const stageRect = stage.getBoundingClientRect();
  const width = stage.clientWidth;
  const height = stage.scrollHeight;
  const points = nodes.map((node) => stablePathPoint(stageRect, node));

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const point = points[i];
    const midY = (prev.y + point.y) / 2;
    d += ` C ${prev.x.toFixed(2)} ${midY.toFixed(2)}, ${point.x.toFixed(2)} ${midY.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }
  path.setAttribute("d", d);
  syncCompanionAlignment(stage);
}

function syncCompanionAlignment(stage) {
  stage.querySelectorAll("[data-align-lesson]").forEach((companion) => {
    const lessonIndex = companion.dataset.alignLesson;
    const target = stage.querySelector(`[data-lesson="${lessonIndex}"]`);
    const badge = companion.querySelector(".companion-badge");
    if (!target || !badge) return;

    const stageRect = stage.getBoundingClientRect();
    const targetPoint = stablePathPoint(stageRect, target);
    const badgeRect = badge.getBoundingClientRect();
    companion.style.top = `${targetPoint.y - badgeRect.height / 2}px`;
  });
}

function resetProgress() {
  openDuoConfirm({
    eyebrow: "RESET PROGRESS",
    title: "Mulai lagi dari awal?",
    message: "Semua progress, XP, dan lesson yang sudah terbuka akan dihapus dari perangkat ini.",
    primaryLabel: "TETAP DI SINI",
    dangerLabel: "ULANGI DARI AWAL",
    mood: "worried",
    onConfirm: () => {
      state = { ...defaultState };
      localStorage.removeItem(EXTERNAL_COURSE_KEY);
      saveState();
      renderApp();
    }
  });
}

function duoQuitMascot(mood = "sad") {
  return `
    <div class="duo-dialog-mascot ${mood}" aria-hidden="true">
      <span class="duo-ear duo-ear-left"></span>
      <span class="duo-ear duo-ear-right"></span>
      <span class="duo-face">
        <span class="duo-eye duo-eye-left"><i></i></span>
        <span class="duo-eye duo-eye-right"><i></i></span>
        <span class="duo-tear duo-tear-left"></span>
        <span class="duo-tear duo-tear-right"></span>
        <span class="duo-beak"></span>
        <span class="duo-belly-mark"></span>
      </span>
      <span class="duo-foot duo-foot-left"></span>
      <span class="duo-foot duo-foot-right"></span>
      <span class="duo-ground"></span>
    </div>
  `;
}

function openDuoConfirm({
  eyebrow = "",
  title,
  message,
  primaryLabel = "LANJUT",
  dangerLabel = "KELUAR",
  mood = "sad",
  onConfirm
}) {
  const root = document.querySelector("#overlay-root");
  if (!root) return;

  const existing = root.querySelector(".duo-confirm-backdrop");
  existing?.remove();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="duo-confirm-backdrop">
      <section class="duo-confirm" role="alertdialog" aria-modal="true" aria-labelledby="duo-confirm-title" aria-describedby="duo-confirm-message">
        ${duoQuitMascot(mood)}
        ${eyebrow ? `<p class="duo-confirm-eyebrow">${eyebrow}</p>` : ""}
        <h2 id="duo-confirm-title">${title}</h2>
        <p id="duo-confirm-message" class="duo-confirm-message">${message}</p>
        <div class="duo-confirm-actions">
          <button class="duo-stay-button" type="button" data-duo-stay>${primaryLabel}</button>
          <button class="duo-quit-button" type="button" data-duo-quit>${dangerLabel}</button>
        </div>
      </section>
    </div>
  `;

  const modal = wrapper.firstElementChild;
  root.appendChild(modal);
  const stayButton = modal.querySelector(".duo-stay-button");
  const quitButton = modal.querySelector(".duo-quit-button");

  const close = () => {
    document.removeEventListener("keydown", onKeydown);
    modal.classList.add("is-closing");
    setTimeout(() => modal.remove(), 145);
  };

  const onKeydown = (event) => {
    if (event.key === "Escape") close();
    if (event.key === "Enter" && document.activeElement === quitButton) {
      close();
      onConfirm?.();
    }
  };

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest(".duo-stay-button")) close();
  });
  quitButton.addEventListener("click", () => {
    close();
    onConfirm?.();
  });
  document.addEventListener("keydown", onKeydown);

  requestAnimationFrame(() => {
    modal.classList.add("is-visible");
    stayButton?.focus();
  });
}

function openGuide() {
  const root = document.querySelector("#overlay-root");
  root.innerHTML = `
    <div class="modal-backdrop" data-close-modal>
      <section class="guide-modal" role="dialog" aria-modal="true">
        <button class="icon-button modal-close" data-close-modal>${icon("close")}</button>
        <div class="guide-hero">${icon("heart")}</div>
        <p class="eyebrow">GUIDEBOOK</p>
        <h2>${experience.guidebookTitle}</h2>
        <p>${experience.guidebookText}</p>
        <div class="guide-rules">
          <div><span>1</span><p>Mulai dari titik pertama.</p></div>
          <div><span>2</span><p>Selesaikan lesson untuk membuka titik berikutnya.</p></div>
          <div><span>3</span><p>Buka chest untuk membaca kartu akhir.</p></div>
        </div>
        <button class="primary-button" data-close-modal>GOT IT</button>
      </section>
    </div>
  `;
  root.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", (event) => {
    if (event.target.closest(".guide-modal") && !event.target.closest("[data-close-modal]")) return;
    root.innerHTML = "";
  }));
}

function openTopThree(index) {
  const card = experience.topThreeCards[index];
  if (!card) return;
  const root = document.querySelector("#overlay-root");
  root.innerHTML = `
    <div class="modal-backdrop" data-close-top>
      <section class="guide-modal top-three-modal" role="dialog" aria-modal="true">
        <button class="icon-button modal-close" data-close-top>${icon("close")}</button>
        <div class="top-three-head">
          <div class="top-three-stars">${duoMiniStars()}</div>
          <p class="eyebrow">BONUS CARD</p>
          <h2>${card.title}</h2>
          <p>${card.subtitle}</p>
        </div>
        <ol class="top-three-list">
          ${card.items.map((item, itemIndex) => `<li><span class="top-rank">${itemIndex + 1}</span><p>${item}</p></li>`).join("")}
        </ol>
        <button class="primary-button" data-close-top>CLOSE</button>
      </section>
    </div>
  `;
  root.querySelectorAll("[data-close-top]").forEach((el) => el.addEventListener("click", (event) => {
    if (event.target.closest(".top-three-modal") && !event.target.closest("[data-close-top]")) return;
    root.innerHTML = "";
  }));
}

function openLesson(index) {
  if (!isLessonUnlocked(index)) return;
  currentLessonIndex = index;
  exerciseIndex = 0;
  selectedAnswer = null;
  exerciseLocked = false;
  exerciseOutcome = null;
  matchState = null;
  arrangeState = null;
  if (state.hearts <= 0) {
    renderOutOfHearts();
    return;
  }
  renderExercise();
}

function renderExercise() {
  const lesson = experience.lessons[currentLessonIndex];
  if (exerciseIndex >= lesson.exercises.length) {
    finishLesson();
    return;
  }
  selectedAnswer = null;
  exerciseLocked = false;
  exerciseOutcome = null;
  matchState = null;
  arrangeState = null;

  const ex = lesson.exercises[exerciseIndex];
  const progress = Math.round((exerciseIndex / lesson.exercises.length) * 100);
  const root = document.querySelector("#overlay-root");
  root.innerHTML = `
    <section class="lesson-screen">
      <header class="lesson-header">
        <button class="lesson-close" data-exit-lesson>${icon("close")}</button>
        <div class="lesson-progress"><span style="width:${progress}%"></span></div>
        ${themeToggleMarkup({ compact: true })}
        <div class="lesson-hearts">${icon("heart")}<b>${state.hearts}</b></div>
      </header>
      <div class="exercise-wrap">
        <div class="exercise-content">
          <p class="exercise-kicker">${lesson.label}</p>
          ${renderExerciseType(ex)}
        </div>
      </div>
      <footer class="answer-footer neutral" id="answer-footer">
        <div class="feedback-copy" id="feedback-copy"></div>
        <button class="check-button" id="check-button" disabled>CHECK</button>
      </footer>
    </section>
  `;
  bindExerciseEvents(ex);
}

function renderExerciseType(ex) {
  if (ex.type === "choice") {
    return `
      <h2>${ex.prompt}</h2>
      <div class="character-row">
        <div class="mascot-bubble">${icon("heart")}</div>
        <div class="speech-card">${ex.question}</div>
      </div>
      <div class="choice-list">
        ${ex.choices.map((choice, i) => `<button class="choice-button" data-choice="${escapeAttr(choice)}"><span>${i + 1}</span>${choice}</button>`).join("")}
      </div>
    `;
  }

  if (ex.type === "fill") {
    const parts = ex.sentence.split("____");
    return `
      <h2>${ex.prompt}</h2>
      <div class="fill-sentence">${parts[0]}<span class="fill-blank" id="fill-blank">&nbsp;</span>${parts[1] || ""}</div>
      <div class="word-bank centered">
        ${ex.choices.map((choice) => `<button class="word-chip" data-fill="${escapeAttr(choice)}">${choice}</button>`).join("")}
      </div>
    `;
  }

  if (ex.type === "listen") {
    return `
      <h2>${ex.prompt}</h2>
      <div class="listen-hero">
        <button class="sound-button" data-speak>${icon("sound")}</button>
        <div><strong>Tap untuk mendengar</strong><span>Kamu bisa memutarnya lagi.</span></div>
      </div>
      <div class="choice-list">
        ${ex.choices.map((choice, i) => `<button class="choice-button" data-choice="${escapeAttr(choice)}"><span>${i + 1}</span>${choice}</button>`).join("")}
      </div>
    `;
  }

  if (ex.type === "arrange") {
    const words = shuffle([...ex.sentence.split(" "), ...(ex.distractors || [])]);
    arrangeState = { words, selected: [], target: ex.sentence };
    return `
      <h2>${ex.prompt}</h2>
      <p class="exercise-hint">${ex.hint || ""}</p>
      <div class="sentence-slots" id="sentence-slots"><span>Pilih kata dari bawah</span></div>
      <div class="word-bank" id="word-bank">
        ${words.map((word, i) => `<button class="word-chip" data-word-index="${i}">${word}</button>`).join("")}
      </div>
    `;
  }

  if (ex.type === "match") {
    const pairs = ex.pairs.map(([left, right], i) => ({ id: i, left, right }));
    matchState = { pairs, solved: new Set(), first: null };
    const lefts = shuffle(pairs.map((p) => ({ id: p.id, text: p.left, side: "left" })));
    const rights = shuffle(pairs.map((p) => ({ id: p.id, text: p.right, side: "right" })));
    return `
      <h2>${ex.prompt}</h2>
      <div class="match-grid">
        <div class="match-column">${lefts.map(matchButton).join("")}</div>
        <div class="match-column">${rights.map(matchButton).join("")}</div>
      </div>
      <p class="match-note">Tap satu kartu di kiri dan pasangannya di kanan.</p>
    `;
  }
  return "";
}

function matchButton(item) {
  return `<button class="match-button" data-match-id="${item.id}" data-match-side="${item.side}">${item.text}</button>`;
}

function bindExerciseEvents(ex) {
  const root = document.querySelector("#overlay-root");
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => button.addEventListener("click", toggleTheme));
  root.querySelector("[data-exit-lesson]")?.addEventListener("click", () => {
    openDuoConfirm({
      eyebrow: "LESSON IN PROGRESS",
      title: "Jangan menyerah!",
      message: "Kalau kamu keluar sekarang, progress di lesson ini tidak akan disimpan.",
      primaryLabel: "LANJUT BELAJAR",
      dangerLabel: "KELUAR DARI LESSON",
      mood: "sad",
      onConfirm: () => {
        withLoveLingoLoading(() => {
          root.innerHTML = "";
          renderApp();
        }, { message: "Kembali ke perjalanan...", duration: 1300 });
      }
    });
  });

  if (ex.type === "choice" || ex.type === "listen") {
    root.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        if (exerciseLocked) return;
        root.querySelectorAll("[data-choice]").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        selectedAnswer = button.dataset.choice;
        enableCheck();
      });
    });
  }

  if (ex.type === "fill") {
    root.querySelectorAll("[data-fill]").forEach((button) => {
      button.addEventListener("click", () => {
        if (exerciseLocked) return;
        root.querySelectorAll("[data-fill]").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        selectedAnswer = button.dataset.fill;
        root.querySelector("#fill-blank").textContent = selectedAnswer;
        enableCheck();
      });
    });
  }

  if (ex.type === "listen") {
    root.querySelector("[data-speak]")?.addEventListener("click", () => speak(ex.speech));
  }

  if (ex.type === "arrange") {
    root.querySelectorAll("[data-word-index]").forEach((button) => {
      button.addEventListener("click", () => toggleArrangeWord(Number(button.dataset.wordIndex)));
    });
  }

  if (ex.type === "match") {
    root.querySelectorAll("[data-match-id]").forEach((button) => button.addEventListener("click", () => onMatchClick(button)));
  }

  root.querySelector("#check-button")?.addEventListener("click", () => checkExercise(ex));
}

function enableCheck() {
  const button = document.querySelector("#check-button");
  if (button) button.disabled = false;
}

function toggleArrangeWord(index) {
  if (exerciseLocked) return;
  const idx = arrangeState.selected.indexOf(index);
  if (idx >= 0) arrangeState.selected.splice(idx, 1);
  else arrangeState.selected.push(index);

  const root = document.querySelector("#overlay-root");
  root.querySelectorAll("[data-word-index]").forEach((button) => {
    button.classList.toggle("used", arrangeState.selected.includes(Number(button.dataset.wordIndex)));
  });
  const sentence = arrangeState.selected.map((i) => arrangeState.words[i]).join(" ");
  root.querySelector("#sentence-slots").innerHTML = sentence
    ? arrangeState.selected.map((i) => `<button class="selected-word" data-selected-word="${i}">${arrangeState.words[i]}</button>`).join("")
    : `<span>Pilih kata dari bawah</span>`;

  root.querySelectorAll("[data-selected-word]").forEach((button) => {
    button.addEventListener("click", () => toggleArrangeWord(Number(button.dataset.selectedWord)));
  });
  selectedAnswer = sentence;
  document.querySelector("#check-button").disabled = !sentence;
}

function onMatchClick(button) {
  if (exerciseLocked || button.classList.contains("solved")) return;
  const item = { id: Number(button.dataset.matchId), side: button.dataset.matchSide, button };

  if (!matchState.first) {
    matchState.first = item;
    button.classList.add("selected");
    return;
  }

  if (matchState.first.side === item.side) {
    matchState.first.button.classList.remove("selected");
    matchState.first = item;
    button.classList.add("selected");
    return;
  }

  const first = matchState.first;
  matchState.first = null;
  if (first.id === item.id) {
    first.button.classList.remove("selected");
    first.button.classList.add("solved");
    button.classList.add("solved");
    matchState.solved.add(item.id);
    if (matchState.solved.size === matchState.pairs.length) {
      selectedAnswer = "all-matched";
      enableCheck();
    }
  } else {
    state.hearts = Math.max(0, state.hearts - 1);
    saveState();
    updateVisibleHearts();

    first.button.classList.add("wrong-flash");
    button.classList.add("wrong-flash");
    setTimeout(() => {
      first.button.classList.remove("selected", "wrong-flash");
      button.classList.remove("wrong-flash");
      if (state.hearts <= 0) renderOutOfHearts();
    }, 450);
  }
}

function checkExercise(ex) {
  const footer = document.querySelector("#answer-footer");
  const check = document.querySelector("#check-button");
  const feedback = document.querySelector("#feedback-copy");

  if (exerciseLocked) {
    if (exerciseOutcome === "correct") {
      exerciseIndex += 1;
      renderExercise();
      return;
    }

    if (exerciseOutcome === "wrong") {
      if (state.hearts <= 0) {
        renderOutOfHearts();
      } else {
        renderExercise();
      }
      return;
    }
  }

  let correct = false;
  if (ex.type === "arrange") correct = normalize(selectedAnswer) === normalize(ex.sentence);
  else if (ex.type === "match") correct = selectedAnswer === "all-matched";
  else correct = selectedAnswer === ex.answer;

  exerciseLocked = true;
  exerciseOutcome = correct ? "correct" : "wrong";
  check.disabled = false;

  if (correct) {
    check.textContent = "CONTINUE";
    footer.className = "answer-footer correct";
    feedback.innerHTML = `<div class="feedback-icon">${icon("check")}</div><div><strong>Benar!</strong><span>${ex.success || "Nice. Kamu selangkah lebih dekat ke chest."}</span></div>`;
    state.xp += 5;
    saveState();
    return;
  }

  state.hearts = Math.max(0, state.hearts - 1);
  saveState();
  updateVisibleHearts();

  footer.className = "answer-footer wrong";
  feedback.innerHTML = `<div class="feedback-icon">${duoWrongIcon()}</div><div><strong>Belum tepat</strong><span>${state.hearts > 0 ? `Coba lagi. Tersisa ${state.hearts} heart.` : "Heart habis. Lesson harus diulang."}</span></div>`;
  check.textContent = state.hearts > 0 ? "TRY AGAIN" : "CONTINUE";
}

function updateVisibleHearts() {
  document.querySelectorAll(".lesson-hearts b, .hearts-stat b").forEach((el) => {
    el.textContent = String(state.hearts);
  });
}

function renderOutOfHearts() {
  const root = document.querySelector("#overlay-root");
  root.innerHTML = `
    <section class="lesson-screen hearts-empty-screen">
      <div class="hearts-empty-card">
        <div class="hearts-empty-icon">${icon("heart")}</div>
        <p class="eyebrow">OUT OF HEARTS</p>
        <h2>Nyawamu habis</h2>
        <p>Kamu belum bisa lanjut ke soal berikutnya. Ulangi lesson ini dari awal untuk mencoba lagi.</p>
        <button class="primary-button" data-retry-lesson>ULANGI LESSON</button>
        <button class="secondary-button" data-return-path>KEMBALI KE PATH</button>
      </div>
    </section>
  `;

  root.querySelector("[data-retry-lesson]").addEventListener("click", () => {
    state.hearts = 5;
    exerciseIndex = 0;
    selectedAnswer = null;
    exerciseLocked = false;
    exerciseOutcome = null;
    matchState = null;
    arrangeState = null;
    saveState();
    renderExercise();
  });

  root.querySelector("[data-return-path]").addEventListener("click", () => {
    withLoveLingoLoading(() => {
      root.innerHTML = "";
      renderApp();
    }, { message: "Kembali ke perjalanan...", duration: 1300 });
  });
}

function finishLesson() {
  const lesson = experience.lessons[currentLessonIndex];
  if (!state.completed.includes(lesson.id)) {
    state.completed.push(lesson.id);
    state.xp += 10;
    saveState();
  }
  const root = document.querySelector("#overlay-root");
  root.innerHTML = `
    <section class="lesson-screen completion-screen">
      <div class="completion-card">
        <div class="completion-badge">${duoStarIcon()}</div>
        <p class="eyebrow">LESSON COMPLETE!</p>
        <h2>${lesson.label}</h2>
        <p>Kamu membuka bagian perjalanan berikutnya.</p>
        <div class="completion-stats">
          <div><span>TOTAL XP</span><strong>${state.xp}</strong></div>
          <div><span>HEARTS</span><strong class="stat-with-icon">${icon("heart")} ${state.hearts}</strong></div>
        </div>
        <button class="primary-button" data-return-path>CONTINUE</button>
      </div>
    </section>
  `;
  root.querySelector("[data-return-path]").addEventListener("click", () => {
    withLoveLingoLoading(() => {
      root.innerHTML = "";
      renderApp();
      setTimeout(() => {
        scrollIntoVerticalCenter(document.querySelector(`[data-path-stop="${Math.min(currentLessonIndex + 1, 2)}"]`));
      }, 50);
    }, { message: "Membuka level berikutnya...", duration: 1450 });
  });
}

function openChest() {
  if (!isChestUnlocked()) return;
  const root = document.querySelector("#overlay-root");
  root.innerHTML = `
    <div class="chest-overlay">
      <button class="icon-button chest-close" data-close-chest>${icon("close")}</button>
      <div class="chest-opening-stage">
        <div class="big-chest" id="big-chest">
          ${chestMarkup("big", "unlocked")}
          <div class="chest-glow"></div>
        </div>
        <p id="chest-instruction">Tap the chest</p>
      </div>
    </div>
  `;
  root.querySelector("[data-close-chest]").addEventListener("click", () => { root.innerHTML = ""; });
  root.querySelector("#big-chest").addEventListener("click", () => {
    const chest = root.querySelector("#big-chest");
    if (chest.classList.contains("open")) return;
    chest.classList.add("open");
    root.querySelector("#chest-instruction").textContent = "You found something...";
    state.chestOpened = true;
    state.xp += 25;
    saveState();
    setTimeout(() => renderFinalCard(root), 1050);
  });
}

function renderFinalCard(root) {
  root.innerHTML = `
    <section class="final-letter-screen">
      <div class="confetti" aria-hidden="true">${Array.from({ length: 20 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div>
      <button class="icon-button final-close" data-close-final>${icon("close")}</button>
      <article class="final-letter">
        <div class="letter-seal">${icon("heart")}</div>
        <p class="eyebrow">${experience.finalCard.eyebrow}</p>
        <h2>${experience.finalCard.title}</h2>
        ${experience.finalCard.paragraphs.map((p) => `<p>${p}</p>`).join("")}
        <div class="signature"><span>${experience.finalCard.closing}</span><strong>${experience.finalCard.signature}</strong></div>
        <div class="letter-divider">${icon("heart")}</div>
        <p class="tiny-note">You completed the whole journey • ${state.xp} XP</p>
      </article>
    </section>
  `;
  root.querySelector("[data-close-final]").addEventListener("click", () => {
    root.innerHTML = "";
    renderApp();
  });
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Browser ini belum mendukung text-to-speech.");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.92;
  utterance.pitch = 1.02;
  speechSynthesis.speak(utterance);
}

function normalize(value = "") {
  return value.toLowerCase().trim().replace(/[.,!?]/g, "").replace(/\s+/g, " ");
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeAttr(text) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bindPageLinkLoader() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:") || rawHref.startsWith("javascript:")) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.href === window.location.href) return;

    event.preventDefault();
    withLoveLingoLoading(() => {
      window.location.href = destination.href;
    }, { message: "Membuka halaman...", duration: 3000 });
  });
}

setTheme(getTheme(), { persist: false });
bindPageLinkLoader();
window.addEventListener("lovelingo:progress-changed", renderApp);
renderApp();
withLoveLingoLoading(() => {}, { message: "Menyiapkan LoveLingo...", duration: 1250 });
