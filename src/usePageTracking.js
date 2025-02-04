import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const TRACKING_ID = "G-51DW6B3XKT"; // Your GA4 Measurement ID

// Initialize GA once
ReactGA.initialize(TRACKING_ID);

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // GA4 uses `send("pageview", {path})` instead of `pageview(path)`
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);
};
