import React, { useEffect, useState, useRef } from "react";
import "./Learn.css";

import a from "../assets/alphabet/a.png";
import b from "../assets/alphabet/b.png";
import c from "../assets/alphabet/c.png";

const Learn = () => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [accuracy, setAccuracy] = useState(0); // Track accuracy during recording
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const videoStreamUrl = "http://127.0.0.1:5000/video_feed";
  const highestPredictionUrl = "http://127.0.0.1:5000/get_highest_prediction";

  useEffect(() => {
    const fetchHighestPrediction = async () => {
      if (isRecording && selectedLetter) {
        try {
          const response = await fetch(highestPredictionUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.label === selectedLetter) {
              setAccuracy((prevAccuracy) => Math.max(prevAccuracy, data.confidence * 100));
            }
          } else {
            console.error("Failed to fetch highest prediction");
          }
        } catch (error) {
          console.error("Error fetching highest prediction:", error);
        }
      }
    };

    const intervalId = setInterval(fetchHighestPrediction, 500); // Polling interval for predictions
    return () => clearInterval(intervalId);
  }, [isRecording, selectedLetter]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
              type: "video/webm",
            });
            const url = URL.createObjectURL(blob);
            console.log("Recorded video blob:", blob);
            setRecordedChunks([]);
          }
        };

        mediaRecorderRef.current = mediaRecorder;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      setAccuracy(0); // Reset accuracy
      mediaRecorderRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedLetter(event.target.value);
  };

  const renderLetterImage = () => {
    if (selectedLetter === "A") return <img src={a} alt="Letter A" />;
    if (selectedLetter === "B") return <img src={b} alt="Letter B" />;
    if (selectedLetter === "C") return <img src={c} alt="Letter C" />;
    return <p>No letter selected</p>;
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
      <div className="learn-content-container">
        <div className="learn-model-section">
          {/* Camera feed */}
          <video ref={videoRef} className="learn-local-video" autoPlay playsInline muted />
          <img src={videoStreamUrl} alt="Hand Detection Stream" className="learn-backend-stream" />
          <button onClick={toggleRecording} className="learn-record-button">
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>

        <div className="learn-content-section">
          <div className="learn-content-controller">
            <p>Select a letter to learn about:</p>
            <select
                className="learn-dropdown"
                value={selectedLetter}
                onChange={handleSelectChange}
            >
              <option value="">-- Select a Letter --</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <p className="learn-selected-letter">
              {selectedLetter ? `Selected: ${selectedLetter}` : "No letter selected"}
            </p>
          </div>

          <div className="learn-content-output">
            <p>Output:</p>
            {renderLetterImage()}
            {isRecording && (
                <p className="learn-accuracy">Accuracy: {accuracy.toFixed(2)}%</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default Learn;
