import React, { useState } from "react";
import { RGBColor } from "react-color";
import MotionCameraAccordion from "./Components/VideoPlayerAccordion";
import MotionLightAccordion from "./Components/MotionLightAccordion";

const App: React.FC = () => {
  const [color, setColor] = useState({ r: 255, g: 255, b: 255 });

  const handleColorChange = (color: RGBColor) => {
    setColor(color);
  };

  const handleSubmit = async () => {
    const { r, g, b } = color;
    try {
      const response = await fetch(
        "https://192.168.50.171:5500/api/change-color",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ r, g, b }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`Color submitted successfully: ${data.message}`);
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting color:", error);
    }
  };

  return (
    <div>
      <MotionLightAccordion
        onChange={handleColorChange}
        onSubmit={handleSubmit}
      />
      <MotionCameraAccordion />
    </div>
  );
};

export default App;
