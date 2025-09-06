# Real-Time Location Sharing

The Real-Time Location Tracking project is a web application designed to monitor and display the real-time
locations of multiple entities on a map. It utilizes WebSocket technology to provide instant location updates,
allowing all connected users to view everyone's location on an interactive map in real-time. This project aims
to enhance location tracking efficiency and provide a seamless user experience for multi-user environments.

## Features

- Real-time location tracking using browser geolocation
- Multiple user support with unique markers
- Automatic removal of disconnected users
- Responsive map interface using Leaflet

## Technologies Used

- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.io
- **Templating**: EJS
- **Maps**: Leaflet
- **Frontend**: HTML, CSS, JavaScript

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/adityamiddha/Real-Time-Location-Sharing.git
   cd Real-Time-Location-Sharing
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Development Mode

For development with automatic server restarts:
```
npm run dev
```

### Production Mode

For production deployment:
```
npm start
```

The application will be available at `http://localhost:3000` (or the port specified by the environment variable).

## Deployment

This application can be deployed to various cloud platforms:

1. Set the `PORT` environment variable (most platforms do this automatically)
2. Ensure all dependencies are installed
3. Run the application using `npm start`

## License

ISC

## Author

Aditya Middhal-Time-Location-Sharing
The Real-Time Location Tracking project is a web application designed to monitor and display the real-time
locations of multiple entities on a map. It utilizes WebSocket technology to provide instant location updates,
allowing all connected users to view everyone’s location on an interactive map in real-time. This project aims
to enhance location tracking efficiency and provide a seamless user experience for multi-user environments.
