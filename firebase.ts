import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './firebase-applet-config.json';

// Check if critical configuration is present
export const isFirebaseConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    // CRITICAL: Must use firestoreDatabaseId if provided in config
    db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
    storage = getStorage(app);

    console.log("Firebase Configuration Check:");
    console.log("- Project ID:", firebaseConfig.projectId);
    console.log("- API Key Present:", !!firebaseConfig.apiKey);

    // Validate connection
    const testConnection = async () => {
      try {
        // Simple read test to verify connectivity and project ID
        await getDocFromServer(doc(db, 'projects', 'connection-test'));
        console.log("Firestore connection successful (connectivity verified)");
      } catch (error: any) {
        console.error("Firestore Connection Test Failed:", error.message);
        if (error.message.includes('offline')) {
          console.error("Please check your network or Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase is not fully configured. Running in demo mode.");
}

export { auth, db, storage };
export default app;
