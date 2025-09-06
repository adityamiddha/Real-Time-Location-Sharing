// Initialize map immediately with a default view
const map = L.map("map").setView([0, 0], 2); // Start with world view until location is available
const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "ADITYA MIDDHA",
    maxZoom: 19,
    // Add tile loading optimization
    updateWhenIdle: true,
    updateWhenZooming: false,
    // Limit concurrent requests
    maxRequests: 6
}).addTo(map);

// Store markers efficiently using a Map instead of a plain object
const markers = new Map();

// Handle loading indicator
const loadingElement = document.getElementById('loading');

// Connect to Socket.io with connection timeout
const socket = io({
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
});

// Handle location sharing with rate limiting
let lastEmitTime = 0;
const EMIT_INTERVAL = 1000; // Only emit location every second at most

function initializeGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                // Hide loading indicator once we have the position
                if (loadingElement) {
                    loadingElement.classList.add('loading-hidden');
                }
                
                const now = Date.now();
                // Rate limit location updates
                if (now - lastEmitTime > EMIT_INTERVAL) {
                    const { latitude, longitude } = position.coords;
                    socket.emit("send-location", { latitude, longitude });
                    lastEmitTime = now;
                }
            },
            (error) => {
                console.error("Geolocation error:", error.message);
                // Hide loading even on error
                if (loadingElement) {
                    loadingElement.classList.add('loading-hidden');
                }
                alert(`Geolocation error: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 10000, // Allow caching positions for 10 seconds
            }
        );
    } else {
        if (loadingElement) {
            loadingElement.classList.add('loading-hidden');
        }
        alert("Geolocation is not supported by this browser.");
    }
}

// Handle receiving location updates
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    
    // Only set view for our own marker
    if (id === socket.id) {
        map.setView([latitude, longitude], 16);
    }
    
    // Update or create marker
    if (markers.has(id)) {
        markers.get(id).setLatLng([latitude, longitude]);
    } else {
        // Create marker with tooltip showing it's you or another user
        const isCurrentUser = (id === socket.id);
        const marker = L.marker([latitude, longitude])
            .addTo(map)
            .bindTooltip(isCurrentUser ? "You" : "Other user");
            
        markers.set(id, marker);
    }
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
    if (markers.has(id)) {
        map.removeLayer(markers.get(id));
        markers.delete(id);
    }
});

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGeolocation);
} else {
    // If DOMContentLoaded already fired
    initializeGeolocation();
}

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Handle map load complete
map.whenReady(() => {
    console.log('Map is ready');
});
