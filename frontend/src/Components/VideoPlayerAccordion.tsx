import VideoPlayer from "./VideoPlayer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion } from "react-bootstrap";
import "C:/Users/msoar/Smart Home/frontend/src/css/MotionCamera.css";

const MotionCameraAccordion = () => {
  return (
    <div className="accordion-container">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Motion Camera</Accordion.Header>
          <Accordion.Body>
            <VideoPlayer />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default MotionCameraAccordion;
