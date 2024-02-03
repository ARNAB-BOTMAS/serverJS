const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

ws.on('message', (data) => {
    const notification = JSON.parse(data);
    console.log('Received notification:', notification.message);
    // Handle the received notification, e.g., display it as a discipline notification
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});
