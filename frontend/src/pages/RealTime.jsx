import { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./RealTime.css";

function RealTime() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedWords, setDetectedWords] = useState([]); // State to store words and timestamps
  const wordDisplayDuration = 5000; // Words stay on screen for 5 seconds

  // Define our label map
  const labelMap = {
    1: { name: "Hello", color: "red" },
    2: { name: "Thank You", color: "yellow" },
    3: { name: "I Love You", color: "lime" },
    4: { name: "Yes", color: "blue" },
    5: { name: "No", color: "purple" },
  };

  // Function to draw rectangles and update detected words
  const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
    const currentTime = Date.now(); // Get current timestamp
    const newWords = []; // Store words detected in this frame

    for (let i = 0; i <= boxes.length; i++) {
      if (boxes[i] && classes[i] && scores[i] > threshold) {
        const [y, x, height, width] = boxes[i];
        const text = classes[i];

        // Draw bounding boxes
        ctx.strokeStyle = labelMap[text]["color"];
        ctx.lineWidth = 10;
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";

        ctx.beginPath();
        ctx.fillText(
          labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
          x * imgWidth,
          y * imgHeight - 10
        );
        ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 1.5);
        ctx.stroke();

        // Add word to newWords array
        newWords.push({ name: labelMap[text]["name"], timestamp: currentTime });
      }
    }

    // Merge new words with existing words, removing expired ones
    setDetectedWords((prevWords) => {
      const filteredWords = prevWords.filter(
        (word) => currentTime - word.timestamp < wordDisplayDuration
      );

      // Check if the most recent word is the same as the new word
      if (
        newWords.length > 0 &&
        (!filteredWords.length || filteredWords[filteredWords.length - 1].name !== newWords[0].name)
      ) {
        return [...filteredWords, ...newWords];
      }

      return filteredWords; // Don't add duplicate words
    });
  };

  // Main function to make API requests to the pretrained  model
  const runCoco = async () => {
    // Load network
    const net = await tf.loadGraphModel(
      "https://tensorflow-js-realtimemodel.s3.us-east.cloud-object-storage.appdomain.cloud/model.json"
    );

    //  Loop and detect hands
    // Save the interval ID so it can be cleared later
    const intervalId = setInterval(() => {
      detect(net);
    }, 16.7);

    return () => clearInterval(intervalId);
  };

  // Check if canvasRef or webcamRef is null before proceeding
  const detect = async (net) => {
    if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video) {
      return;
    }

    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make predections
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();

      // Draw Mesh
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          requestAnimationFrame(() => {
            drawRect(
              boxes[0],
              classes[0],
              scores[0],
              0.8,
              videoWidth,
              videoHeight,
              ctx
            );
          });
        }
      }

      // Dispose to clean up memory 
      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    let cleanupFunction;
    (async () => {
      cleanupFunction = await runCoco();
    })();
    // Cleanup on unmount
    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, []);

  return (
    <div className="content-containers">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

        {/* Render Detected Words */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          {detectedWords.length > 0
            ? detectedWords.map((word, index) => (
                <div key={index}>{word.name}</div>
              ))
            : "Waiting for detection..."}
        </div>
      </header>
    </div>
  );
}

export default RealTime;
