import "./App.css";
import { MyMap } from "./components/MyMap";

export default function App() {
  return (
    <main className="flex flex-col space-y-4">
      <h1 className="font-semibold text-lg">Visualización de conexiones</h1>
      <section>Redes de agua potable</section>
      <div>
        <MyMap />
      </div>
    </main>
  );
}
