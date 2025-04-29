// import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { Loading } from "./components/Loading.tsx";
const Networks = lazy(() => import("./pages/Networks.tsx"));

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route
        element={
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <Networks />
            </Suspense>
          }
        />
        <Route
          path="/redes"
          element={
            <Suspense fallback={<Loading />}>
              <Networks />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>,
  // {/* </StrictMode>, */}
);
