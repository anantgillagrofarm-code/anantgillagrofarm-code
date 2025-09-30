// src/firebaseClient.js
// Lazy/dynamic initialization of Firebase only when FIREBASE_ENABLED === true

import { firebaseConfig, FIREBASE_ENABLED } from './firebaseConfig';

let firebaseApp = null;

// Exported helpers for the rest of the codebase to import if needed
export async function initFirebaseIfNeeded() {
  if (!FIREBASE_ENABLED) {
    // Firebase disabled — don't import the heavy SDK
    return null;
  }
  if (firebaseApp) return firebaseApp;

  // dynamic import to avoid bundling when disabled
  const firebase = await import('firebase/app');
  // individual SDK parts
  await import('firebase/firestore');
  await import('firebase/auth');
  await import('firebase/storage');

  firebaseApp = firebase.initializeApp(firebaseConfig);
  return firebaseApp;
}
