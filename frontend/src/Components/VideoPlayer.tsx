import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const VideoPlayer: React.FC = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get<string[]>("/api/videos");
        const mp4Files = response.data.filter(files => files.endsWith(".mp4"));
        setVideos(mp4Files);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const handleVideoSelect = (video: string) => {
    setSelectedVideo(video);
  };

  return (
    <Container fluid className="my-4">
      <Row>
        <Col md={4}>
          <h4>Available Videos</h4>
          <ListGroup>
            {videos.length === 0 ? (
              <Alert variant="info">No videos available.</Alert>
            ) : (
              videos.map((video, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleVideoSelect(video)}
                  active={selectedVideo === video}
                >
                  {video}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>
        <Col md={8}>
          {selectedVideo ? (
            <div>
              <h4>Playing: {selectedVideo}</h4>
              <div style={{ maxWidth: "640px", margin: "0 auto" }}>
                <video key={selectedVideo} controls className="w-100">
                  <source src={`/videos/${selectedVideo}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ) : (
            <Alert variant="info">Select a video to play.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VideoPlayer;
