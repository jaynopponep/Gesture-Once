// eslint-disable-next-line no-unused-vars
import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
import {drawRect} from "../utilities"; 

function RealTime() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // Load Network
    const net = await tf.loadGraphModel('https://tensorflow-js-realtimemodel.s3.us-east.cloud-object-storage.appdomain.cloud/model.json')
    
    //  Loop and detect hands
    // Save the interval ID so it can be cleared later
    const intervalId = setInterval(() => {
      detect(net);
    }, 16.7);

        // Return a cleanup function to clear the interval on unmount
        return () => clearInterval(intervalId);
  };

    const detect = async (net) => {
      // Check if canvasRef or webcamRef is null before proceeding
      if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video) {
        return; // Exit early if any of these are null
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

        // 4. TODO - Make Detections
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeBilinear(img, [640, 480]);
        const casted = resized.cast('int32');
        const expanded = casted.expandDims(0);
        const obj = await net.executeAsync(expanded);
        console.log(obj);

        const boxes = await obj[1].array();
        const classes = await obj[2].array();
        const scores = await obj[4].array();

        // Draw mesh
        if (canvasRef.current) { // Check again to ensure canvasRef is not null
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) { // Check if ctx is available
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

        // Dispose of tensors to free up memory
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
    <div className="App">
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
      </header>
    </div>
  );
}

export default RealTime;