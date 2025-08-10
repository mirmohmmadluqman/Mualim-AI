// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "mualim-ai",
  appId: "1:759026329486:web:219b05e4cc15262854a6df",
  storageBucket: "mualim-ai.firebasestorage.app",
  apiKey: "AIzaSyCWH14cArfQ99j4lLJLdTf9zegGf2cMc6E",
  authDomain: "mualim-ai.firebaseapp.com",
  messagingSenderId: "759026329486",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
