// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// =================================================================
// THIS IS THE FILE YOU NEED TO EDIT TO FIX THE SIGN-IN ERROR
// =================================================================
// The error "auth/api-key-not-valid" means you are still using the
// placeholder values below.
//
// To fix it:
// 1. Go to your Firebase project's settings.
// 2. In the "General" tab, find your web app's "SDK setup and configuration".
// 3. Select the "Config" option.
// 4. Copy the real values for each key from your config object.
// 5. Paste them into the corresponding quotation marks below.
// =================================================================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE",
  measurementId: "PASTE_YOUR_MEASUREMENT_ID_HERE"
};
// =================================================================
// END OF REQUIRED CONFIGURATION
// =================================================================


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);