import { useState } from "react";
import { SketchPicker, RGBColor, ColorResult } from "react-color";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from "react-bootstrap";
import "../styles/MotionLight.css";

type MotionLightProps = {
  onChange: (color: RGBColor) => void;
  onSubmit: () => void;
};

const MotionLightAccordion = (props: MotionLightProps) => {
  const [color, setColor] = useState<RGBColor>({ r: 255, g: 255, b: 255 });

  const onChangeColor = (color: ColorResult) => {
    setColor(color.rgb);
    props.onChange(color.rgb);
  };

  return (
    <div className="accordion-container">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Motion Light</Accordion.Header>
          <Accordion.Body>
            <div className="info-container">
              <SketchPicker color={color} onChange={onChangeColor} />
              <button className="btn btn-primary mt-3" onClick={props.onSubmit}>
                Submit Color
              </button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default MotionLightAccordion;
