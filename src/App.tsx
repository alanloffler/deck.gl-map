import { useState } from "react";
import "./App.css";
import { MyMap } from "./components/MyMap";

export default function App() {
  const [info, setInfo] = useState(undefined);

  return (
    <main className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Redes de agua potable</h1>
      <h2 className="font-medium text-lg">Visualización de conexiones</h2>
      <aside className="flex flex-row gap-4">
        <section className="w-3/4">
          <MyMap setInfo={setInfo} />
        </section>
        <section className="w-1/4">
          <h5 className="font-medium text-base">Datos de la selección</h5>
          <div className="text-base font-normal">
            {info ? (
              <p>{info}</p>
            ) : (
              <p>Realiza la selección de algún elemento del mapa</p>
            )}
          </div>
        </section>
      </aside>
    </main>
  );
}
