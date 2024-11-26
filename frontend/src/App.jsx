import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import RealTime from "./pages/Realtime";
import Home from "./pages/Home";
import Learn from "./pages/Learn"; 
import About from "./pages/About";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realtime" element={<RealTime />} />
          <Route path="/learn" element={<Learn />} /> 
          <Route path="/about" element={<About />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
