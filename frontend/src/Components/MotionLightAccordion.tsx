import MotionLightControl from "./ColorSelector";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion } from "react-bootstrap";
import { RGBColor } from "react-color";
import "../styles/MotionLight.css";


type MotionAccordionProps = {
  onChange: (color: RGBColor) => void;
  onSubmit: () => void;
};

const MotionLightAccordion = (props: MotionAccordionProps) => {
  return (
    <div className="accordion-container">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Motion Light</Accordion.Header>
          <Accordion.Body>
            <MotionLightControl
              onChange={props.onChange}
              onSubmit={props.onSubmit}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default MotionLightAccordion;
