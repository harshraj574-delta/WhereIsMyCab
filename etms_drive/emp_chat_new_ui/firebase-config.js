// Initialize Firebase with your Flutter project's credentials
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyA09UwnVN0gTIHXjZokBBBXCEGyWrZ9rBk",
    databaseURL: "https://etmsdrive-89370.firebaseio.com/",
    projectId: "etmsdrive-89370",
    appId: "1:351746301370:android:361973f28e3375bc"
};
const app = initializeApp(firebaseConfig);
//firebase.initializeApp(firebaseConfig);
