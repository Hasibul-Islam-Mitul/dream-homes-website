import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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

    // Enable long polling and disable fetch streams to bypass potential proxy/network blocks
    db.settings({ 
      experimentalForceLongPolling: true,
      // @ts-ignore - some versions of the SDK support this to help with connection issues
      useFetchStreams: false
    });

    console.log("Firebase Configuration Check:");
    console.log("- Project ID:", firebaseConfig.projectId);
    console.log("- Auth Domain:", firebaseConfig.authDomain);
    console.log("- API Key Present:", !!firebaseConfig.apiKey);

    // Connection test with a shorter timeout for logging
    const connectionTest = db.collection('properties').limit(1).get();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Local connection test timeout")), 5000)
    );

    Promise.race([connectionTest, timeoutPromise])
      .then(() => console.log("Firestore connection successful"))
      .catch((error: any) => {
        console.error("Firestore Connection Test Failed:", error.message);
        if (error.message.includes('offline') || error.message.includes('timeout')) {
          console.error("This usually indicates a network block or incorrect Project ID.");
        }
      });
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase is not fully configured. Running in demo mode.");
}

export { auth, db, storage };
export default app;