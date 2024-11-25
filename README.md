# Learn-ASL (YOLO training)

## Setting Up
The following is the Kaggle link for the dataset we are using the train: https://public.roboflow.com/object-detection/american-sign-language-letters </br>
Data is pre-labeled so we get to skip that step, unless this dataset doesn't work well. However, we simply have to just train the YOLOv11 model on it, I already have the configurations set up. </br>
You actually don't have to do anything except just run train.py to start training, and then we have to figure out the best way to configure test.py to actually test out the model's performance.

## Overview
Learn-ASL is a machine learning project designed to recognize American Sign Language (ASL) gestures and translate them into text using the YOLOv11 object detection model and MediaPipe for hand landmark detection. This project aims to bridge communication gaps for ASL users by providing an intuitive and efficient sign-to-text conversion tool.

## Dataset
Dataset Link: [ASL Letters Dataset](https://public.roboflow.com/object-detection/american-sign-language-letters)

## Tools and Libraries
- [Numpy](https://numpy.org/doc/)
- [OpenCv2](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
- [ultralytics](https://github.com/ultralytics/ultralytics)
- [mediapipe](https://ai.google.dev/edge/mediapipe/solutions/guide)
- [time](https://docs.python.org/3/library/time.html)
- [roboflow](https://docs.roboflow.com/)

## Features
Object Detection with YOLOv11: Recognizes ASL letters and gestures from a live video feed.
Hand Landmarks with MediaPipe: Enhances gesture recognition by aligning bounding boxes to hand landmarks.
Gesture Logging: Logs the highest predicted gesture with confidence scores to a text file for debugging and potential user interfaces.

## Future Work
Interface Development: Build a GUI for real-time gesture-to-text translation.
Dataset Expansion: Incorporate more ASL gestures for robust recognition.
Performance Optimization: Optimize logging and frame processing speed.
