// import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { GoogleMap } from "./pages/GoogleMap.tsx";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route index element={<GoogleMap />} />
        <Route path="/googlemap" element={<GoogleMap />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  // {/* </StrictMode>, */}
);
