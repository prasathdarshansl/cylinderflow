import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "./firebase";

// Signup (Email)
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login (Email)
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout
export function logout() {
  return signOut(auth);
}

// Auth state listener
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
