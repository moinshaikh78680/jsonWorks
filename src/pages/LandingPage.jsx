import React from "react";
import { Container, Row, Col, Card, Button, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "@fontsource/ubuntu"; // Ensure this is installed via npm/yarn

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="mt-4"
      style={{ fontFamily: "Ubuntu, sans-serif", minHeight: "100vh" }}
    >
      {/* Header Section */}
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h1 style={{ fontWeight: "bold", marginBottom: "20px" }}>
            Welcome to JSON Works
          </h1>
          <p style={{ fontSize: "1.2em", lineHeight: "1.6" }}>
            JSON (JavaScript Object Notation) is a lightweight, text-based data
            interchange format that is easy for humans to read and write, and
            for machines to parse and generate. Discover its structure,
            interesting facts, and powerful techniques to work with JSON data.
          </p>
        </Col>
      </Row>

      {/* Navigation Cards */}
      <Row className="justify-content-center mb-4">
        <Col md={5} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <i
                className="bi bi-code-slash"
                style={{ fontSize: "3em", color: "#007bff" }}
              ></i>
              <Card.Title className="mt-3">JSON Formatter</Card.Title>
              <Card.Text>
                Beautify, validate, and view your JSON data in a clean format.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate("/json-formatter")}
              >
                Go to Formatter
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <i
                className="bi bi-clipboard-data"
                style={{ fontSize: "3em", color: "#007bff" }}
              ></i>
              <Card.Title className="mt-3">JSON Diff Tool</Card.Title>
              <Card.Text>
                Compare two JSON files side-by-side to quickly spot changes.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate("/json-diff")}>
                Go to Diff Tool
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SEO & Educational FAQ Section */}
      <Row className="justify-content-center mb-4">
        <Col md={10}>
          <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>
            Learn About JSON
          </h2>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>What is JSON?</Accordion.Header>
              <Accordion.Body>
                JSON (JavaScript Object Notation) is a simple, lightweight
                data-interchange format that is language-independent. It is
                built on two structures: an object (a collection of name/value
                pairs) and an array (an ordered list of values). Its
                human-readable format has made it the standard for data exchange
                on the web.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Why Use JSON?</Accordion.Header>
              <Accordion.Body>
                JSON’s simplicity and ease-of-use have made it a popular choice
                for data exchange between web clients and servers. Its compact
                format reduces bandwidth usage, and its compatibility with
                nearly every programming language makes it a versatile tool for
                developers.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Interesting Facts about JSON</Accordion.Header>
              <Accordion.Body>
                JSON was popularized by Douglas Crockford, who also helped
                standardize the format. It has largely replaced XML for web data
                exchange due to its smaller size and easier readability. JSON is
                now an integral part of RESTful API design and many modern web
                applications.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                Techniques for Working with JSON
              </Accordion.Header>
              <Accordion.Body>
                Developers use various tools and techniques to work with JSON,
                including formatters, diff tools, validators, and libraries that
                automatically parse and generate JSON data. Modern IDEs and text
                editors offer extensions that highlight JSON syntax, further
                simplifying the development process.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* Additional Global Styling */}
      <style>
        {`
          h1, h2, p, .card-title, .card-text {
            font-family: "Ubuntu", sans-serif;
          }
          .card {
            border: none;
            border-radius: 10px;
          }
          .card-body {
            padding: 20px;
          }
          .accordion-button {
            font-family: "Ubuntu", sans-serif;
            font-weight: bold;
          }
          .accordion-body {
            font-family: "Ubuntu", sans-serif;
            line-height: 1.6;
          }
          body {
            background-color: #ffffff;
          }
        `}
      </style>
    </Container>
  );
};

export default LandingPage;
