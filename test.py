import cv2
import numpy as np
from ultralytics import YOLO
import mediapipe as mp

# IF YOUR VIDEO DOESN'T WORK, CHECK HERE AND MAKE SURE THE DIRECTORY MATCHES THE NEW TRAINING DIRECTORY.
model = YOLO("runs/detect/train/weights/best.pt")
# below just uses mediapipe and initializes the hand landmark drawings.
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

# exact labels from train.py below to correctly display prediction
labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22:
 'W', 23: 'X', 24: 'Y', 25: 'Z'}

# enables video capturing
cap = cv2.VideoCapture(0)

while True:
    # reads each frame
    ret, frame = cap.read()
    if not ret:
        break

    # configuration for the frame with RGB colors & landmarks
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    # YOLO prediction here based on frame given
    predictions = model.predict(frame, conf=0.3)
    # MIGHT have to tweak the 'conf' param^ if you run into errors
    boxes = predictions[0].boxes  # get the bounding boxes

    for box in boxes:
        # sets up the box sizes.
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls = int(box.cls[0])
        conf = box.conf[0]
        # uses label dictionary to get correct letter based on prediction on the box
        label = labels_dict.get(cls, f"Class {cls}")

        # below handles the landmark coordinates and configurations
        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]

            # makes sure that the bounding box is specifically relative to where the landmark shows
            # to try to make the distance between landmark & bounding box as small as mediapipe can do
            x_vals = [landmark.x * frame.shape[1] for landmark in hand_landmarks.landmark]
            y_vals = [landmark.y * frame.shape[0] for landmark in hand_landmarks.landmark]
            x_min, x_max = int(min(x_vals)), int(max(x_vals))
            y_min, y_max = int(min(y_vals)), int(max(y_vals))
            # adjusts the x-y values for the bounding box to be closer to landmark
            x1, y1, x2, y2 = x_min, y_min, x_max, y_max

        # cv2.rectangle() draws the box and cv2.putText() puts the actual text next to the box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} ({conf:.2f})", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # this code just draws the regular landmarks (like in mediapipe demo). most likely not needed to change
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )

    cv2.imshow('Start Signing!', frame)

    # press q to exit!!!!
    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()