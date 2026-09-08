import { useState } from "react";
import Pokedex from "./pages/Pokedex";
import MiEquipo from "./pages/MiEquipo";
import "./index.css";

function App() {
    const [actualizarEquipo, setActualizarEquipo] = useState(0);

    return (
        <div className="app">
            <h1 className="app-title">⚡ Pokédex React</h1>
            
            <Pokedex
                onPokemonAgregado={() =>
                    setActualizarEquipo((valor) => valor + 1)
                }
            />

            <hr className="divider" />

            <MiEquipo actualizarEquipo={actualizarEquipo} />
        </div>
    );
}

export default App;