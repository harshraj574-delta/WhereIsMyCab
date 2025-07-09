// Scripts for firebase and firebase messaging

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");


 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
    apiKey: "AIzaSyA09UwnVN0gTIHXjZokBBBXCEGyWrZ9rBk",
    authDomain: "etmsdrive-89370.firebaseapp.com",
    databaseURL: "https://etmsdrive-89370.firebaseio.com/",
    projectId: "etmsdrive-89370",
    storageBucket: "etmsdrive-89370.appspot.com",
    messagingSenderId:"351746301370",
    appId: "1:351746301370:android:361973f28e3375bc"
 };

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();
 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
     icon: '/ringing.png',
   };
 self.registration.showNotification(notificationTitle, notificationOptions);
 });

 