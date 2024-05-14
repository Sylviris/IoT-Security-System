from gpiozero import MotionSensor
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
import paho.mqtt.client as mqtt
from datetime import datetime
import os
from time import sleep

# Load environment variables for MQTT and SSL/TLS certificates
MQTT_BROKER = os.getenv("IP_ADDRESS")
MQTT_PORT = 8883
MQTT_TOPIC_MOTION = "home/security/motion"
MQTT_CLIENT_ID = "motion_camera"

# MQTT SSL/TLS certificates
MQTT_CERTS = {
    "ca_certs": os.getenv("CA_PATH"),
    "certfile": os.getenv("CLIENT_CERT_PATH"),
    "keyfile": os.getenv("CLIENT_KEY_PATH"),
}

# Initialize camera
motion_cam = Picamera2()
camera_config = motion_cam.create_video_configuration(main={"size": (640, 480)})
motion_cam.configure(camera_config)
encoder = H264Encoder()
motion_cam.start()

# Initialize motion sensor
pir = MotionSensor(4)

# Directory to save video captures
BASE_DIR = os.path.join(os.path.expanduser("~"), "motion_captures")
os.makedirs(BASE_DIR, exist_ok=True)

# Initialize MQTT client
client = mqtt.Client(client_id=MQTT_CLIENT_ID)
client.username_pw_set(os.getenv("MQTT_USERNAME"), os.getenv("MQTT_PASSWORD"))
client.tls_set(**MQTT_CERTS, tls_version=mqtt.ssl.PROTOCOL_TLS)


# MQTT callback functions
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(MQTT_TOPIC_MOTION)
    else:
        print(f"Failed to connect, return code {rc}")


client.on_connect = on_connect
client.connect(MQTT_BROKER, MQTT_PORT, 80)
client.loop_start()


# Function to publish video to MQTT topic
def publish_video(file_path):
    try:
        with open(file_path, "rb") as video_file:
            video_data = video_file.read()
            result = client.publish(MQTT_TOPIC_MOTION, video_data)
            status = result.rc
            if status == mqtt.MQTT_ERR_SUCCESS:
                print(f"Video Published: {file_path}")
            else:
                print(f"Failed to publish video to topic {MQTT_TOPIC_MOTION}")
    except Exception as e:
        print(f"Error reading video file: {e}")


# Function to capture video
def capture_video():
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    output_file = os.path.join(BASE_DIR, f"motion_{timestamp}.h264")
    motion_cam.start_recording(encoder, output_file)
    sleep(30)
    motion_cam.stop_recording()
    print(f"Video recorded: {output_file}")
    publish_video(output_file)


# Motion sensor event handlers
def motion_detected():
    print("Motion detected!")
    capture_video()


def no_motion():
    print("Motion stopped")


# Assign event handlers to motion sensor
pir.when_motion = motion_detected
pir.when_no_motion = no_motion

# Main loop to keep the script running
try:
    while True:
        sleep(1)
except KeyboardInterrupt:
    print("Stopping camera")
    client.loop_stop()
