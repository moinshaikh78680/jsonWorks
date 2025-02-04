import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { diffLines } from "diff";

// ─────────────────────────────────────────────────────────────
// Helper function to apply syntax highlighting to a JSON string.
// Keys: black, Strings: green, Numbers: red, Booleans/null: black.
const syntaxHighlight = (jsonString) => {
  let json = jsonString;
  if (typeof json !== "string") {
    json = JSON.stringify(json, null, 2);
  }
  // Escape HTML special characters.
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Wrap tokens in span elements.
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

// ─────────────────────────────────────────────────────────────
// Main Component
const JsonDiff = () => {
  const [json1, setJson1] = useState("");
  const [json2, setJson2] = useState("");
  const [formattedJson1, setFormattedJson1] = useState("");
  const [formattedJson2, setFormattedJson2] = useState("");
  const [summary, setSummary] = useState({ additions: 0, deletions: 0 });
  const [isCompared, setIsCompared] = useState(false);

  const compareJson = () => {
    try {
      // Parse and pretty-print both JSON inputs.
      const parsedJson1 = JSON.stringify(JSON.parse(json1), null, 2);
      const parsedJson2 = JSON.stringify(JSON.parse(json2), null, 2);

      // Compute a diff (line-by-line).
      const diff = diffLines(parsedJson1, parsedJson2);

      // Counters for summary.
      let additions = 0,
        deletions = 0;

      // For JSON 1: mark removed parts.
      const highlightedJson1 = diff
        .map((part) => {
          if (part.removed) {
            deletions += part.count || part.value.split("\n").length - 1;
            return `<span class='json-removed'>${syntaxHighlight(
              part.value
            )}</span>`;
          }
          return syntaxHighlight(part.value);
        })
        .join("");

      // For JSON 2: mark added parts.
      const highlightedJson2 = diff
        .map((part) => {
          if (part.added) {
            additions += part.count || part.value.split("\n").length - 1;
            return `<span class='json-added'>${syntaxHighlight(
              part.value
            )}</span>`;
          }
          return syntaxHighlight(part.value);
        })
        .join("");

      setFormattedJson1(highlightedJson1);
      setFormattedJson2(highlightedJson2);
      setSummary({ additions, deletions });
      setIsCompared(true);
    } catch (error) {
      setFormattedJson1("Invalid JSON!");
      setFormattedJson2("Invalid JSON!");
      setSummary({ additions: 0, deletions: 0 });
      setIsCompared(true);
    }
  };

  const resetComparison = () => {
    setJson1("");
    setJson2("");
    setFormattedJson1("");
    setFormattedJson2("");
    setSummary({ additions: 0, deletions: 0 });
    setIsCompared(false);
  };

  return (
    <Container fluid className="mt-4" style={{ height: "100vh" }}>
      {/* Header */}
      <Row className="mb-3">
        <Col md={8} className="d-flex align-items-end">
          <h2 className="text-center">🔍 JSON Diff Tool</h2>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          {!isCompared ? (
            <Button variant="primary" onClick={compareJson} className="w-100">
              Compare
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={resetComparison}
              className="w-100"
            >
              Compare Another
            </Button>
          )}
        </Col>
      </Row>

      {/* Diff Summary Header (only shown after comparison) */}
      {isCompared && (
        <Row className="mb-3">
          <Col className="text-center">
            <strong>
              Additions: {summary.additions} | Deletions: {summary.deletions}
            </strong>
          </Col>
        </Row>
      )}

      {/* When compared, hide input boxes and show diff outputs */}
      {isCompared ? (
        <Row style={{ height: "calc(100vh - 160px)" }}>
          <Col md={6}>
            <pre
              className="json-display full"
              dangerouslySetInnerHTML={{ __html: formattedJson1 }}
            />
          </Col>
          <Col md={6}>
            <pre
              className="json-display full"
              dangerouslySetInnerHTML={{ __html: formattedJson2 }}
            />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={6}>
            <Form.Label>JSON 1:</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={json1}
              onChange={(e) => setJson1(e.target.value)}
            />
            <pre
              className="json-display"
              dangerouslySetInnerHTML={{ __html: formattedJson1 }}
            />
          </Col>
          <Col md={6}>
            <Form.Label>JSON 2:</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={json2}
              onChange={(e) => setJson2(e.target.value)}
            />
            <pre
              className="json-display"
              dangerouslySetInnerHTML={{ __html: formattedJson2 }}
            />
          </Col>
        </Row>
      )}

      <style>
        {`
          /* Default diff box style for non-compared view */
          .json-display {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            max-height: 600px;
            overflow-y: auto;
            white-space: pre-wrap;
          }
          /* When compared, force diff boxes to fill the remaining screen height */
          .json-display.full {
            height: 100%;
            overflow-y: auto;
          }
          /* Diff styles for added/removed lines */
          .json-added {
            background-color: #d4f8d4;
            display: block;
          }
          .json-removed {
            background-color: #f8d4d4;
            display: block;
          }
          /* Syntax highlighting styles */
          .key { color: black; }
          .string { color: green; }
          .number { color: red; }
          .boolean { color: black; }
          .null { color: black; }
        `}
      </style>
    </Container>
  );
};

export default JsonDiff;
