// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClAGah2BhZHorEgeSZ2uLjybO1FfJU6FA",
  authDomain: "resume-parser-b048c.firebaseapp.com",
  projectId: "resume-parser-b048c",
  storageBucket: "resume-parser-b048c.appspot.com",
  messagingSenderId: "889510693478",
  appId: "1:889510693478:web:aa881985c85fb28abcfba7",
  measurementId: "G-WEG2GVQXNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, storage }; // Export the storage instance
