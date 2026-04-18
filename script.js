// ================================================================
// script.js — LoveTrail v3: Revamped Edition
// ================================================================

import {
  db, generateRoomCode, createRoom, joinRoom,
  subscribeToRoom, updateRoom,
} from "./firebase.js";

// ─── Avatar SVGs ──────────────────────────────────────────────
const AVATAR_SVGS = {
  rose: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#FFE0EB"/><path d="M20 10 C20 10 14 15 14 20 C14 24 16.5 27 20 27 C23.5 27 26 24 26 20 C26 15 20 10 20 10Z" fill="#FF4D6D"/><path d="M16 19 C16 19 13 17 13 22 C13 25 15.5 27 18 27" fill="#E03060"/><path d="M24 19 C24 19 27 17 27 22 C27 25 24.5 27 22 27" fill="#E03060"/><rect x="19" y="27" width="2" height="5" rx="1" fill="#4CAF50"/><path d="M20 30 C20 30 16 28 15 30" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  star: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#FFF3CD"/><path d="M20 8 L22.5 15.5 L30.5 15.5 L24 20.5 L26.5 28 L20 23 L13.5 28 L16 20.5 L9.5 15.5 L17.5 15.5 Z" fill="#FFD166" stroke="#F4A820" stroke-width="1"/></svg>`,
  moon: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#EDE0FF"/><path d="M25 12 C19 12 14 17 14 23 C14 27 16 30.5 19.5 32 C13 31 9 26 9 20 C9 13 14.5 8 21 8 C22.4 8 23.7 8.3 25 8.8 Z" fill="#A084CA"/><circle cx="26" cy="14" r="2" fill="#CDB4DB"/><circle cx="23" cy="10" r="1.2" fill="#CDB4DB"/></svg>`,
  butterfly: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#E8F5E9"/><ellipse cx="15" cy="17" rx="6" ry="8" fill="#81C784" fill-opacity="0.8"/><ellipse cx="25" cy="17" rx="6" ry="8" fill="#66BB6A" fill-opacity="0.8"/><ellipse cx="14" cy="23" rx="5" ry="4" fill="#A5D6A7"/><ellipse cx="26" cy="23" rx="5" ry="4" fill="#A5D6A7"/><rect x="19" y="14" width="2" height="12" rx="1" fill="#5D4037"/><path d="M19 14 L17 11 M21 14 L23 11" stroke="#5D4037" stroke-width="1" stroke-linecap="round"/></svg>`,
  gem: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#E3F2FD"/><path d="M20 10 L30 17 L26 30 L14 30 L10 17 Z" fill="#64B5F6"/><path d="M20 10 L30 17 L20 20 Z" fill="#42A5F5"/><path d="M20 10 L10 17 L20 20 Z" fill="#90CAF9"/><path d="M10 17 L20 20 L14 30 Z" fill="#BBDEFB"/><path d="M30 17 L20 20 L26 30 Z" fill="#1E88E5"/></svg>`,
  sun: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#FFF8E1"/><circle cx="20" cy="20" r="8" fill="#FFB300"/><line x1="20" y1="8" x2="20" y2="5" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="32" x2="20" y2="35" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="20" x2="5" y2="20" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/><line x1="32" y1="20" x2="35" y2="20" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/><line x1="11.5" y1="11.5" x2="9.5" y2="9.5" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/><line x1="28.5" y1="28.5" x2="30.5" y2="30.5" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/><line x1="28.5" y1="11.5" x2="30.5" y2="9.5" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/><line x1="11.5" y1="28.5" x2="9.5" y2="30.5" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/></svg>`,
  letter: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#FCE4EC"/><rect x="9" y="13" width="22" height="16" rx="3" fill="white" stroke="#FF4D6D" stroke-width="1.5"/><path d="M9 16 L20 22 L31 16" stroke="#FF4D6D" stroke-width="1.5" stroke-linecap="round"/><path d="M14 24 L18 24" stroke="#FFAABC" stroke-width="1.5" stroke-linecap="round"/><path d="M14 27 L22 27" stroke="#FFAABC" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  crown: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#FFF9C4"/><path d="M10 28 L12 16 L17 22 L20 14 L23 22 L28 16 L30 28 Z" fill="#FFD166" stroke="#F4A820" stroke-width="1" stroke-linejoin="round"/><rect x="10" y="27" width="20" height="3" rx="1.5" fill="#F4A820"/><circle cx="20" cy="14" r="2" fill="#FF4D6D"/><circle cx="12" cy="16" r="1.5" fill="#A084CA"/><circle cx="28" cy="16" r="1.5" fill="#A084CA"/></svg>`,
};

