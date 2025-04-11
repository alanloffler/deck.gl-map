import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GoogleMap } from "./pages/GoogleMap.tsx";
import { MapLibre } from "./pages/MapLibre.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<MapLibre />} />
          <Route path="/maplibre" element={<MapLibre />} />
          <Route path="/googlemap" element={<GoogleMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
