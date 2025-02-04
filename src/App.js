import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import ReactGA from "react-ga4";
import LandingPage from "./pages/LandingPage";
import JsonFormatter from "./pages/JsonFormatter";
import JsonDiff from "./pages/JsonDiff";
import UrlEncoder from "./pages/UrlEncoder";
import "@fontsource/ubuntu";

// Initialize Google Analytics with GA4 Measurement ID
const TRACKING_ID = "G-51DW6B3XKT";
ReactGA.initialize(TRACKING_ID);

// ✅ Page Tracking Hook (Now inside Router context)
const usePageTracking = () => {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
};

// ✅ Wrap <Routes> inside a component to ensure it has Router context
const AppRoutes = () => {
  usePageTracking(); // This will now work inside Router
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/json-formatter" element={<JsonFormatter />} />
      <Route path="/json-diff" element={<JsonDiff />} />
      <Route path="/url-encoder" element={<UrlEncoder />} />
    </Routes>
  );
};

// ✅ Wrap everything inside <Router>
const App = () => {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            JSON Works
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/json-formatter">
              JSON Formatter
            </Nav.Link>
            <Nav.Link as={Link} to="/json-diff">
              JSON Diff
            </Nav.Link>
            <Nav.Link as={Link} to="/url-encoder">
              URL Encoder
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <AppRoutes /> {/* ✅ Now this is inside Router */}
      </Container>
    </Router>
  );
};

export default App;