function getAvatarSVG(key) { return AVATAR_SVGS[key] || AVATAR_SVGS["rose"]; }

const TOKEN_COLORS = [
  { body: "#FF4D6D", shadow: "#C0002A" },
  { body: "#A084CA", shadow: "#6040A0" },
];

function makeTokenSVG(playerIndex) {
  const c = TOKEN_COLORS[playerIndex];
  return `<svg viewBox="0 0 24 28" fill="none"><ellipse cx="12" cy="26" rx="6" ry="2" fill="${c.shadow}" fill-opacity="0.4"/><path d="M12 2C8.68 2 6 4.68 6 8C6 12 12 20 12 20C12 20 18 12 18 8C18 4.68 15.32 2 12 2Z" fill="${c.body}"/><circle cx="12" cy="8" r="3" fill="white" fill-opacity="0.35"/><circle cx="10.5" cy="6.5" r="1" fill="white" fill-opacity="0.5"/></svg>`;
}

// ─── SVG Icons (replacing all emoji) ─────────────────────────
const ICONS = {
  dice: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
  trophy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 21h8M12 17v4M5 3H3v4a4 4 0 004 4h0M19 3h2v4a4 4 0 01-4 4h0M7 3h10v7a5 5 0 01-10 0V3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  rocket: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="#FF4D6D" stroke="#FF4D6D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  heartFill: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="#FF4D6D" stroke="#FF4D6D" stroke-width="1"/></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M19 12l-7 7-7-7" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#A084CA" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="#A084CA" stroke-width="2" stroke-linecap="round"/></svg>`,
  check: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  hourglass: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12m0 0L7 6.172A2 2 0 016.586 4.758V2h10.828a2 2 0 01.586 1.414v.344M12 12l4.414-5.828" stroke="#C49AB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sparkle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#FFD166" stroke="#F4A820" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  lock: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FFD166" stroke="#F4A820" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  refresh: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 109-9M3 12l3-3m-3 3l3 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  question: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d97706" stroke-width="2"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#d97706" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  dare: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#0284c7" fill-opacity="0.3" stroke="#0284c7" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
};

// ─── Board ────────────────────────────────────────────────────
const TOTAL_TILES = 101;
const FINISH_TILE = 100;

const TILE_DEFS = (() => {
  const defs = {};
  defs[0]   = { type: "start", label: "Start" };
  defs[100] = { type: "end",   label: "Goal" };

  const upMap   = { 18:6, 29:5, 43:8, 57:6, 72:7 };
  const downMap = { 14:-8, 26:-7, 38:-9, 52:-8, 64:-7, 76:-9, 88:-8 };

  for (let i = 1; i <= 99; i++) {
    if (upMap[i] !== undefined) {
      defs[i] = { type: "up",   label: `+${upMap[i]}`, jump: upMap[i] };
    } else if (downMap[i] !== undefined) {
      defs[i] = { type: "down", label: `${downMap[i]}`, jump: downMap[i] };
    } else if (i % 4 === 1 || i % 4 === 3) {
      defs[i] = { type: "question", label: "Q" };
    } else {
      defs[i] = { type: "dare", label: "D" };
    }
  }
  return defs;
})();

const QUESTIONS = [
  "What is one small thing your game partner does that you notice instantly?",
  "What kind of message from your game partner do you wait for the most?",
  "What would your ideal hangout with your game partner feel like?",
  "What is one thing about your game partner that first caught your attention?",
  "What is something about your game partner that feels easy to talk about?",
  "What is one tiny detail about your game partner you keep noticing?",
  "What kind of moment with your game partner would feel perfect right now?",
  "What is one thing your game partner does that feels unintentionally cute?",
  "What is something you want to know more about your game partner?",
  "What kind of plan with your game partner sounds simple but perfect?",
  "What is one thing your game partner says that stays in your mind?",
  "What is your favorite kind of conversation with your game partner?",
  "What is one place you would want to go with your game partner?",
  "What kind of silence with your game partner feels comfortable?",
  "What is one thing about your game partner's personality that stands out?",
  "What is something you and your game partner could talk about for hours?",
  "What is one small habit of your game partner that you like?",
  "What kind of late-night talk with your game partner feels best?",
  "What is one thing you wish your game partner asked you more often?",
  "What is one thing your game partner does that makes conversations easy?",
  "What is one thing you imagine doing with your game partner someday?",
  "What is one random topic you and your game partner would enjoy?",
  "What is one thing your game partner does that feels thoughtful?",
  "What is one moment with your game partner you remember clearly?",
  "What kind of vibe do you and your game partner have together?",
  "What is one thing about your game partner that feels calming?",
  "What is one thing your game partner does that makes you curious about them?",
  "What is one thing you and your game partner would enjoy doing quietly?",
  "What is one thing your game partner does that makes time feel fast?",
  "What is one thing you notice about your game partner's energy?",
  "What is one thing you want to experience with your game partner for the first time?",
  "What is one thing your game partner does that feels different in a good way?",
  "What is one thing about your game partner you would describe as rare?",
  "What is one thing your game partner does that you admire quietly?",
  "What is one kind of plan you would enjoy with your game partner?",
  "What is one thing about your game partner that makes you comfortable?",
  "What is one thing your game partner does that feels genuine?",
  "What is one thing you want to ask your game partner but haven't yet?",
  "What is one thing your game partner does that makes conversations fun?",
  "What is one thing about your game partner you notice without trying?"
];

