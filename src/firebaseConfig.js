// src/firebaseConfig.js
// Central place for Firebase config and a flag to enable/disable it.
// Uses Vite import.meta.env style variables (these must be set in Vercel as VITE_...).

export const FIREBASE_ENABLED = import.meta.env.VITE_FIREBASE_ENABLED === 'true' || false;

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'REPLACE_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'REPLACE_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'REPLACE_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'REPLACE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'REPLACE_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'REPLACE_APP_ID'
};
