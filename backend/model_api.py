from flask import Flask, Response, jsonify
from flask_cors import CORS  # Import Flask-CORS
import cv2
import numpy as np
from ultralytics import YOLO
import mediapipe as mp
from time import time
import threading

app = Flask(__name__)
CORS(app)

model = YOLO("../runs/detect/train-HRU/weights/last.pt")
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.4, min_tracking_confidence=0.4)
'''
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M',
    13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y',
    25: 'Z', 26: 'hello', 27: 'iloveyou', 28: 'what-'
}
older one
'''
labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24
              : 'Y', 25: 'Z', 26: 'are', 27: 'hello', 28: 'how', 29: 'iloveyou', 30: 'what-', 31: 'you'}

cap = cv2.VideoCapture(0)
highest_prediction = {"label": None, "confidence": 0.0}
highest_prediction_lock = threading.Lock()
label_confidence_map = {}
start_time = time()


def update_highest_prediction(label, confidence):
    global highest_prediction, label_confidence_map, start_time
    elapsed_time = time() - start_time

    with highest_prediction_lock:
        # update new highest label
        if label in label_confidence_map:
            label_confidence_map[label] = max(label_confidence_map[label], confidence)
        else:
            label_confidence_map[label] = confidence

        # change label after 2s
        if elapsed_time >= 2:
            # max label after 2 seconds
            highest_label = max(label_confidence_map, key=label_confidence_map.get)
            highest_confidence = label_confidence_map[highest_label]

            highest_prediction["label"] = highest_label
            highest_prediction["confidence"] = highest_confidence

            # reset to get a new label
            label_confidence_map.clear()
            start_time = time()


# mediapipe configuration from test.py
def generate_frames():
    global highest_prediction

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

        predictions = model.predict(frame, conf=0.4)
        boxes = predictions[0].boxes

        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = labels_dict.get(cls, f"Class {cls}")
            update_highest_prediction(label, conf)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} ({conf:.2f})", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/get_highest_prediction', methods=['GET'])
def get_highest_prediction():
    """
    Serve the current highest prediction.
    """
    global highest_prediction
    with highest_prediction_lock:
        print(highest_prediction)
        return jsonify(highest_prediction), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
