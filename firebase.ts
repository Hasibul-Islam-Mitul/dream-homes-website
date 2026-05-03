import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJSON from './firebase-applet-config.json';

// Use environment variables if available (e.g. on Vercel), fallback to config file
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJSON.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJSON.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJSON.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJSON.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJSON.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJSON.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigJSON.measurementId,
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || (firebaseConfigJSON as any).firestoreDatabaseId || '(default)';

// Check if critical configuration is present
export const isFirebaseConfigured = !!config.apiKey && config.apiKey !== "";

let app: any;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(config);
    auth = getAuth(app);
    
    // Diagnostic Check as requested
    console.log('Firebase Init:', config.projectId);
    
    // Use initializeFirestore to include experimentalForceLongPolling for stability in restricted environments
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firestoreDatabaseId);
    
    storage = getStorage(app);

    console.log("Firebase Configuration Check:");
    console.log("- Project ID:", config.projectId);
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
