// Use compat imports to ensure the default export 'firebase' includes modular extensions like firestore and auth.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

console.log("Firebase Initializing...");

/**
 * FIREBASE CONFIGURATION
 * Using import.meta.env for Vite projects to correctly access client-side environment variables.
 * Note: Variables must be prefixed with VITE_ to be exposed.
 */
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID
};

// Robust check for valid configuration
export const isFirebaseConfigured = !!firebaseConfig.apiKey && 
                                   firebaseConfig.apiKey !== "undefined" && 
                                   firebaseConfig.apiKey !== "";

let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    auth = app.auth();
    db = app.firestore();
    storage = app.storage();
    console.log("Firebase successfully initialized.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase API key is missing or invalid. The application is running in local demo mode.");
}

export { auth, db, storage };

/**
 * FIRESTORE SECURITY RULES
 * Copy and paste these into your Firebase Console > Firestore Database > Rules tab:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /projects/{project} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *     match /leads/{lead} {
 *       allow write: if true;
 *       allow read: if request.auth != null;
 *     }
 *   }
 * }
 */