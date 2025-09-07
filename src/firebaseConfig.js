// Paste your Firebase config here OR set these values as environment variables in Vercel.
// Example (replace the values with your project's settings):
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'REPLACE_API_KEY',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'REPLACE_AUTH_DOMAIN',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'REPLACE_PROJECT_ID',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'REPLACE_BUCKET',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'REPLACE_SENDER_ID',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'REPLACE_APP_ID'
};
