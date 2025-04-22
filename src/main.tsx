// import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
// import { GoogleMap } from "./pages/GoogleMap.tsx";
import { Loading } from "./components/Loading.tsx";
const GoogleMap = lazy(() => import("./pages/GoogleMap.tsx"));
const TestMap = lazy(() => import("./pages/TestMap.tsx"));

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
              <GoogleMap />
            </Suspense>
          }
        />
        <Route
          path="/googlemap"
          element={
            <Suspense fallback={<Loading />}>
              <GoogleMap />
            </Suspense>
          }
        />
        <Route
          path="/test"
          element={
            <Suspense fallback={<Loading />}>
              <TestMap />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>,
  // {/* </StrictMode>, */}
);
