// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBOw7VyBxqjbJAEVaSZMUbrDWzd15B1zH0",
  authDomain: "gemini-clone-b80be.firebaseapp.com",
  projectId: "gemini-clone-b80be",
  storageBucket: "gemini-clone-b80be.appspot.com",
  messagingSenderId: "309924489511",
  appId: "1:309924489511:web:370b8a56e6fbab6c1ae102",
  measurementId: "G-EXN5SNCCX4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);