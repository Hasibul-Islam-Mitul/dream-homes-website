
// Use compat imports to ensure the default export 'firebase' includes modular extensions like firestore and auth.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

/**
 * IMPORTANT: REPLACE THE PLACEHOLDERS BELOW WITH YOUR ACTUAL FIREBASE CONFIGURATION
 * Find this in your Firebase Console: Project Settings > General > Your apps > Web app
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if the user has updated the configuration
export const isFirebaseConfigured = firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// Initialize Firebase using compat syntax to fix named export errors
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
 *     // Public projects are readable by anyone, writable only by authenticated admin
 *     match /projects/{project} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *     // Leads can be written by anyone (public contact form), readable only by admin
 *     match /leads/{lead} {
 *       allow write: if true;
 *       allow read: if request.auth != null;
 *     }
 *   }
 * }
 */