const DARES = [
  "Write a 2-line message about something you notice about your game partner.",
  "Send your game partner a voice note describing their vibe.",
  "List 4 small things about your game partner that you appreciate.",
  "Write your game partner's name using a word you associate with them for each letter.",
  "Send your game partner a random compliment that is not about looks.",
  "Describe your game partner using only 4 words.",
  "Write a short message about a moment you remember with your game partner.",
  "Send your game partner a message that sounds mysterious but kind.",
  "Tell your game partner one thing about them that stays in your mind.",
  "Write a one-line caption for your game partner.",
  "Send your game partner a calm voice note saying something nice.",
  "List 3 things your game partner does that you notice often.",
  "Write a short poetic line about your game partner.",
  "Send your game partner a playful but kind message.",
  "Describe your game partner's energy like a weather report.",
  "Write a message your game partner can read before sleeping.",
  "Tell your game partner one thing about them that feels different from others.",
  "Send your game partner a message starting with \"random thought about you\".",
  "Write a short note about your game partner's personality.",
  "Describe your game partner like a character in a story.",
  "Send your game partner a message that feels calm and comforting.",
  "Write one thing your game partner does that feels thoughtful.",
  "Send your game partner a soft voice note.",
  "Describe your game partner using a color and explain why.",
  "Write a short message about your game partner's presence.",
  "Tell your game partner one thing about them that you admire quietly.",
  "Send your game partner a message that feels warm.",
  "Describe your game partner like a place.",
  "Write one thing your game partner does that feels genuine.",
  "Send your game partner a message that feels effortless.",
  "Tell your game partner one thing about them that you notice without trying.",
  "Write a short message about your game partner's vibe.",
  "Send your game partner a kind message with no reason.",
  "Describe your game partner like a song.",
  "Write one thing your game partner does that feels natural.",
  "Send your game partner a simple but meaningful message.",
  "Tell your game partner one thing about them that makes conversations easy.",
  "Write a short note about your game partner's energy.",
  "Send your game partner a light and kind message.",
  "Describe your game partner like a quiet moment."
];

// ─── State ─────────────────────────────────────────────────────
let state = {
  roomCode: null, myIndex: null, playerName: null, playerAvatar: null,
  unsubscribe: null, roomData: null, rolling: false,
};

function saveSession(data) { sessionStorage.setItem("lt_session", JSON.stringify(data)); }
function loadSession()     { try { return JSON.parse(sessionStorage.getItem("lt_session")); } catch { return null; } }

function spawnPetals(container = document.getElementById("petalsBg")) {
  if (!container) return;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      p.innerHTML = `<svg width="${10+Math.random()*14}" height="${10+Math.random()*14}" viewBox="0 0 40 36" fill="none"><path d="M20 34C20 34 3 22 3 11C3 6 7 3 12 3C15.5 3 18.5 5 20 7.5C21.5 5 24.5 3 28 3C33 3 37 6 37 11C37 22 20 34 20 34Z" fill="${Math.random()>.5?'#FF8FA3':'#CDB4DB'}" opacity="0.6"/></svg>`;
    } else if (type === 1) {
      p.innerHTML = `<svg width="${8+Math.random()*10}" height="${8+Math.random()*10}" viewBox="0 0 24 24" fill="none"><path d="M12 2L14 8.5H21L15.5 12.5L17.5 19L12 15L6.5 19L8.5 12.5L3 8.5H10Z" fill="#FFD166" opacity="0.5"/></svg>`;
    } else {
      const s = 5+Math.random()*8;
      p.innerHTML = `<svg width="${s}" height="${s}" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="${Math.random()>.5?'#FF8FA3':'#CDB4DB'}" opacity="0.4"/></svg>`;
    }
    p.style.left = Math.random()*100+"vw";
    p.style.animationDuration = (10+Math.random()*12)+"s";
    p.style.animationDelay = (Math.random()*14)+"s";
    container.appendChild(p);
  }
}

