import "./Home.css";
import landingPageImage from "../assets/logo-with-slogan.png";

import helloVideo from "../assets/videos/hello.mp4";
import ilyVideo from "../assets/videos/ily.mp4";
import noVideo from "../assets/videos/no.mp4";
import tyVideo from "../assets/videos/ty.mp4";
import yesVideo from "../assets/videos/yes.mp4";
import aslAlphabet from "../assets/videos/asl-alphabet.gif";

import { useState, useEffect } from "react";

const contentMap = {
  helloVideo: { src: helloVideo, text: "Hello" },
  ilyVideo: { src: ilyVideo, text: "I love you" },
  noVideo: { src: noVideo, text: "No" },
  tyVideo: { src: tyVideo, text: "Thank you" },
  yesVideo: { src: yesVideo, text: "Yes" },
};

const Home = () => {
  const videoKeys = Object.keys(contentMap);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleVideoEnd = () => {
    // Move to the next video, loop back to the start when reaching the end
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoKeys.length);
  };

  useEffect(() => {
    // Cleanup to reset state when leaving the component
    return () => setCurrentIndex(0);
  }, []);

  const currentVideoKey = videoKeys[currentIndex];
  const currentVideo = contentMap[currentVideoKey];

  return (
    <div className="content-container">
      {/* Header Section */}
      <div className="header">
        <div className="landing-page-image">
          <img
            className="landingImage"
            src={landingPageImage}
            alt="Description of the image"
          />
        </div>
        <div className="content-description">
          <h1>Make Learning ASL more accessible!</h1>
        </div>
      </div>

      {/* Interpret Section */}
      <div className="interpret">
        <div className="gif-carousel">
          {/* Video Carousel */}
          <video
            key={currentVideoKey} // Ensures re-render on video change
            src={currentVideo.src}
            autoPlay
            muted
            onEnded={handleVideoEnd} // Triggers when the video ends
            className="video"
          />
          <div className="video-caption">{currentVideo.text}</div>
        </div>
        <div className="side-text">
          <h1>Interpret</h1>
          <p>Sandbox environment to interpret ASL phrases in real time</p>
        </div>
      </div>

      {/* Learn Section */}
      <div className="learn">
        <div className="side-text">
            <h1>Learn</h1>
            <p>Educational space to learn ASL alphabet and phrases</p>
        </div>
        <div className="learn-image">
        <img src={aslAlphabet} className="aslAlphabetImg" alt="asl-alphabet-gif" />
        </div>

      </div>
    </div>
  );
};

export default Home;
