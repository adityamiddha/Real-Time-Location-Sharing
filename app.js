const express = require('express');
const cors = require('cors');
const compression = require('compression');
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.io configuration with optimizations
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
    // Prefer websockets for better performance
    allowUpgrades: true
});

// Express middleware
app.set("view engine", "ejs");

// Add compression middleware
app.use(compression());

// Serve static files with caching headers
app.use(express.static(path.join(__dirname, "public"), {
    maxAge: '1d', // Cache static resources for 1 day
    etag: true
}));

// Enable CORS with specific options
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // Handle location updates
    socket.on("send-location", (data) => {
        // Broadcast location to all clients
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        io.emit("user-disconnected", socket.id);
    });
});

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// To start server in development: npm run dev
// To start server in production: npm start
// To end server: Ctrl+C