const DICE_DOTS = {
  1:[[30,30]], 2:[[16,16],[44,44]], 3:[[16,16],[30,30],[44,44]],
  4:[[16,16],[44,16],[16,44],[44,44]], 5:[[16,16],[44,16],[30,30],[16,44],[44,44]],
  6:[[16,16],[44,16],[16,30],[44,30],[16,44],[44,44]],
};

function renderDiceSVG(value) {
  const svg = document.getElementById("diceSvg");
  if (!svg) return;
  svg.querySelectorAll(".d-dot").forEach(d => d.remove());
  (DICE_DOTS[value]||DICE_DOTS[1]).forEach(([cx,cy]) => {
    const c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx",cx); c.setAttribute("cy",cy); c.setAttribute("r","5");
    c.setAttribute("fill","#FF4D6D"); c.classList.add("d-dot");
    svg.appendChild(c);
  });
  const center = svg.querySelector("#d-center");
  if (center) center.remove();
}

// ════════════════════════════════════════════════════════════
//  LANDING PAGE
// ════════════════════════════════════════════════════════════
function initLanding() {
  spawnPetals();
  let selectedAvatar = "rose";

  document.querySelectorAll(".avatar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedAvatar = btn.dataset.avatar;
    });
  });

  function getPlayerData() {
    const name = document.getElementById("playerName").value.trim();
    if (!name) { showError("Please enter your name"); return null; }
    return { name, avatar: selectedAvatar, position: -1, started: false };
  }

  document.getElementById("createBtn").addEventListener("click", async () => {
    const player = getPlayerData(); if (!player) return;
    const code = generateRoomCode();
    try {
      await createRoom(code, player);
      state.roomCode = code; state.myIndex = 0; state.playerName = player.name; state.playerAvatar = player.avatar;
      saveSession({ roomCode: code, myIndex: 0, name: player.name, avatar: player.avatar });
      document.getElementById("roomBanner").classList.remove("hidden");
      document.getElementById("roomCodeDisplay").textContent = code;
      document.getElementById("createBtn").disabled = true;
      document.getElementById("joinBtn").disabled = true;
      state.unsubscribe = subscribeToRoom(code, (data) => {
        if (data.players.length === 2 && data.gameState === "playing") {
          if (state.unsubscribe) state.unsubscribe();
          window.location.href = "game.html";
        }
      });
    } catch (e) { showError("Couldn't create room. Check Firebase config."); console.error(e); }
  });

  document.getElementById("joinBtn").addEventListener("click", async () => {
    const player = getPlayerData(); if (!player) return;
    const code = document.getElementById("joinCode").value.trim().toUpperCase();
    if (code.length !== 6) { showError("Enter a valid 6-character code"); return; }
    try {
      await joinRoom(code, player);
      state.roomCode = code; state.myIndex = 1; state.playerName = player.name; state.playerAvatar = player.avatar;
      saveSession({ roomCode: code, myIndex: 1, name: player.name, avatar: player.avatar });
      window.location.href = "game.html";
    } catch (e) { showError(e.message || "Couldn't join. Check the code."); console.error(e); }
  });

  function showError(msg) {
    const el = document.getElementById("errorMsg");
    el.textContent = msg; el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 4000);
  }
}

// ════════════════════════════════════════════════════════════
//  GAME PAGE
// ════════════════════════════════════════════════════════════
function initGame() {
  const session = loadSession();
  if (!session) { window.location.href = "index.html"; return; }
  state.roomCode = session.roomCode; state.myIndex = session.myIndex;
  state.playerName = session.name; state.playerAvatar = session.avatar;

  spawnPetals();
  buildBoard();

  document.getElementById("roomCodePill").textContent = "Room: " + state.roomCode;
  document.getElementById("rollBtn").addEventListener("click", onRollClick);
  document.getElementById("modalDone").addEventListener("click", onModalDone);
  document.getElementById("chatSend").addEventListener("click", sendChat);
  document.getElementById("chatInput").addEventListener("keydown", e => { if (e.key === "Enter") sendChat(); });

  state.unsubscribe = subscribeToRoom(state.roomCode, (data) => {
    state.roomData = data;
    renderGame(data);
  });
}

