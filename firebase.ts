import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Safe helper to read environment variables from multiple possible sources
const getEnv = (key: string): string => {
  // Check import.meta.env first (Vite standard)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Fallback to process.env (Node/Vercel standard)
  if (typeof process !== 'undefined' && process.env && (process.env as any)[key]) {
    return (process.env as any)[key];
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Check if critical configuration is present
export const isFirebaseConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined" && firebaseConfig.apiKey !== "";

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    auth = app.auth();
    db = app.firestore();
    storage = app.storage();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase is not fully configured. Running in demo mode.");
}

export { auth, db, storage };
export default app;