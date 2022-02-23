import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, updateProfile } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCg_8lWUmTdge3xXuEKTICNmw9aPuQANY",
  authDomain: "edubase-d4c34.firebaseapp.com",
  projectId: "edubase-d4c34",
  storageBucket: "edubase-d4c34.appspot.com",
  messagingSenderId: "1072857184316",
  appId: "1:1072857184316:web:df79377d7d75bdaaf62b39",
  measurementId: "G-T0G7RFYJCK"
};

const app     = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db      = getFirestore();
const storage = getStorage();
const auth    = getAuth();
const updProfile = updateProfile();

export { app, db, storage, auth, updProfile }; 