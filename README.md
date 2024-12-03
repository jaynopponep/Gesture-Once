# Learn-ASL (YOLO training)

## Overview
Learn-ASL is a machine learning project designed to recognize American Sign Language (ASL) gestures and translate them into text using the YOLOv8 object detection model and MediaPipe for hand landmark detection. 
This project aims to bridge communication gaps for ASL users by providing an educational and efficient sign-to-text conversion service for learning basic ASL, including the alphabet and many common phrases in ASL.

## Features
Object Detection with YOLOv8: Recognizes ASL letters and gestures from a live video feed.
Hand Landmarks with MediaPipe: Enhances gesture recognition by aligning bounding boxes to hand landmarks.
Gesture Logging: Logs the highest predicted gesture with confidence scores to a text file for debugging and potential user interfaces.

## Tools and Libraries
- [OpenCV2](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
- [Ultralytics](https://github.com/ultralytics/ultralytics)
- [MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/guide)
- [Roboflow](https://docs.roboflow.com/)
- [React](https://react.dev/)

## Use Cases:

### Real-Time Conversion
The system can be engineered to detect ASL gestures using a camera which converts sign language into text in real-time. This would enable deaf individuals to communicate more easily with those who do not understand ASL. Additionally, the system can be extended to translate ASL videos into text for users who do not know ASL.

### Educational and Training Purposes:
The system can serve as a learning platform for users who are practicing sign langauge. It can be developed so that it can evaluate a user’s sign language accuracy and provide instant feedback.

## Setting Up
### NOTE
Make sure Python is installed.
### Installation
1. Install the necessary Python packages
```bash
pip install -r requirements.txt
```
2. Change directory to the frontend and install necessary dependencies
```bash
cd frontend/
npm install
```
3. Run the client
```bash
npm run dev
```
4. Change directory to the backend and run the server that serves the YOLOv8 model
```bash
cd ..
cd backend/
python model_api.py
```
5. Start signing!
## Future Work
Interface Development: Build a GUI for real-time gesture-to-text translation.
Dataset Expansion: Incorporate more ASL gestures for robust recognition.
Performance Optimization: Optimize logging and frame processing speed.

## Dataset
Dataset Link: [ASL Letters Dataset](https://public.roboflow.com/object-detection/american-sign-language-letters)

## Contributors
Jay Noppone Pornpitaksuk, Claudio Perinuzzi, Loyd Flores, Kenneth Guillont
