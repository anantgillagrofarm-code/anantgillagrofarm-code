// src/firebaseClient.js
// Lazy/dynamic initialization of Firebase (modular SDK v9+).
// This file will only import heavy firebase modules when FIREBASE_ENABLED is true.

import { firebaseConfig, FIREBASE_ENABLED } from './firebaseConfig';

let app = null;
let firestoreInstance = null;
let authInstance = null;
let storageInstance = null;
let initializing = false;

/**
 * Dynamically import and initialize Firebase only when needed.
 * Returns the initialized app, or null if Firebase is disabled.
 */
export async function ensureFirebaseInitialized() {
  if (!FIREBASE_ENABLED) return null;
  if (app) return app;

  // Prevent parallel initializations
  if (initializing) {
    // wait until initialization completes
    return new Promise((resolve, reject) => {
      const check = () => {
        if (app) return resolve(app);
        if (!initializing) return resolve(app);
        setTimeout(check, 50);
      };
      check();
    });
  }

  initializing = true;
  try {
    // dynamic import of modular SDK
    const firebaseAppModule = await import('firebase/app');
    const { initializeApp } = firebaseAppModule;

    app = initializeApp(firebaseConfig);

    // dynamically import services; some may fail if not installed, so wrap in try/catch
    try {
      const firestoreModule = await import('firebase/firestore');
      firestoreInstance = firestoreModule.getFirestore(app);
    } catch (e) {
      // Not fatal — only use Firestore if available
      console.warn('Firestore not initialized:', e.message || e);
    }

    try {
      const authModule = await import('firebase/auth');
      authInstance = authModule.getAuth(app);
    } catch (e) {
      console.warn('Auth not initialized:', e.message || e);
    }

    try {
      const storageModule = await import('firebase/storage');
      storageInstance = storageModule.getStorage(app);
    } catch (e) {
      console.warn('Storage not initialized:', e.message || e);
    }

    return app;
  } finally {
    initializing = false;
  }
}

/** Convenient initializer you can call on app startup (optional). */
export async function initFirebaseIfNeeded() {
  return ensureFirebaseInitialized();
}

/** Getter helpers that ensure initialization and return the service or null. */
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
