// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDVa7e5EAEzlPGbZQNaFUpBwQh7R_KkGh4",
//   authDomain: "vasanifreights.firebaseapp.com",
//   projectId: "vasanifreights",
//   storageBucket: "vasanifreights.appspot.com",
//   messagingSenderId: "223165091445",
//   appId: "1:223165091445:web:78a842fe85623d14de323c",
//   measurementId: "G-RTD3T3SXEV"
// };
const firebaseConfig = {
  apiKey: "AIzaSyAl_-JBXJWhDz79W71xkXGcUFW2tkJDiwE",
  authDomain: "test1-e9f6f.firebaseapp.com",
  databaseURL: "https://test1-e9f6f-default-rtdb.firebaseio.com",
  projectId: "test1-e9f6f",
  storageBucket: "test1-e9f6f.appspot.com",
  messagingSenderId: "737590301664",
  appId: "1:737590301664:web:f4a648496e8aff45aad185",
  measurementId: "G-BSTWHR3FH8"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

 // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const auth = getAuth(app);
export {database, auth};
export default app;
