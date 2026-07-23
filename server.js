const { WebSocketServer } = require('ws');

// Create the backend WebSocket server on port 8080
// Automatically use Render's dynamic system port or fallback to 8080 locally
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Player connected! Total players:', clients.size);

    // Listen for custom coordinate data from players
    ws.on('message', (message) => {
        // Broadcast the data to EVERYONE else connected
        for (const client of clients) {
            if (client !== ws && client.readyState === 1) {
                // message is sent as standard text data to mimic text apps
                client.send(message.toString());
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Player disconnected.');
    });
});

console.log('Game server running on ws://localhost:8080');
