import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD_ORMaKmCJXnMFofxTj-TTQrGTZiGRJXQ",
  authDomain: "adolist-589a1.firebaseapp.com",
  projectId: "adolist-589a1",
  storageBucket: "adolist-589a1.appspot.com",
  messagingSenderId: "737215973386",
  appId: "1:737215973386:web:2d4f552e24841bb2dfb7f3",
  measurementId: "G-R7FZHWC10T"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp