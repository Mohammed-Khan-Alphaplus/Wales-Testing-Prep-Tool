import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AssessmentSelector from "./assessment-selector.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AssessmentSelector />
  </StrictMode>
);
