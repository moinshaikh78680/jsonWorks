import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  Dropdown,
  Card,
} from "react-bootstrap";
import { jsonrepair } from "jsonrepair";
import ReactJson from "react-json-view";
import DiffMatchPatch from "diff-match-patch";

// ─────────────────────────────────────────────────────────────
// Helper: highlight search query in a text by wrapping matches in <mark>
const highlightSearchText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

// ─────────────────────────────────────────────────────────────
// Input Box Component (Textarea with line numbers)
// Also auto-scrolls to the first matching line when searchQuery changes.
const LineNumberedTextarea = ({
  value,
  onChange,
  placeholder,
  showSearch,
  searchQuery,
  onSearchChange,
  selectedLine,
  onLineClick,
}) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // When scrolling the textarea, sync the line numbers column.
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Get lines from value.
  const lines = value.split("\n");

  // When the search query changes, auto-scroll to the first matching line.
  useEffect(() => {
    if (searchQuery && textareaRef.current) {
      const lowerQuery = searchQuery.toLowerCase();
      const idx = lines.findIndex((line) =>
        line.toLowerCase().includes(lowerQuery)
      );
      if (idx >= 0) {
        // Assume a constant line height (e.g., 20px)
        const lineHeight = 20;
        textareaRef.current.scrollTop = idx * lineHeight;
        if (lineNumbersRef.current) {
          lineNumbersRef.current.scrollTop = idx * lineHeight;
        }
      }
    }
  }, [searchQuery, lines]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {showSearch && (
        <div style={{ padding: "5px", backgroundColor: "#ddd" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            style={{ width: "100%" }}
          />
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <div
          ref={lineNumbersRef}
          style={{
            backgroundColor: "#eee",
            textAlign: "right",
            padding: "10px",
            userSelect: "none",
            borderRight: "1px solid #ccc",
            minWidth: "40px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const highlight =
              selectedLine === lineNum ||
              (searchQuery &&
                line.toLowerCase().includes(searchQuery.toLowerCase()));
            return (
              <div
                key={index}
                onClick={() => onLineClick(lineNum)}
                style={{
                  cursor: "pointer",
                  backgroundColor: highlight ? "yellow" : "transparent",
                }}
              >
                {lineNum}
              </div>
            );
          })}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onScroll={handleScroll}
          placeholder={placeholder}
          style={{
            flex: 1,
            paddingLeft: "50px",
            fontFamily: "monospace",
            fontSize: "14px",
            resize: "none",
            height: "100%",
            border: "none",
            outline: "none",
            overflowY: "auto",
            lineHeight: "20px",
          }}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Output Box Component (Preformatted block with line numbers)
// Also auto-scrolls to first matching line when searchQuery changes.
const LineNumberedBlock = ({
  content,
  isHtml,
  className,
  showSearch,
  searchQuery,
  onSearchChange,
  selectedLine,
  onLineClick,
}) => {
  const containerRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const contentRef = useRef(null);

  const handleScroll = () => {
    if (lineNumbersRef.current && contentRef.current) {
      lineNumbersRef.current.scrollTop = contentRef.current.scrollTop;
    }
  };

  const lines = content.split("\n");

  // Auto-scroll to first matching line when searchQuery changes.
  useEffect(() => {
    if (searchQuery && contentRef.current) {
      const lowerQuery = searchQuery.toLowerCase();
      // Find the first child div whose textContent contains the query.
      const children = contentRef.current.children;
      for (let child of children) {
        if (
          child.textContent &&
          child.textContent.toLowerCase().includes(lowerQuery)
        ) {
          contentRef.current.scrollTop = child.offsetTop;
          break;
        }
      }
    }
  }, [searchQuery]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        position: "relative",
        height: "100%",
        minHeight: 0,
        flexDirection: "column",
      }}
    >
      {showSearch && (
        <div style={{ padding: "5px", backgroundColor: "#ddd" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            style={{ width: "100%" }}
          />
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <div
          ref={lineNumbersRef}
          style={{
            backgroundColor: "#eee",
            textAlign: "right",
            padding: "10px",
            userSelect: "none",
            borderRight: "1px solid #ccc",
            minWidth: "40px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const highlight =
              selectedLine === lineNum ||
              (searchQuery &&
                line.toLowerCase().includes(searchQuery.toLowerCase()));
            return (
              <div
                key={index}
                onClick={() => onLineClick(lineNum)}
                style={{
                  cursor: "pointer",
                  backgroundColor: highlight ? "yellow" : "transparent",
                }}
              >
                {lineNum}
              </div>
            );
          })}
        </div>
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className={className}
          style={{
            flex: 1,
            paddingLeft: "50px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "14px",
            whiteSpace: "pre-wrap",
            height: "100%",
            minHeight: 0,
          }}
        >
          {lines.map((line, index) => {
            const lineNum = index + 1;
            let displayedLine = line;
            if (searchQuery) {
              displayedLine = highlightSearchText(displayedLine, searchQuery);
            }
            return (
              <div
                key={index}
                onClick={() => onLineClick(lineNum)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedLine === lineNum ? "yellow" : "transparent",
                }}
                dangerouslySetInnerHTML={{ __html: displayedLine }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Syntax highlighting function: wraps JSON tokens in span elements.
const syntaxHighlight = (jsonString) => {
  let json = jsonString;
  if (typeof json !== "string") {
    json = JSON.stringify(json, null, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
// Custom theme for ReactJson (Tree View) to mimic our beautify colors:
// keys: black, strings: green, numbers: red, booleans/null: black.
const customTheme = {
  base00: "#ffffff", // background
  base01: "#f7f7f7",
  base02: "#e1e1e1",
  base03: "#cfcfcf",
  base04: "#b1b1b1",
  base05: "#000000", // text and keys
  base06: "#9e9e9e",
  base07: "#757575",
  base08: "green", // strings
  base09: "red", // numbers
  base0A: "#000000", // booleans
  base0B: "#000000", // keys alternate
  base0C: "#000000",
  base0D: "#000000",
  base0E: "#000000",
  base0F: "#000000",
};

// ─────────────────────────────────────────────────────────────
// Main Component
const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("{}");
  const [error, setError] = useState(null);
  const [autoFixedJson, setAutoFixedJson] = useState("{}");
  const [viewMode, setViewMode] = useState("beautify");

  // Search and line selection states for both sides.
  const [showSearch, setShowSearch] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [outputSearch, setOutputSearch] = useState("");
  const [inputSelectedLine, setInputSelectedLine] = useState(null);
  const [outputSelectedLine, setOutputSelectedLine] = useState(null);

  // Global keydown: Ctrl+F shows the search boxes.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Format JSON on input change.
  useEffect(() => {
    if (!input.trim()) {
      setFormattedJson("");
      setAutoFixedJson("");
      setError(null);
      return;
    }
    try {
      let parsedJson = input;
      while (
        typeof parsedJson === "string" &&
        parsedJson.startsWith("{") &&
        parsedJson.includes('\\"')
      ) {
        parsedJson = JSON.parse(parsedJson);
      }
      if (typeof parsedJson === "string") {
        parsedJson = JSON.parse(parsedJson);
      }
      let formatted = JSON.stringify(parsedJson, null, 2);
      setFormattedJson(formatted);
      setAutoFixedJson(formatted);
      setError(null);
    } catch (err) {
      const fixedResult = attemptAutoFix(input);
      if (fixedResult) {
        setAutoFixedJson(fixedResult.fixedJson);
        setError("Invalid JSON detected! Below is an auto-fixed version:");
      } else {
        setAutoFixedJson("{}");
        setError(
          "Invalid JSON! Could not auto-fix all issues. Please check manually."
        );
      }
      setFormattedJson("{}");
    }
  }, [input]);

  const attemptAutoFix = (json) => {
    try {
      const repaired = jsonrepair(json);
      const parsedFixed = JSON.parse(repaired);
      const fixedJsonStr = JSON.stringify(parsedFixed, null, 2);
      return { fixedJson: fixedJsonStr };
    } catch (e) {
      console.error("Auto-fix error:", e);
      return null;
    }
  };

  return (
    <Container style={{ height: "100vh" }}>
      {/* Header (Navigation-style: icon and bold text) */}
      <Row className="mb-3">
        <Col md={10} className="text-left">
          <h2>JSON Formatter</h2>
        </Col>
        <Col md={2} className="text-end">
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              {viewMode.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setViewMode("beautify")}>
                Beautify
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setViewMode("tree")}>
                Tree View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setViewMode("raw")}>
                Raw JSON
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Main Content: Input and Output boxes side-by-side */}
      <Row className="json-container" style={{ height: "calc(100vh - 160px)" }}>
        {/* Left Side: Input Box */}
        <Col md={6} className="json-box" style={{ height: "100%" }}>
          <Card className="shadow-sm h-100">
            <Card.Body
              className="d-flex flex-column"
              style={{ height: "100%", minHeight: 0 }}
            >
              <Form.Label className="fw-bold">Paste JSON Here:</Form.Label>
              <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                <LineNumberedTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste JSON data here..."
                  showSearch={showSearch}
                  searchQuery={inputSearch}
                  onSearchChange={setInputSearch}
                  selectedLine={inputSelectedLine}
                  onLineClick={setInputSelectedLine}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side: Output Box */}
        <Col md={6} className="json-box" style={{ height: "100%" }}>
          <Card className="shadow-sm h-100">
            <Card.Body
              className="d-flex flex-column"
              style={{ height: "100%", minHeight: 0 }}
            >
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="json-output" style={{ flex: 1, minHeight: 0 }}>
                {viewMode === "beautify" && (
                  <LineNumberedBlock
                    content={syntaxHighlight(autoFixedJson)}
                    isHtml={true}
                    className="json-pre beautified"
                    showSearch={showSearch}
                    searchQuery={outputSearch}
                    onSearchChange={setOutputSearch}
                    selectedLine={outputSelectedLine}
                    onLineClick={setOutputSelectedLine}
                  />
                )}
                {viewMode === "raw" && (
                  <LineNumberedBlock
                    content={syntaxHighlight(autoFixedJson)}
                    isHtml={true}
                    className="json-pre raw"
                    showSearch={showSearch}
                    searchQuery={outputSearch}
                    onSearchChange={setOutputSearch}
                    selectedLine={outputSelectedLine}
                    onLineClick={setOutputSelectedLine}
                  />
                )}
                {viewMode === "tree" && (
                  <div
                    className="json-tree"
                    style={{ height: "100%", overflowY: "auto" }}
                  >
                    <ReactJson
                      src={
                        autoFixedJson && autoFixedJson.trim()
                          ? JSON.parse(autoFixedJson)
                          : {}
                      }
                      theme={customTheme}
                      collapsed={2}
                      displayDataTypes={false}
                      enableClipboard={false}
                    />
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional CSS Styling */}
      <style>
        {`
          .json-container {
            display: flex;
          }
          .json-box {
            display: flex;
            flex-direction: column;
          }
          .json-output {
            flex-grow: 1;
            overflow-y: auto;
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
          }
          .json-pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            padding: 10px;
            border-radius: 5px;
            background: #fafafa;
            color: #333;
            font-size: 14px;
          }
          .beautified {
            background: #f5f5f5;
            border-left: 5px solid #007bff;
            padding: 10px;
          }
          .json-tree {
            background-color: #ffffff !important;
            padding: 10px;
            border-radius: 5px;
          }
          /* Syntax highlighting styles for beautify/raw views */
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

export default JsonFormatter;
