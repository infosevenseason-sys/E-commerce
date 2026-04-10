import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5TwHuLtmqaUZduOC4aSllMpvJsLiuiYA",
  authDomain: "e-commerce-c9973.firebaseapp.com",
  projectId: "e-commerce-c9973",
  storageBucket: "e-commerce-c9973.firebasestorage.app",
  messagingSenderId: "414543507361",
  appId: "1:414543507361:web:b56cc13a97f80f66b7a5e0",
  measurementId: "G-7H1RL8F712"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (Database)
export const db = getFirestore(app);