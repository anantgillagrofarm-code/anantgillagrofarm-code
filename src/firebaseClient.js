// src/firebaseClient.js
// Lazy initialization of Firebase (modular SDK v9+). Safe to include even if Firebase is disabled.

import { firebaseConfig, FIREBASE_ENABLED } from './firebaseConfig';

let app = null;
let firestoreInstance = null;
let authInstance = null;
let storageInstance = null;

/**
 * Ensure firebase is initialized (dynamically imports modules).
 * Returns the initialized app or null if disabled.
 */
export async function ensureFirebaseInitialized() {
  if (!FIREBASE_ENABLED) return null;
  if (app) return app;

  // dynamic imports (modular SDK)
  const firebaseAppModule = await import('firebase/app');
  const { initializeApp } = firebaseAppModule;
  app = initializeApp(firebaseConfig);

  // import services
  try {
    const firestoreModule = await import('firebase/firestore');
    const authModule = await import('firebase/auth');
    const storageModule = await import('firebase/storage');

    firestoreInstance = firestoreModule.getFirestore(app);
    authInstance = authModule.getAuth(app);
    storageInstance = storageModule.getStorage(app);
  } catch (err) {
    // If some services are not used that's fine — keep the app initialized
    console.warn('Some Firebase services failed to import:', err);
  }

  return app;
}

export async function initFirebaseIfNeeded() {
  return ensureFirebaseInitialized();
}

export async function getFirestore() {
  await ensureFirebaseInitialized();
  return firestoreInstance;
}

export async function getAuth() {
  await ensureFirebaseInitialized();
  return authInstance;
}

export async function getStorage() {
  await ensureFirebaseInitialized();
  return storageInstance;
}