// ─── Build Board ─────────────────────────────────────────────
function buildBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let row = 9; row >= 0; row--) {
    const logicalRow = 9 - row;
    const reversed = logicalRow % 2 === 1;
    for (let col = 0; col < 10; col++) {
      const tileNum = logicalRow * 10 + (reversed ? 9 - col : col);
      const def = TILE_DEFS[tileNum] || { type: "question", label: "Q" };
      const tile = document.createElement("div");
      tile.className = `tile tile-${def.type}`;
      tile.id = `tile-${tileNum}`;

      let inner = `<span class="tile-num">${tileNum === 0 ? 'S' : tileNum === 100 ? '★' : tileNum}</span>`;

      if (def.type === "up") {
        inner += `<div class="tile-center-icon">
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
            <path d="M9 15V3M9 3L5 7M9 3L13 7" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="tile-jump-label up-label">${def.label}</span>`;
      } else if (def.type === "down") {
        inner += `<div class="tile-center-icon">
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
            <path d="M9 3V15M9 15L5 11M9 15L13 11" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="tile-jump-label down-label">${def.label}</span>`;
      } else if (def.type === "question") {
        inner += `<div class="tile-center-icon">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M7 7C7 5.9 7.9 5 9 5C10.1 5 11 5.9 11 7C11 8.5 9 9 9 10.5" stroke="#b45309" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="9" cy="13" r="1" fill="#b45309"/>
          </svg>
        </div>`;
      } else if (def.type === "dare") {
        inner += `<div class="tile-center-icon">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M9 3L10.5 7.5H15L11.5 10L12.5 14.5L9 12L5.5 14.5L6.5 10L3 7.5H7.5Z" fill="#0369a1" fill-opacity="0.7" stroke="#0369a1" stroke-width="0.8"/>
          </svg>
        </div>`;
      } else if (def.type === "start") {
        inner += `<div class="tile-center-icon">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M9 2C6.24 2 4 4.24 4 7C4 10.5 9 16 9 16C9 16 14 10.5 14 7C14 4.24 11.76 2 9 2Z" fill="#818CF8"/>
            <circle cx="9" cy="7" r="2" fill="white" fill-opacity="0.6"/>
          </svg>
        </div>`;
      } else if (def.type === "end") {
        inner += `<div class="tile-center-icon">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M9 2L10.8 6.5H15.5L11.6 9.3L13.1 14L9 11.3L4.9 14L6.4 9.3L2.5 6.5H7.2Z" fill="white" fill-opacity="0.9"/>
          </svg>
        </div>`;
      }

      inner += `<div class="tile-tokens" id="tokens-${tileNum}"></div>`;
      tile.innerHTML = inner;
      board.appendChild(tile);
    }
  }
}

// ─── Render game state ──────────────────────────────────────
let prevPositions = [-1, -1];

function renderGame(data) {
  if (!data) return;
  const { players, turn, gameState, diceValue, chat, activeModal } = data;

  players.forEach((p, i) => {
    document.getElementById(`av${i}`).innerHTML = getAvatarSVG(p.avatar || "rose");
    document.getElementById(`pname${i}`).textContent = p.name || `Player ${i+1}`;
    document.getElementById(`ppos${i}`).textContent = p.position < 0 ? "—" : p.position;
    const isActive = turn === i && gameState === "playing";
    document.getElementById(`panel${i}`).classList.toggle("active-turn", isActive);
    document.getElementById(`crown${i}`).classList.toggle("hidden", !isActive);
    document.getElementById(`lock${i}`).classList.toggle("hidden", p.started);
  });

  players.forEach((p, i) => {
    const newPos = p.position, oldPos = prevPositions[i];
    if (newPos !== oldPos && newPos >= 0) {
      if (oldPos >= 0) animateTokenMove(i, oldPos, newPos);
      else placeToken(i, newPos);
    }
    prevPositions[i] = newPos;
  });

  if (diceValue) { renderDiceSVG(diceValue); document.getElementById("diceResult").textContent = diceValue; }

  const myTurn = turn === state.myIndex && gameState === "playing";
  const rollBtn = document.getElementById("rollBtn");
  const statusEl = document.getElementById("turnStatus");

  if (gameState === "waiting") {
    statusEl.innerHTML = `<span class="status-icon">${ICONS.clock}</span> Waiting for your partner to join…`;
    rollBtn.disabled = true;
  } else if (gameState === "finished") {
    statusEl.innerHTML = `<span class="status-icon">${ICONS.trophy}</span> Game over!`;
    rollBtn.disabled = true;
  } else {
    const me = players[state.myIndex];
    if (myTurn) {
      if (!me?.started) {
        statusEl.innerHTML = `<span class="status-icon">${ICONS.dice}</span> Roll a 6 to enter the trail!`;
      } else {
        const needed = FINISH_TILE - (me.position || 0);
        if (needed <= 6) {
          statusEl.innerHTML = `<span class="status-icon">${ICONS.warning}</span> Need <strong>${needed}</strong> or less to advance!`;
        } else {
          statusEl.innerHTML = `<span class="status-icon">${ICONS.dice}</span> Your turn — roll the dice!`;
        }
      }
      rollBtn.disabled = state.rolling;
    } else {
      const other = players[1 - state.myIndex];
      statusEl.innerHTML = `<span class="status-icon">${ICONS.hourglass}</span> ${other?.name || "Partner"}'s turn…`;
      rollBtn.disabled = true;
    }
  }

  renderChat(chat || []);

  // ── Sync modal from Firebase ──────────────────────────────
  if (activeModal && activeModal.content) {
    showModal(activeModal, state.myIndex);
  } else {
    document.getElementById("modalOverlay").classList.add("hidden");
  }

  if (gameState === "finished" && data.winner !== undefined) {
    const winner = players[data.winner];
    if (winner) showWin(winner);
  }
}

