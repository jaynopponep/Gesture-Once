# Learn-ASL (YOLO training)

## Overview
Learn-ASL is a machine learning project designed to recognize American Sign Language (ASL) gestures and translate them into text using the YOLOv8 object detection model and MediaPipe for hand landmark detection. 
This project aims to bridge communication gaps for ASL users by providing an educational and efficient sign-to-text conversion tool for learning basic ASL.

## Dataset
Dataset Link: [ASL Letters Dataset](https://public.roboflow.com/object-detection/american-sign-language-letters)

## Tools and Libraries
- [Numpy](https://numpy.org/doc/)
- [OpenCv2](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
- [ultralytics](https://github.com/ultralytics/ultralytics)
- [mediapipe](https://ai.google.dev/edge/mediapipe/solutions/guide)
- [roboflow](https://docs.roboflow.com/)

## Features
Object Detection with YOLOv8: Recognizes ASL letters and gestures from a live video feed.
Hand Landmarks with MediaPipe: Enhances gesture recognition by aligning bounding boxes to hand landmarks.
Gesture Logging: Logs the highest predicted gesture with confidence scores to a text file for debugging and potential user interfaces.

## Use Cases:

### Real-Time Conversion
The system can be engineered to detect ASL gestures using a camera which converts sign language into text in real-time. This would enable deaf individuals to communicate more easily with those who do not understand ASL. Additionally, the system can be extended to translate ASL videos into text for users who do not know ASL.

### Educational and Training Purposes:
The system can serve as a learning platform for users who are practicing sign langauge. It can be developed so that it can evaluate a user’s sign language accuracy and provide instant feedback.

## Future Work
Interface Development: Build a GUI for real-time gesture-to-text translation.
Dataset Expansion: Incorporate more ASL gestures for robust recognition.
Performance Optimization: Optimize logging and frame processing speed.

## Contributors
Jay Noppone Pornpitaksuk, Claudio Perinuzzi, Loyd Flores, Kenneth Guillont
