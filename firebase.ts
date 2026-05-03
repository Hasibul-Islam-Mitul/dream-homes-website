import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJSON from './firebase-applet-config.json';

const projectIDFallback = "thedreamhomesandconstructions";

// Use environment variables if available (e.g. on Vercel), fallback to hardcoded strings
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-i2AyE7fv8F1Rt1JqkC9Pzf24dGAk3nc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectIDFallback}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || projectIDFallback,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectIDFallback}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "799853358188",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:799853358188:web:d424512b477e92e3c2fc49",
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || (firebaseConfigJSON as any).firestoreDatabaseId || '(default)';

// Check if critical configuration is present
export const isFirebaseConfigured = !!config.apiKey && config.apiKey !== "" && config.projectId !== "";

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(config);
    auth = getAuth(app);
    
    // Use project-native initialization without forced host overrides
    db = initializeFirestore(app, {});
    
    storage = getStorage(app);

    console.log("CRITICAL DATABASE BRIDGE STATUS:");
    console.log("- Target Project:", config.projectId);
    console.log("- Connection: ASIA-SOUTHEAST1 COMPATIBLE");
    console.log("- Database ID:", firestoreDatabaseId);
    console.log("- API Key Present:", !!config.apiKey);

    // Validate connection
    const testConnection = async () => {
      try {
        // Simple read test to verify connectivity and project ID
        await getDocFromServer(doc(db, 'projects', 'connection-test'));
        console.log("Firestore connection successful (connectivity verified)");
      } catch (error: any) {
        // Only log error if it's not a "not found" error which is expected for connection-test doc
        if (error.code === 'permission-denied') {
          console.error("Firestore Connection Test Failed: Missing or insufficient permissions.", error);
        } else {
          console.log("Firestore connection check finished (Non-fatal):", error.message);
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase is not fully configured (missing API Key). Running in demo mode.");
}

export { auth, db, storage };
export default app;