function placeToken(playerIndex, position, animate = false) {
  document.querySelectorAll(`[data-player="${playerIndex}"]`).forEach(el => el.remove());
  const container = document.getElementById(`tokens-${position}`);
  if (!container) return;
  const span = document.createElement("span");
  span.setAttribute("data-player", playerIndex);
  span.style.cssText = "display:inline-flex;position:relative;z-index:5";
  span.innerHTML = makeTokenSVG(playerIndex);
  span.querySelector("svg").style.cssText = `width:22px;height:22px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35))`;
  if (animate) span.style.animation = "tokenLand 0.45s cubic-bezier(0.34,1.56,0.64,1)";
  container.appendChild(span);
}

async function animateTokenMove(playerIndex, fromPos, toPos) {
  if (fromPos === toPos) return;
  const steps = Math.abs(toPos - fromPos);
  const dir = toPos > fromPos ? 1 : -1;

  if (steps <= 12) {
    let cur = fromPos;
    for (let s = 0; s < steps; s++) {
      cur += dir;
      await sleep(100);
      placeToken(playerIndex, cur, true);
    }
  } else {
    const mid1 = fromPos + Math.floor(steps * 0.33) * dir;
    const mid2 = fromPos + Math.floor(steps * 0.66) * dir;
    await sleep(80); placeToken(playerIndex, mid1, false);
    await sleep(80); placeToken(playerIndex, mid2, false);
    await sleep(100); placeToken(playerIndex, toPos, true);
  }

  const tile = document.getElementById(`tile-${toPos}`);
  if (tile) {
    tile.classList.add("tile-highlight");
    setTimeout(() => tile.classList.remove("tile-highlight"), 1000);
  }
}

