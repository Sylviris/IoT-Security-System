# Smart Home Automation Project

This project is a smart home automation system involving a motion-detecting light and a motion-detecting camera using Raspberry Pi Zero W.

## Project Overview

### IoT Devices

- **Motion-Detecting Light**: Uses a PIR motion sensor and NeoPixel RGB LED strip controlled by a Python script.
- **Motion-Detecting Camera**: Uses a Pi Camera Module and PIR motion sensor to record videos when motion is detected.

### Communication

- **MQTT Broker**: Uses Mosquitto MQTT broker for communication between devices and the web server.
- **Secure Communication**: Communication is secured with SSL/TLS encryption.

### Backend (Node.js)

- Manages MQTT messages and device states.
- Provides API endpoints for changing light color and fetching video files.
- Uses environment variables to handle sensitive information like usernames, passwords, and certificate paths.

### Frontend (React)

- Provides a user interface to control the light and view recorded videos.
- Uses Bootstrap for styling and Axios for API communication.

## Features

- **Real-Time Control**: Control the RGB light color via the web interface.
- **Motion Detection**: Automatically records video when motion is detected.
- **Secure Communication**: Ensures secure data transmission using SSL/TLS.

## Demonstration

### Screenshots

![Light Control and Video Playback Interface](/Interface.png)

## Technologies Used

- **Frontend**: React, Bootstrap, Axios
- **Backend**: Node.js, Express, MQTT
- **IoT**: Raspberry Pi Zero W, PIR Sensor, NeoPixel RGB LED, Pi Camera Module
- **Communication**: Mosquitto MQTT broker
- **Security**: SSL/TLS

## Future Work

- Implement real-time video streaming.
- Enhance security with multi-factor authentication.
- Clean up and improve UI
