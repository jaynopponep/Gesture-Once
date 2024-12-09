import React, { useEffect, useState, useRef } from "react";
import "./Learn.css";

import a from "../assets/alphabet/a.png";
import b from "../assets/alphabet/b.png";
import c from "../assets/alphabet/c.png";
import d from "../assets/alphabet/d.png";
import f from "../assets/alphabet/f.png";
import g from "../assets/alphabet/g.png";
import h from "../assets/alphabet/h.png";
import i from "../assets/alphabet/i.jpg";
import j from "../assets/alphabet/j.png";
import k from "../assets/alphabet/k.jpg";
import l from "../assets/alphabet/l.jpg";
import m from "../assets/alphabet/m.png";
import n from "../assets/alphabet/n.svg";
import o from "../assets/alphabet/o.png";
import p from "../assets/alphabet/p.svg";
import q from "../assets/alphabet/q.svg";
import r from "../assets/alphabet/r.svg";
import s from "../assets/alphabet/s.png";
import t from "../assets/alphabet/t.svg";
import u from "../assets/alphabet/u.jpg";
import v from "../assets/alphabet/v.svg";
import w from "../assets/alphabet/w.svg";
import x from "../assets/alphabet/x.svg";
import y from "../assets/alphabet/y.svg";

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
    if (selectedLetter === "D") return <img src={d} alt="Letter D" />;
    if (selectedLetter === "F") return <img src={f} alt="Letter F" />;
    if (selectedLetter === "G") return <img src={g} alt="Letter G" />;
    if (selectedLetter === "H") return <img src={h} alt="Letter H" />;
    if (selectedLetter === "I") return <img src={i} alt="Letter I" />;
    if (selectedLetter === "J") return <img src={j} alt="Letter J" />;
    if (selectedLetter === "K") return <img src={k} alt="Letter K" />;
    if (selectedLetter === "L") return <img src={l} alt="Letter L" />;
    if (selectedLetter === "M") return <img src={m} alt="Letter M" />;
    if (selectedLetter === "N") return <img src={n} alt="Letter N" />;
    if (selectedLetter === "O") return <img src={o} alt="Letter O" />;
    if (selectedLetter === "P") return <img src={p} alt="Letter P" />;
    if (selectedLetter === "Q") return <img src={q} alt="Letter Q" />;
    if (selectedLetter === "R") return <img src={r} alt="Letter R" />;
    if (selectedLetter === "S") return <img src={s} alt="Letter S" />;
    if (selectedLetter === "T") return <img src={t} alt="Letter T" />;
    if (selectedLetter === "U") return <img src={u} alt="Letter U" />;
    if (selectedLetter === "V") return <img src={v} alt="Letter V" />;
    if (selectedLetter === "W") return <img src={w} alt="Letter W" />;
    if (selectedLetter === "X") return <img src={x} alt="Letter X" />;
    if (selectedLetter === "Y") return <img src={y} alt="Letter Y" />;



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
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="I">I</option>
              <option value="J">J</option>
              <option value="K">K</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="N">N</option>
              <option value="O">O</option>
              <option value="P">P</option>
              <option value="Q">Q</option>
              <option value="R">R</option>
              <option value="S">S</option>
              <option value="T">T</option>
              <option value="U">U</option>
              <option value="V">V</option>
              <option value="W">W</option>
              <option value="X">X</option>
              <option value="Y">Y</option>
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
