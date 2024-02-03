const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected');

    // WebSocket message handler
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Broadcast message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // WebSocket close handler
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

/**
 * @api {get} /send-notification/:message Send Notification
 * @apiName SendNotification
 * @apiGroup Notifications
 *
 * @apiParam {String} message Notification message.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Notification sent successfully"
 *     }
 */
app.get('/send-notification/:name/:message', (req, res) => {
    const { name, message } = req.params;

    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ name, message }));
        }
    });

    res.status(200).json({ message: "Notification sent successfully" });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
