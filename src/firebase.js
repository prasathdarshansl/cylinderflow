import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYeTAcQ3f4kj14_U6eFZsEVY2BX38gxoU",
  authDomain: "cylinderflow-9c199.firebaseapp.com",
  projectId: "cylinderflow-9c199",
  storageBucket: "cylinderflow-9c199.firebasestorage.app",
  messagingSenderId: "142318394418",
  appId: "1:142318394418:web:195ad497cc6ff091dbb02b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
