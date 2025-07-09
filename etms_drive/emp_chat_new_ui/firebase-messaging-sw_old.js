// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyA09UwnVN0gTIHXjZokBBBXCEGyWrZ9rBk",
    databaseURL: "https://etmsdrive-89370.firebaseio.com/",
    projectId: "etmsdrive-89370",
    messagingSenderId:"351746301370",
    appId: "1:351746301370:android:361973f28e3375bc"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Optional: Customize notification behavior
messaging.setBackgroundMessageHandler(payload => {
  const notificationOptions = {
    body: payload.notification.body,
  };
  return self.registration.showNotification(payload.notification.title, notificationOptions);
});