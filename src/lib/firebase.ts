import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAb3qKC2Lj3N3E9vmEoyJHejNAuL97SrRU",
  authDomain: "helpet-2026.firebaseapp.com",
  projectId: "helpet-2026",
  storageBucket: "helpet-2026.firebasestorage.app",
  messagingSenderId: "972201595950",
  appId: "1:972201595950:web:b04e7d5490fbd859907bbf",
  measurementId: "G-NXW8V5JQ8N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);