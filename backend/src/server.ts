import express, { Request, Response } from "express";
import https from "https";
import mqtt from "mqtt";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

// Constants for directories and paths
const CAMERA_DIR = path.resolve(__dirname, "../../videos");
const FFMPEG_PATH = "C:/Program Files/ffmpeg/ffmpeg-2024-05-06-git-96449cfeae-full_build/bin/ffmpeg.exe";

// Environment variables for MQTT and SSL/TLS certificates
const caPath = process.env.CA_PATH!;
const clientCertPath = process.env.CLIENT_CERT_PATH!;
const clientKeyPath = process.env.CLIENT_KEY_PATH!;
const serverCertPath = process.env.SERVER_CERT_PATH!;
const serverKeyPath = process.env.SERVER_KEY_PATH!;
const username = process.env.MQTT_USERNAME!;
const password = process.env.MQTT_PASSWORD!;
const IP = process.env.IP_ADDRESS!;

// Read MQTT certificates
const caCert = fs.readFileSync(caPath);
const clientCert = fs.readFileSync(clientCertPath);
const clientKey = fs.readFileSync(clientKeyPath);
const serverCert = fs.readFileSync(serverCertPath);
const serverKey = fs.readFileSync(serverKeyPath);

const MQTT_CERTS = {
    ca: caCert,
    cert: clientCert,
    key: clientKey,
    rejectUnauthorized: true
};

const MQTT_TOPIC_CAMERA = "home/security/motion";
const MQTT_TOPIC_LIGHT = "home/stairs/light/color";

// Initialize MQTT client
const client = mqtt.connect(`mqtts://${IP}:8883`, {
    ...MQTT_CERTS,
    clientId: "webServer",
    username: username,
    password: password,
    protocolVersion: 4
});

// MQTT event handlers
client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe(MQTT_TOPIC_CAMERA);
    client.subscribe(MQTT_TOPIC_LIGHT);
});

client.on("error", (err) => {
    console.error(`MQTT error: ${err.message}`);
});

client.on("disconnect", (err) => {
    console.error(`MQTT disconnected: ${err}`);
});

client.on("message", (topic, message) => {
    if (topic === MQTT_TOPIC_CAMERA) {
        const timestamp = new Date().toLocaleString('sv-SE').replace(" ", "-");
        const h264File = `motion_${timestamp}.h264`;
        const mp4File = `motion_${timestamp}.mp4`;
        const h264Path = path.join(CAMERA_DIR, h264File);
        const mp4Path = path.join(CAMERA_DIR, mp4File);

        fs.writeFileSync(h264Path, message);
        console.log(`Video saved: ${h264Path}`);

        convertToMp4(h264Path, mp4Path);
    }
});

// Function to convert video to MP4 format
const convertToMp4 = (inputPath: string, outputPath: string) => {
    const command = `"${FFMPEG_PATH}" -i "${inputPath}" -c:v copy "${outputPath}" -y`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error converting video: ${err.message}`);
            return;
        }
        console.log(`Video converted to MP4: ${outputPath}`);
        fs.unlinkSync(inputPath); // Remove the original h264 file after conversion
    });
};

// Initialize Express application
const app = express();
const PORT = 5500;

const httpsOptions = {
    ca: caCert,
    cert: serverCert,
    key: serverKey
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend build directory
app.use(express.static(path.join("../frontend/build")));

interface ColorRequestBody {
    r: number;
    g: number;
    b: number;
}

// API endpoint to change light color
app.post("/api/change-color", (req: Request<{}, {}, ColorRequestBody>, res: Response) => {
    const { r, g, b } = req.body;

    const colorMessage = `${r},${g},${b}`;

    console.log(`Publishing color change: ${colorMessage}`);

    client.publish(MQTT_TOPIC_LIGHT, colorMessage);

    res.json({ message: `Color (${r}, ${g}, ${b}) sent successfully` });
});

// API endpoint to get the list of videos
app.get("/api/videos", (req, res) => {
    const videos = fs.readdirSync(CAMERA_DIR).sort((a, b) => b.localeCompare(a));
    res.json(videos);
});

// API endpoint to serve a specific video file
app.get("/videos/:filename", (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.join(CAMERA_DIR, filename));
});

// Serve the main frontend application
app.get("/", (req, res) => {
    res.sendFile(path.join("../frontend/build", "index.html"));
});

// Start HTTPS server
https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
