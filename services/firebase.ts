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
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE",
};
// =================================================================
// END OF REQUIRED CONFIGURATION
// =================================================================


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);