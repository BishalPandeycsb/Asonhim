import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFY9e8wuzE11mNZiNXNH1DpxpXEaz_0XE",
  authDomain: "ashimon-7d910.firebaseapp.com",
  projectId: "ashimon-7d910",
  storageBucket: "ashimon-7d910.appspot.com",
  messagingSenderId: "412404741308",
  appId: "1:412404741308:web:946f1705d3b87c5f47ccb9",
  measurementId: "G-2EY6TLR8X9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };