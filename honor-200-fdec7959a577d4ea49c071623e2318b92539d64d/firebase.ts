// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYSqlbsSb3THQ7tjdETSTgi48uc5F0nLI",
  authDomain: "my-budget-app-8810a.firebaseapp.com",
  projectId: "my-budget-app-8810a",
  storageBucket: "my-budget-app-8810a.firebasestorage.app",
  messagingSenderId: "32437346909",
  appId: "1:32437346909:web:28da2a0cf1915cb93923b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth };
