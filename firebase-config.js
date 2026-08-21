// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjhJlJ4PAsYsGcjrEfKYz4P4SvUDJV140",
  authDomain: "calestial-sound.firebaseapp.com",
  projectId: "calestial-sound",
  storageBucket: "calestial-sound.firebasestorage.app",
  messagingSenderId: "783637882927",
  appId: "1:783637882927:web:b90ae15226d48c40193eda",
  measurementId: "G-6WZYX6JTSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
