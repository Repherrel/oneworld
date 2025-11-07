// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// =================================================================
// THIS IS THE FILE YOU NEED TO EDIT
// =================================================================
// The code is now fixed. If sign-in still fails, the issue is with
// your Firebase project's configuration.
//
// COMMON ERRORS AND HOW TO FIX THEM:
//
// 1. "auth/api-key-not-valid"
//    - You are still using the placeholder values below.
//    - Go to your Firebase project settings -> General -> Your apps -> SDK setup and configuration.
//    - Select "Config" and copy/paste your real values below.
//
// 2. "auth/unauthorized-domain"
//    - The website address you are testing from is not approved.
//    - Go to Firebase -> Authentication -> Settings -> Authorized domains.
//    - Click "Add domain" and add the domain of this preview environment.
//
// 3. Google Popup closes immediately
//    - The "Google" sign-in provider is not enabled.
//    - Go to Firebase -> Authentication -> Sign-in method.
//    - Click "Google" and enable it.
// =================================================================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9WsQuNAJTnw80YT_7s-pNjtpK7Zj2Nt0",
  authDomain: "oneworld-app-7b97f.firebaseapp.com",
  projectId: "oneworld-app-7b97f",
  storageBucket: "oneworld-app-7b97f.firebasestorage.app",
  messagingSenderId: "510212924033",
  appId: "1:510212924033:web:78bf0752e62f64d4e0e380",
  measurementId: "G-5JS42NSZGR"
};
// =================================================================
// END OF REQUIRED CONFIGURATION
// =================================================================


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
