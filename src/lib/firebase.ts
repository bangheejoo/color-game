import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXlxdLJ4bdsVBSaxD5F9RIxudht1EPKhU",
  authDomain: "colorgame-a01e4.firebaseapp.com",
  projectId: "colorgame-a01e4",
  storageBucket: "colorgame-a01e4.firebasestorage.app",
  messagingSenderId: "173475441094",
  appId: "1:173475441094:web:69d940bd79d60edcfaeac7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
