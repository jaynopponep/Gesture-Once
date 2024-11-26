import "./About.css";
import Card from "../components/Card";

import loyd from "../assets/devs/loyd.png";
import ken from "../assets/devs/ken.png";
import claudio from "../assets/devs/claudio.png";
import jay from "../assets/devs/jay.png";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="card-container">
          <Card image={loyd} name="Loyd Flores" college="Queens College, CUNY" />
          <Card image={ken} name="Kenneth Guillont" college="Hunter College, CUNY" />
          <Card image={claudio} name="Claudio Perinuzzi" college="Queens College, CUNY" />
          <Card image={jay} name="Jay Noppone" college="City College, CUNY" />
        </div>
      </div>
      <footer className="sticky-footer">
        <p>© 2024 | CUNY Tech Prep </p>
      </footer>
    </div>
  );
};

export default About;
