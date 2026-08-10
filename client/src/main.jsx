import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./App.jsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* reducedMotion="user" makes every motion/react animation (hover/tap
        scale, tab pill slide, lightbox transitions, etc.) respect the OS
        prefers-reduced-motion setting automatically — the CSS override in
        global.css handles the site's own @keyframes-based entrance
        animations, which framer-motion doesn't touch. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>
);
