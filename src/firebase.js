// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wohngluck-8abac.firebaseapp.com",
  projectId: "wohngluck-8abac",
  storageBucket: "wohngluck-8abac.firebasestorage.app",
  messagingSenderId: "966504078701",
  appId: "1:966504078701:web:ef588eded1ae5ea6d3ce64",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
