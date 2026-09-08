import { useState } from "react";

import { buscarPokemon } from "../services/pokeApi";

import { agregarAlEquipo } from "../services/equipoApi";

function Pokedex({ onPokemonAgregado }) {

    const [busqueda, setBusqueda] = useState("");
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState("");

    const buscar = async () => {

        try {

            setError("");

            const datos = await buscarPokemon(busqueda);

            setPokemon(datos);

        } catch (error) {

            setPokemon(null);

            setError(error.message);

        }
    };

    const agregarPokemon = async () => {

        if (!pokemon) {
            return;
        }

        const nuevoPokemon = {

            nombre: pokemon.name,

            imagen: pokemon.sprites.front_default,

            nivel: 1,

            favorito: false

        };

        try {

            await agregarAlEquipo(nuevoPokemon);

            onPokemonAgregado();

            alert(
                `${pokemon.name} fue agregado al equipo`
            );

        } catch (error) {

            setError(error.message);

        }
    };

    return (

        <section>

            <h2>Buscar Pokémon</h2>

            <input
                type="text"
                value={busqueda}
                placeholder="Ejemplo: pikachu"
                onChange={(evento) =>
                    setBusqueda(evento.target.value)
                }
            />

            <button onClick={buscar}>
                Buscar
            </button>

            {error && (
                <p>{error}</p>
            )}

            {pokemon && (

                <article>

                    <h2>
                        {pokemon.name}
                    </h2>

                    <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                    />

                    <p>
                        Altura: {pokemon.height}
                    </p>

                    <p>
                        Peso: {pokemon.weight}
                    </p>

                    <button
                        onClick={agregarPokemon}
                    >
                        Agregar a mi equipo
                    </button>

                </article>

            )}

        </section>

    );
}

export default Pokedex;