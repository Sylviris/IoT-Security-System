from gpiozero import MotionSensor
import paho.mqtt.client as mqtt
import time
import board
import neopixel
import os

# Load environment variables for MQTT and SSL/TLS certificates
MQTT_BROKER = os.getenv("IP_ADDRESS")
MQTT_PORT = 8883
MQTT_TOPIC = "home/stairs/light/color"

# MQTT SSL/TLS certificates
MQTT_CERTS = {
    "ca_certs": os.getenv("CA_PATH"),
    "certfile": os.getenv("CLIENT_CERT_PATH"),
    "keyfile": os.getenv("CLIENT_KEY_PATH"),
}

# Configure NeoPixel light strip
PIXEL_PIN = board.D18
NUM_PIXELS = 150
BRIGHTNESS = 0.7
light_strip = neopixel.NeoPixel(
    PIXEL_PIN, NUM_PIXELS, brightness=BRIGHTNESS, auto_write=False
)

# Initialize motion sensor
motion_sensor = MotionSensor(4)

# Default light color (white)
current_color = (255, 255, 255)


# MQTT callback functions
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(MQTT_TOPIC)


def on_disconnect(client, userdata, rc):
    print(f"Disconnected with result code {rc}")
    if rc != 0:
        print("Unexpected disconnection, reconnecting...")
        client.reconnect()


def on_message(client, userdata, message):
    global current_color
    try:
        # Decode and parse the incoming color message
        r, g, b = map(int, message.payload.decode().split(","))
        current_color = (r, g, b)
        print(f"Received color: {current_color}")
        light_strip.fill(current_color)
        light_strip.show()
    except Exception as e:
        print(f"Error processing color: {e}")


# MQTT client setup
client = mqtt.Client(client_id="motion_light")
client.username_pw_set(os.getenv("MQTT_USERNAME"), os.getenv("MQTT_PASSWORD"))
client.tls_set(**MQTT_CERTS, tls_version=mqtt.ssl.PROTOCOL_TLS)
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_start()


# Functions to control the light strip
def turn_on_light(color):
    light_strip.fill(color)
    light_strip.show()


def turn_off_light():
    light_strip.fill((0, 0, 0))
    light_strip.show()


# Motion sensor event handlers
def motion_detected():
    print("Motion detected! Turning on lights.")
    turn_on_light(current_color)


def no_motion():
    print("Motion stopped! Turning off lights.")
    turn_off_light()


# Assign event handlers to motion sensor
motion_sensor.when_motion = motion_detected
motion_sensor.when_no_motion = no_motion

# Main loop to keep the script running
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    turn_off_light()
    client.loop_stop()
