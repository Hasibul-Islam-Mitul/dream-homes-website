
// Use compat imports to ensure the default export 'firebase' includes modular extensions like firestore and auth.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

/**
 * FIREBASE CONFIGURATION
 * Using import.meta.env for Vite projects to correctly access client-side environment variables.
 * Note: Variables must be prefixed with VITE_ to be exposed.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if the user has updated the configuration
export const isFirebaseConfigured = !!firebaseConfig.apiKey;

// Initialize Firebase using compat syntax
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();

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
