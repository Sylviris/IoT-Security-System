import React, { useState } from "react";
import { RGBColor } from "react-color";
import MotionCameraAccordion from "./Components/MotionCameraAccordion";
import MotionLightAccordion from "./Components/MotionLightAccordion";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"; 
import axios from "axios";

const App: React.FC = () => {
  const [color, setColor] = useState<RGBColor>({ r: 255, g: 255, b: 255 });

  const handleColorChange = (color: RGBColor) => {
    setColor(color);
  };

  const handleSubmit = async () => {
    const { r, g, b } = color;
    try {
      const response = await axios.post(
        "https://192.168.50.171:5500/api/change-color",
        { r, g, b },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(`Color submitted successfully: ${data.message}`);
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting color:", error);
    }
  };

  return (
    <div className="container">
      <header className="my-4">
        <h1 className="text-center">Smart Home Automation</h1>
      </header>
      <main>
        <MotionLightAccordion
          onChange={handleColorChange}
          onSubmit={handleSubmit}
        />
        <MotionCameraAccordion />
      </main>
    </div>
  );
};

export default App;
