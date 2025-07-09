// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA09UwnVN0gTIHXjZokBBBXCEGyWrZ9rBk",
    databaseURL: "https://etmsdrive-89370.firebaseio.com/",
    projectId: "etmsdrive-89370",
    messagingSenderId:"351746301370",
    appId: "1:351746301370:android:361973f28e3375bc"
};
let isNewMessage = false; 
// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the values using the parameter names
const _routeId = urlParams.get('routeid');
const _driverNo = urlParams.get('driverno');
const _empName = urlParams.get('empname');

console.log('Route ID:', _routeId);
console.log('Driver Number:', _driverNo);
console.log('Employee Name:', _empName);

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const messaging = firebase.messaging();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js") // Path to your firebase-messaging-sw.js file
    .then((registration) => {
      messaging.useServiceWorker(registration); // Associate service worker with messaging instance
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

  messaging.requestPermission()
  .then(() => {
    return messaging.getToken();
  })
  .then(token => {
    console.log('FCM Token:', token);
 
  }).catch((error) => {
    console.log('Error requesting permission:', error);
  });



 

  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const chatMessages = document.getElementById('chat-messages');  

  const routeID = _routeId;//'223523R0002';
  const driverID = _driverNo;//'9810025215';
  const currentUserID = _empName;//'Anurag singh'; 
  var driverFCMToken;
 



  // const messagesRef = database.ref(`chats/trips/${routeID}/messages`); 
  // messagesRef.once("value")
  // .then(function(snapshot) {
  //   var data = snapshot.val();
  //   console.log(data); // Log the retrieved data
  //   const uniqueSenders = {};

  
  //   for (const key in data) {
  //       const driverFCMToken = data[key].driverFCMToken;
  //       if (driverFCMToken && typeof driverFCMToken === 'string' && driverFCMToken.trim() !== '') {
  //           uniqueSenders[driverFCMToken] = true;
  //       }
  //   }
  //   driverToken = Object.keys(uniqueSenders).join(', ');
  //   console.log(driverToken);
  // })
  // .catch(function(error) {
  //   console.error("Error fetching data:", error);
  // });

  // Assuming you have the routeID from somewhere

const messagesRef = database.ref(`chats/trips/${routeID}`);

messagesRef.once("value")
  .then(function(snapshot) {
    const tripData = snapshot.val();
    if (tripData) {
       driverFCMToken = tripData.driverFCMToken;
      if (driverFCMToken && typeof driverFCMToken === 'string' && driverFCMToken.trim() !== '') {
        console.log("Driver's FCM Token:", driverFCMToken);
        
        
      } else {
        console.log("Driver's FCM Token is not available or invalid.");
      }
    } else {
      console.log("Trip data not found.");
    }
  })
  .catch(function(error) {
    console.error("Error fetching trip data:", error);
  });



  sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText !== '') {
      const newMessageRef = database.ref(`chats/trips/${routeID}/messages`).push();
      newMessageRef.set({
        sender: currentUserID,
        receiver: driverID,
        content: messageText,
        timestamp: firebase.database.ServerValue.TIMESTAMP
        
      });
      console.log(':::>'+driverFCMToken);
      sendPushNotification(driverFCMToken, messageText); 
      messageInput.value = '';
    }
  });
  
  

  database.ref(`chats/trips/${routeID}/messages`).on('child_added', snapshot => {
    const message = snapshot.val();
    if (message.sender === currentUserID || message.receiver === currentUserID) {
      const messageElement = document.createElement('div');
      const messageContent = document.createElement('div');
      const timestampElement = document.createElement('div');
      messageContent.innerText = message.content;
      const timestamp = new Date(message.timestamp);
      const formattedTime = timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      timestampElement.classList.add('timestamp');
      timestampElement.innerText = formattedTime;
  
      // Determine message alignment based on sender
      messageElement.appendChild(messageContent);
      messageElement.appendChild(timestampElement);
  
      if (message.sender === currentUserID) {
        messageElement.classList.add('message-bubble', 'sent');
      } else {
        // Show notification only for new messages
        if (isNewMessage) {
          showNotification('New Message', message.content);
        }
        isNewMessage = true; // Set the flag to true for the next messages
        messageElement.classList.add('message-bubble', 'received');
      }
      messageElement.classList.add('animate__animated', 'animate__headShake');
      chatMessages.appendChild(messageElement);
    }
  });
  
  database.ref(`chats/trips/${routeID}/messages`).on('child_removed', snapshot => {
    const messageId = snapshot.key;
    const messageElementToRemove = document.querySelector(`[data-message-id="${messageId}"]`);
    
    if (messageElementToRemove) {
      messageElementToRemove.remove();
    }
  });
  function sendPushNotification(recipientFCMToken, message) {
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer AAAAUeW2nbo:APA91bFykoDdjXFrBo4qoRh0SvR7twUvPet-onaHvy29OGV7eJR7uMSaw042aEtC0VAEZmlYUd9eeVNfFz4DuifRAiePprBKf2cE7pHIkF1DZdY5fHG7NDqOazTna5rlFkxUlXrOcEpgtSJPL27-l_QGLlmhutR_Hg', // Replace with your FCM server key
      },
      body: JSON.stringify({
        to: recipientFCMToken,
        notification: {
          title: 'New Message',
          body: message,
          click_action: 'your-action-url',
        },
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Push notification sent:', data);
      })
      .catch(error => {
        console.error('Error sending push notification:', error);
      });
  }

  function showNotification(title, body) {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return;
    }
  
    // Check if permission to show notifications has been granted
    if (Notification.permission === 'granted') {
      // Create and show the notification
      const notification = new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      // If permission is not denied, request permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Create and show the notification
          const notification = new Notification(title, { body });
        }
      });
    }
  }
  