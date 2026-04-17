// ============================================================
// firebase.js — Firebase Configuration & Helpers
// Replace the config below with YOUR Firebase project config.
// Get it from: Firebase Console → Project Settings → SDK setup
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔴 REPLACE THIS WITH YOUR OWN FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDXJLmO7tFKxOiQwbrZ8jwKghLkc4zQgK0",
  authDomain: "newgame-7ce97.firebaseapp.com",
  projectId: "newgame-7ce97",
  storageBucket: "newgame-7ce97.firebasestorage.app",
  messagingSenderId: "618878110358",
  appId: "1:618878110358:web:00eb50976b588e9a37d0b7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ─── Room Helpers ────────────────────────────────────────────

/** Generate a random 6-char alphanumeric room code */
export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/** Create a new room in Firestore */
export async function createRoom(roomCode, player) {
  await setDoc(doc(db, "rooms", roomCode), {
    players: [player],
    turn: 0,
    diceValue: null,
    gameState: "waiting",
    lastAction: null,
    createdAt: serverTimestamp(),
  });
}

/** Join an existing room */
export async function joinRoom(roomCode, player) {
  const ref = doc(db, "rooms", roomCode);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Room not found");
  const data = snap.data();
  if (data.players.length >= 2) throw new Error("Room is full");
  const updated = [...data.players, player];
  await updateDoc(ref, { players: updated, gameState: "playing" });
  return updated;
}

/** Get a room snapshot (one-time) */
export async function getRoom(roomCode) {
  const snap = await getDoc(doc(db, "rooms", roomCode));
  if (!snap.exists()) throw new Error("Room not found");
  return snap.data();
}

/** Subscribe to real-time room updates */
export function subscribeToRoom(roomCode, callback) {
  return onSnapshot(doc(db, "rooms", roomCode), (snap) => {
    if (snap.exists()) callback(snap.data());
  });
}

/** Update room fields */
export async function updateRoom(roomCode, fields) {
  await updateDoc(doc(db, "rooms", roomCode), fields);
}