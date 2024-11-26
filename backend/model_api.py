from flask import Flask, request, jsonify
from ultralytics import YOLO
import mediapipe as mp
import cv2
import numpy as np
from time import time
from PIL import Image
import io

app = Flask(__name__)

# Load the YOLO model
model = YOLO("../runs/detect/train-v3/weights/last.pt")

# Initialize Mediapipe for hand landmarks
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.4, min_tracking_confidence=0.4)

# Labels dictionary
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M',
    13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y',
    25: 'Z', 26: 'hello', 27: 'iloveyou', 28: 'what-'
}

# Start time and max prediction variables
start_time = time()
max_pred = (None, 0)

def log_highest_pred(label, conf):
    """
    Logs the highest predicted label to a text file after 5 seconds.
    """
    global start_time, max_pred
    elapsed_time = time() - start_time

    # If time exceeds 5.5 seconds, reset
    if elapsed_time > 5.5:
        start_time = time()
        max_pred = (None, 0)

    # Update the max prediction
    if conf > max_pred[1]:
        max_pred = (label, conf)

    # Log the max prediction if 5 seconds have elapsed
    if elapsed_time >= 5:
        with open("logs.txt", 'a') as f:
            f.write(f"{max_pred[0]} ({max_pred[1]:.2f}), elapsed_time = {elapsed_time:.2f}\n")
        # Reset for the next round
        start_time = time()
        max_pred = (None, 0)

@app.route('/process_frame', methods=['POST'])
def process_frame():
    """
    Process a single video frame sent from the client, predict ASL characters, and log the highest prediction.
    """
    global max_pred

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Read the image from the request
    file = request.files['image']
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    frame = np.array(image)

    # Convert frame to RGB format for Mediapipe
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect hand landmarks
    results = hands.process(frame_rgb)

    # Run YOLOv8 model inference
    results_yolo = model(frame)
    if results_yolo[0].boxes.data.shape[0] > 0:  # Ensure there are predictions
        box = results_yolo[0].boxes.data[0]
        label_idx = int(box[5])  # The class label index
        conf = float(box[4])    # Confidence score

        # Convert label index to actual label
        label = labels_dict.get(label_idx, "Unknown")

        # Log the prediction
        log_highest_pred(label, conf)

        return jsonify({'label': label, 'confidence': conf}), 200

    # If no predictions
    return jsonify({'error': 'No hand detected or prediction available'}), 200


if __name__ == '__main__':
    app.run(debug=True)

