import { Link, Outlet } from "react-router";
import logo from "./assets/coop-logo.png";

export default function App() {
  return (
    <main className="flex w-full flex-col space-y-6 p-6">
      <nav className="fixed top-0 left-0 z-40 flex h-16 w-full items-center border-b bg-white px-6 font-semibold md:space-x-32">
        <section className="flex items-center space-x-3">
          <img src={logo} width={45} height={45} />
          <div className="hidden text-sm md:flex md:flex-col">
            <span>Cooperativa de Servicios</span>
            <span>Públicos Wanda Ltda.</span>
          </div>
          <div className="flex flex-col text-sm md:hidden">
            <span>Coop. de Serv.</span>
            <span>Púb. Wanda Ltda.</span>
          </div>
        </section>
        <section className="flex flex-1 items-center justify-end space-x-3 md:justify-start md:space-x-8">
          <Link to="/maplibre">MapLibre</Link>
          <Link to="/googlemap">Google Map</Link>
          <Link to="/geojson">GeoJson</Link>
        </section>
      </nav>
      <section className="mt-16">
        <Outlet />
      </section>
    </main>
  );
}