// ─── Roll dice ────────────────────────────────────────────────
async function onRollClick() {
  if (state.rolling) return;
  const data = state.roomData;
  if (!data) return;
  if (data.turn !== state.myIndex || data.gameState !== "playing") {
    document.getElementById("rollBtn").disabled = true; return;
  }

  state.rolling = true;
  document.getElementById("rollBtn").disabled = true;

  const roll = Math.ceil(Math.random() * 6);
  const players = JSON.parse(JSON.stringify(data.players));
  const me = players[state.myIndex];

  const diceEl = document.getElementById("diceFace");
  diceEl.classList.add("rolling");
  const animInt = setInterval(() => renderDiceSVG(Math.ceil(Math.random()*6)), 75);
  await sleep(620);
  clearInterval(animInt);
  diceEl.classList.remove("rolling");
  renderDiceSVG(roll);
  document.getElementById("diceResult").textContent = roll;

  let nextTurn = 1 - data.turn;
  let actionMsg = "";
  let gameState = "playing";
  let winner;
  let tileAction = null;

  if (!me.started) {
    if (roll === 6) {
      me.started = true; me.position = 0;
      actionMsg = `${me.name} rolled a 6 and entered the trail! Roll again!`;
      nextTurn = state.myIndex;
    } else {
      actionMsg = `${me.name} rolled ${roll} — need a 6 to begin!`;
      nextTurn = 1 - state.myIndex;
    }
  } else {
    const distToFinish = FINISH_TILE - me.position;

    if (distToFinish <= 6 && roll > distToFinish) {
      actionMsg = `${me.name} rolled ${roll} — needs ${distToFinish} or less to move. Stay!`;
      nextTurn = 1 - state.myIndex;
    } else {
      let newPos = Math.min(me.position + roll, FINISH_TILE);
      const def = TILE_DEFS[newPos];
      actionMsg = `${me.name} rolled ${roll} — tile ${newPos}`;

      if (def?.type === "up") {
        const landPos = Math.min(newPos + def.jump, FINISH_TILE);
        actionMsg += ` — jumps ahead to tile ${landPos}!`;
        me.position = newPos;
        players[state.myIndex] = me;
        await updateRoom(state.roomCode, { players, turn: 1-state.myIndex, diceValue: roll, gameState, lastAction: actionMsg });
        addLog(actionMsg, "up");
        await sleep(650);
        me.position = landPos;
        players[state.myIndex] = me;
        if (landPos >= FINISH_TILE) { gameState = "finished"; winner = state.myIndex; }
        await updateRoom(state.roomCode, { players, turn: 1-state.myIndex, gameState, ...(winner!==undefined?{winner}:{}) });
        state.rolling = false;
        return;

      } else if (def?.type === "down") {
        const landPos = Math.max(newPos + def.jump, 0);
        actionMsg += ` — slides back to tile ${landPos}!`;
        me.position = newPos;
        players[state.myIndex] = me;
        await updateRoom(state.roomCode, { players, turn: 1-state.myIndex, diceValue: roll, gameState, lastAction: actionMsg });
        addLog(actionMsg, "down");
        await sleep(650);
        me.position = landPos;
        players[state.myIndex] = me;
        await updateRoom(state.roomCode, { players, turn: 1-state.myIndex, gameState });
        state.rolling = false;
        return;

      } else if (def?.type === "question") {
        tileAction = { type: "question" };
      } else if (def?.type === "dare") {
        tileAction = { type: "dare" };
      }

      me.position = newPos;

      if (roll === 6) {
        nextTurn = state.myIndex;
        actionMsg += ` — rolled 6, roll again!`;
      }

      if (newPos >= FINISH_TILE) {
        gameState = "finished"; winner = state.myIndex;
        actionMsg += ` — Winner!`;
      }
    }
  }

  players[state.myIndex] = me;
  const update = { players, turn: nextTurn, diceValue: roll, gameState, lastAction: actionMsg };
  if (winner !== undefined) update.winner = winner;

  // ── Write modal to Firebase so both players see it ────────
  // Per-player dedup: each player has their own seen Q/D index lists
  if (tileAction) {
    const pool = tileAction.type === "question" ? QUESTIONS : DARES;
    const seenKey = tileAction.type === "question" ? "seenQ" : "seenD";

    // Seen indices for the landing player (stored on their player object)
    const seenIndices = new Set(me[seenKey] || []);

    // Build list of unseen indices; if all seen, reset (full cycle)
    let available = pool.map((_, i) => i).filter(i => !seenIndices.has(i));
    if (available.length === 0) {
      // All used — reset this player's history for this type
      available = pool.map((_, i) => i);
      me[seenKey] = [];
    }

    // Pick a random unseen index
    const chosenIndex = available[Math.floor(Math.random() * available.length)];

    // Record it as seen for this player
    me[seenKey] = [...(me[seenKey] || []), chosenIndex];
    players[state.myIndex] = me;
    update.players = players; // ensure updated seen list is persisted

    update.activeModal = {
      type: tileAction.type,
      content: pool[chosenIndex],
      forPlayer: state.myIndex,
    };
  }

  await updateRoom(state.roomCode, update);
  addLog(actionMsg, tileAction?.type || null);

  state.rolling = false;

  if (nextTurn === state.myIndex && gameState === "playing") {
    document.getElementById("rollBtn").disabled = false;
  }
}

