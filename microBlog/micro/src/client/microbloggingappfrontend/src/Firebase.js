import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import "firebase/storage";
import Swal from "sweetalert2";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
export const signInWithEmailAndPswrd = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const createWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const changepassword = (currentPassword, newpassword) => {
  let user = auth.currentUser;
  let credentials = EmailAuthProvider.credential(user.email, currentPassword);
  return reauthenticateWithCredential(user, credentials)
    .then(() => {
      updatePassword(user, newpassword)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          return error;
        });
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Current password is incorrect",
      });
      throw err;
    });
};
