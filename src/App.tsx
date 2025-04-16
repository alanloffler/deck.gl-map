import { Link, Outlet } from "react-router";
import logo from "./assets/coop-logo.png";

export default function App() {
  return (
    <main className="flex w-full flex-col space-y-6 p-6">
      <nav className="fixed top-0 left-0 z-40 flex h-16 w-full items-center border-b bg-white px-6 font-semibold md:space-x-32">
        <section className="flex items-center space-x-3">
          <img src={logo} width={55} height={55} />
          <div className="hidden text-sm sm:flex sm:flex-col">
            <span>Cooperativa de Servicios</span>
            <span>Públicos Wanda Ltda.</span>
          </div>
          <div className="xs:flex xs:flex-col hidden text-sm">
            <span>Cooperativa de Servicios</span>
            <span>Públicos Wanda Ltda.</span>
          </div>
        </section>
        <section className="flex flex-1 items-center justify-end space-x-8 md:justify-start">
          <Link to="/maplibre">MapLibre</Link>
          <Link to="/googlemap">Google Map</Link>
        </section>
      </nav>
      <section className="mt-16">
        <Outlet />
      </section>
    </main>
  );
}
