import { useState } from "react";
import "./Learn.css";

import a from "../assets/alphabet/a.png";
import b from "../assets/alphabet/b.png";
import c from "../assets/alphabet/c.png";

const Learn = () => {
  const [selectedLetter, setSelectedLetter] = useState("");

  const handleSelectChange = (event) => {
    setSelectedLetter(event.target.value);
  };

  const renderLetterImage = () => {
    if (selectedLetter === "A") return <img src={a} alt="Letter A" />;
    if (selectedLetter === "B") return <img src={b} alt="Letter B" />;
    if (selectedLetter === "C") return <img src={c} alt="Letter C" />;
    return <p>No letter selected</p>;
  };

  return (
    <div className="content-learn">
      <div className="model">
        <h1>ADD MODEL HERE</h1>
      </div>
      <div className="content">
        <div className="content-controller">
          <p>Select a letter to learn about:</p>
          <select
            className="dropdown"
            value={selectedLetter}
            onChange={handleSelectChange}
          >
            <option value="">-- Select a Letter --</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <p className="selected-letter">
            {selectedLetter ? `Selected: ${selectedLetter}` : "No letter selected"}
          </p>
        </div>
        <div className="content-output">
          <p>Output:</p>
          {renderLetterImage()}
        </div>
      </div>
    </div>
  );
};

export default Learn;
