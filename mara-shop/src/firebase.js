import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQ-G453kPyEND6J6NTipMohJukGo3w9f0", // Sachi Key
  authDomain: "e-commerce-c9973.firebaseapp.com",
  projectId: "e-commerce-c9973",
  storageBucket: "e-commerce-c9973.firebasestorage.app",
  messagingSenderId: "414543507361",
  appId: "1:414543507361:web:b56cc13a97f80f66b7a5e0",
  measurementId: "G-7H1RL8F712"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);