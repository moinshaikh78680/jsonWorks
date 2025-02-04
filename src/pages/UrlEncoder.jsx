import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const UrlEncoder = () => {
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");

  const encodeText = () => setEncoded(encodeURIComponent(text));
  const decodeText = () => setDecoded(decodeURIComponent(text));

  return (
    <Container className="mt-4">
      <h2>🔗 URL Encoder / Decoder</h2>
      <Row>
        <Col md={6}>
          <Form.Label>Enter Text:</Form.Label>
          <Form.Control
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button className="mt-2" variant="primary" onClick={encodeText}>
            Encode
          </Button>
          <Button
            className="mt-2 ms-2"
            variant="secondary"
            onClick={decodeText}
          >
            Decode
          </Button>
        </Col>
        <Col md={6}>
          <Form.Label>Result:</Form.Label>
          <Form.Control type="text" readOnly value={encoded || decoded} />
        </Col>
      </Row>
    </Container>
  );
};

export default UrlEncoder;
