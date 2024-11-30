import cv2
import numpy as np
from ultralytics import YOLO
import mediapipe as mp
from time import time

# IF YOUR VIDEO DOESN'T WORK, CHECK HERE AND MAKE SURE THE DIRECTORY MATCHES THE NEW TRAINING DIRECTORY.
model = YOLO("../runs/detect/train-HRU/weights/last.pt")
# below just uses mediapipe and initializes the hand landmark drawings.
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.4, min_tracking_confidence=0.4)

# exact labels from train.py below to correctly display prediction
'''old labels dict without how are you
labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22:
 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'hello', 27: 'iloveyou', 28: 'what-'}
'''
labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24
: 'Y', 25: 'Z', 26: 'are', 27: 'hello', 28: 'how', 29: 'iloveyou', 30: 'what-', 31: 'you'}

# enables video capturing
cap = cv2.VideoCapture(0)

start_time = time()     # Used to calculate when 5 seconds have elapsed to log the highest predicted label
max_pred = (None, 0)    # Tuple to hold the highest predicted label and its corresponding confidence score

def log_highest_pred(start_time, max_pred, label, conf, results):
    '''
    Logs the highest predicted label to a text file (for the time being) after 5 seconds. 
    This function will be used to log ASL characters to an interface for the user.
    '''
    # Calculate elapsed time thus far
    elapsed_time = time() - start_time 

    # If no landmarks were detected or time exceeded 5.5 seconds, reset start time and max prediction to 0 
    if results.multi_hand_landmarks is None or elapsed_time > 5.5:
        return time(), (None, 0)

    # Update the max prediction and label if there is a higher prediction 
    if conf > max_pred[1]:          
        max_pred = (label, conf)
    
    # Log the max predicted label if 5 seconds has elapsed
    if elapsed_time >= 5:  
        # Log to a file for now for debugging (EVENTUALLY CHANGE IT TO PRINT TO THE INTERFACE) and reset time and max prediction
        with open("logs.txt", 'a') as f:    
            f.write(f"{max_pred[0]} ({max_pred[1]:.2f}), elapsed_time = {elapsed_time:2f}\n")
        start_time = 0            
        max_pred = (None, 0)
    
    return start_time, max_pred

while True:
    # reads each frame
    ret, frame = cap.read()
    if not ret:
        break

    # configuration for the frame with RGB colors & landmarks
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    # YOLO prediction here based on frame given
    predictions = model.predict(frame, conf=0.5)
    # MIGHT have to tweak the 'conf' param^ if you run into errors
    #boxes = non_max_suppression(predictions[0].boxes, conf_thres=0.5, iou_thres=0.4)  # get the bounding boxes
    boxes = predictions[0].boxes
    for box in boxes:
        # sets up the box sizes.
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls = int(box.cls[0])
        conf = box.conf[0]
        # uses label dictionary to get correct letter based on prediction on the box
        label = labels_dict.get(cls, f"Class {cls}")

        # log the highest predicted label to an interface (TXT FILE FOR TIME BEING)
        start_time, max_pred = log_highest_pred(start_time, max_pred, label, conf, results)

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
            pad = 40 # apply a padding value to increase the box’s size
            x1, y1, x2, y2 = x_min - pad, y_min - pad, x_max + pad, y_max + pad
            if x1 > x_max or x2 < x_min or y1 > y_max or y2 < y_min:
                continue

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
