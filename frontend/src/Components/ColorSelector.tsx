import { useState } from "react";
import { SketchPicker, RGBColor, ColorResult } from "react-color";
import "../styles/MotionLight.css";

type MotionLightProps = {
  onChange: (color: RGBColor) => void;
  onSubmit: () => void;
};

const MotionLightControl = (props: MotionLightProps) => {
  const [color, setColor] = useState<RGBColor>({
    r: 255,
    g: 255,
    b: 255,
  });

  const onChangeColor = (color: ColorResult) => {
    setColor(color.rgb);
    props.onChange(color.rgb);
  };

  return (
    <div className="info-container">
      <SketchPicker color={color} onChange={onChangeColor} disableAlpha />
      <button onClick={props.onSubmit}> Change Color </button>
    </div>
  );
};

export default MotionLightControl;