// ─── Modal — shown on both screens, dismissed by opponent ─────
function showModal({ type, content, forPlayer }, myIndex) {
  const iAmTheOpponent = (forPlayer !== myIndex);

  let icon = "", label = "", cls = "";

  if (type === "question") {
    icon = `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
      <circle cx="40" cy="40" r="28" fill="#FDE68A" opacity="0.5"/>
      <path d="M28 30C28 23.37 33.37 18 40 18C46.63 18 52 23.37 52 30C52 37 40 39 40 46" stroke="#D97706" stroke-width="4" stroke-linecap="round"/>
      <circle cx="40" cy="56" r="4" fill="#D97706"/>
      <path d="M20 15 L24 19M60 15 L56 19M40 8 L40 13" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    </svg>`;
    label = "Romantic Question";
    cls = "modal-question";
  } else {
    icon = `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
      <circle cx="40" cy="40" r="28" fill="#DBEAFE" opacity="0.6"/>
      <path d="M40 14L46.18 30.72H64L50.09 40.56L55.78 57.28L40 47.6L24.22 57.28L29.91 40.56L16 30.72H33.82Z" fill="#2563EB" fill-opacity="0.25" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M15 20 L19 24M65 20 L61 24M40 8 L40 12" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    </svg>`;
    label = "Dare";
    cls = "modal-dare";
  }

  // Player name labels
  const players = state.roomData?.players || [];
  const landingPlayer = players[forPlayer];
  const opponentPlayer = players[1 - forPlayer];

  document.querySelector(".modal-card").className = `modal-card ${cls}`;
  document.getElementById("modalIcon").innerHTML = icon;
  document.getElementById("modalType").textContent = label;
  document.getElementById("modalText").textContent = content;

  // Who label
  const whoEl = document.getElementById("modalWho");
  if (whoEl) {
    whoEl.textContent = landingPlayer ? `${landingPlayer.name}'s turn` : "";
  }

  const doneBtn = document.getElementById("modalDone");
  const waitMsg = document.getElementById("modalWait");

  if (iAmTheOpponent) {
    // Opponent sees the Done button and controls dismissal
    doneBtn.classList.remove("hidden");
    if (waitMsg) waitMsg.classList.add("hidden");
    doneBtn.innerHTML = `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Done — continue!
    `;
  } else {
    // The one who landed waits
    doneBtn.classList.add("hidden");
    if (waitMsg) {
      waitMsg.classList.remove("hidden");
      waitMsg.innerHTML = `
        <span class="modal-wait-inner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12m0 0L7.586 6.586A2 2 0 017 5.172V2h10v3.172a2 2 0 01-.586 1.414L12 12z" stroke="#A084CA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${opponentPlayer ? opponentPlayer.name : "Your partner"} will confirm when done
        </span>
      `;
    }
  }

  document.getElementById("modalOverlay").classList.remove("hidden");
}

// Opponent clicking Done clears modal in Firebase — closes on both screens
function onModalDone() {
  updateRoom(state.roomCode, { activeModal: null });
}

function showWin(winner) {
  const overlay = document.getElementById("winOverlay");
  if (!overlay.classList.contains("hidden")) return;
  document.getElementById("winAvatar").innerHTML = getAvatarSVG(winner.avatar || "rose");
  document.getElementById("winName").textContent = winner.name || "You";
  overlay.classList.remove("hidden");
  startConfetti();
}

function startConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const colors = ["#FF4D6D","#CDB4DB","#FFD166","#6BD490","#FF8FA3","#A084CA"];
  const pieces = Array.from({length:120},()=>({
    x:Math.random()*canvas.width, y:Math.random()*-canvas.height,
    r:4+Math.random()*7, color:colors[Math.floor(Math.random()*colors.length)],
    vx:(Math.random()-.5)*2.5, vy:2+Math.random()*3.5, rot:Math.random()*360, spin:(Math.random()-.5)*5
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color; ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r); ctx.restore();
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.spin;
      if(p.y>canvas.height){p.y=-10;p.x=Math.random()*canvas.width;}
    });
    if(frame++<400) requestAnimationFrame(draw);
  }
  draw();
}

// Log icons per event type
const LOG_ICONS = {
  up:       `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  down:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M19 12l-7 7-7-7" stroke="#F87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  question: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FBBF24" stroke-width="2"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  dare:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#60A5FA" fill-opacity="0.4" stroke="#60A5FA" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  default:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#A084CA" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#A084CA"/><circle cx="15.5" cy="8.5" r="1.5" fill="#A084CA"/><circle cx="8.5" cy="15.5" r="1.5" fill="#A084CA"/><circle cx="15.5" cy="15.5" r="1.5" fill="#A084CA"/></svg>`,
};

function addLog(msg, type = null) {
  const entries = document.getElementById("logEntries");
  if (!entries) return;
  const entry = document.createElement("div");
  entry.className = "log-entry";
  const icon = LOG_ICONS[type] || LOG_ICONS.default;
  entry.innerHTML = `<span class="log-icon">${icon}</span><span class="log-text">${msg}</span>`;
  entries.prepend(entry);
  while (entries.children.length > 25) entries.removeChild(entries.lastChild);
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text || !state.roomData) return;
  input.value = "";
  const data = state.roomData;
  const chat = [...(data.chat || [])];
  const me = data.players[state.myIndex];
  chat.push({ from: state.myIndex, name: me?.name || "You", text, ts: Date.now() });
  if (chat.length > 60) chat.shift();
  await updateRoom(state.roomCode, { chat });
}

function renderChat(messages) {
  const box = document.getElementById("chatMessages");
  if (!box || box.children.length === messages.length) return;
  box.innerHTML = "";
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `chat-bubble ${msg.from === state.myIndex ? "mine" : "theirs"}`;
    div.textContent = msg.from === state.myIndex ? msg.text : `${msg.name}: ${msg.text}`;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

if (document.getElementById("createBtn")) initLanding();
else if (document.getElementById("board")) initGame();
