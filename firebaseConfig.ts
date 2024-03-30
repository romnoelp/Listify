import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7vjbH7ZQqDYtPdQa0XOdz5kOzWmznDUQ",
  authDomain: "listify-ef496.firebaseapp.com",
  projectId: "listify-ef496",
  storageBucket: "listify-ef496.appspot.com",
  messagingSenderId: "949069814125",
  appId: "1:949069814125:web:8f84fb3962c46800102264",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
