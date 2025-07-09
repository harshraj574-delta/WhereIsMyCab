// Initialize Firebase Database
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';

const database = firebase.database();

// Add event listener to send button
$("#send-button").click(() => {
    const message = $("#message-input").val();
    if (message.trim() !== "") {
        sendMessage(message);
        $("#message-input").val("");
    }
});

// Function to display messages in the chat interface
function displayMessage(sender, messageText) {
    const chatContainer = document.getElementById("chat-container");
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${sender}: ${messageText}`;
    chatContainer.appendChild(messageDiv);
}

// Function to send a new message
function sendMessage(message) {
    const user = firebase.auth().currentUser;
    if (user) {
        const newMessageRef = database.ref("messages").push();
        newMessageRef.set({
            text: message,
            sender: user.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }
}

// Listen for new messages and update chat interface
database.ref("messages").on("child_added", (snapshot) => {
    const message = snapshot.val();
    const user = firebase.auth().currentUser;

    if (user) {
        const messageText = message.text;
        const sender = message.sender;
        
        // Display messages in the chat container
        $("#chat-container").append(`<div>${sender}: ${messageText}</div>`);
    }
});


database.ref("messages").once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        const sender = message.sender;
        const messageText = message.text;

        displayMessage(sender, messageText);
    });
});