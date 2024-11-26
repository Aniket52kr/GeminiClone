// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBTcy01DAE52ojcN5ZjTtFtqA-mT8FrAZ4",
  authDomain: "gemini-clone-b80be.firebaseapp.com",
  projectId: "gemini-clone-b80be",
  storageBucket: "gemini-clone-b80be.appspot.com",
  messagingSenderId: "309924489511",
  appId: "1:309924489511:web:8293dd28c300713d1ae102",
  measurementId: "G-KDN3HTHYXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);