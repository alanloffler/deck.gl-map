import { Link, Outlet } from "react-router";

export default function App() {
  return (
    <main className="flex flex-col space-y-6">
      <nav className="fixed top-0 left-0 flex h-16 w-full items-center space-x-6 border-b bg-white px-6 font-semibold">
        <Link to="/maplibre">MapLibre</Link>
        <Link to="/googlemap">Google Map</Link>
      </nav>
      <section className="mt-16">
        <Outlet />
      </section>
    </main>
  );
}
