// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-app-426e4.firebaseapp.com",
  projectId: "mern-app-426e4",
  storageBucket: "mern-app-426e4.appspot.com",
  messagingSenderId: "11540370438",
  appId: "1:11540370438:web:f66f37ecadb80103915f87"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);