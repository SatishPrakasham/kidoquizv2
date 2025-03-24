// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNKW2jyp7ZzKhvJYBUt4p8CWLLAtBOoHg",
  authDomain: "kidoquiz-b81dc.firebaseapp.com",
  projectId: "kidoquiz-b81dc",
  storageBucket: "kidoquiz-b81dc.appspot.com",
  messagingSenderId: "290171894663",
  appId: "1:290171894663:web:e98740ce25958d65fd3122",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
