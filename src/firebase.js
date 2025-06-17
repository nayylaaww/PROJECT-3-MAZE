import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDw6C6MQFRZ_vKsUNAkrBccEIeQ4iYK-2c",
  authDomain: "labyraa.firebaseapp.com",
  projectId: "labyraa",
  storageBucket: "labyraa.firebasestorage.app",
  messagingSenderId: "490128647764",
  appId: "1:490128647764:web:5935bb62545b5f0050afc1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
