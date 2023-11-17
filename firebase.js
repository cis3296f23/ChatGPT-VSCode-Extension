// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtBiEEw4Dze9F-LD-OiZweNOouk1Xz0RY",
  authDomain: "chatgpt-extension-project.firebaseapp.com",
  projectId: "chatgpt-extension-project",
  storageBucket: "chatgpt-extension-project.appspot.com",
  messagingSenderId: "714408174400",
  appId: "1:714408174400:web:8cddb8969ea7ccb75c50a5",
  measurementId: "G-JB7LQW6M4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);