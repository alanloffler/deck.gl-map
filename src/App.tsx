import { useState } from "react";
import "./App.css";
import { MyMap } from "./components/MyMap";

export default function App() {
  const [info, setInfo] = useState(undefined);

  return (
    <main className="flex flex-col space-y-4">
      <h1 className="font-semibold text-lg">Visualización de conexiones</h1>
      <section>Redes de agua potable</section>
      <div>
        <MyMap setInfo={setInfo} />
      </div>
      <section>{info && <p>{info}</p>}</section>
    </main>
  );
}
