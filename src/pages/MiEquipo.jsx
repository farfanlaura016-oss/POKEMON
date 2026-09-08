import { useEffect, useState } from "react";
import {
    obtenerEquipo,
    actualizarPokemon,
    eliminarPokemon,
} from "../services/equipoApi";

function MiEquipo({ actualizarEquipo }) {
    const [equipo, setEquipo] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [accionando, setAccionando] = useState(null);

    const cargarEquipo = async () => {
        setIsLoading(true);
        try {
            const datos = await obtenerEquipo();
            setEquipo(datos);
            setError("");
        } catch (error) {
            setError(`❌ ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarEquipo();
    }, [actualizarEquipo]);

    const subirNivel = async (pokemon) => {
        setAccionando(pokemon.id);
        try {
            await actualizarPokemon(pokemon.id, { nivel: pokemon.nivel + 1 });
            await cargarEquipo();
        } catch (error) {
            setError(`❌ ${error.message}`);
        } finally {
            setAccionando(null);
        }
    };

    const cambiarFavorito = async (pokemon) => {
        setAccionando(pokemon.id);
        try {
            await actualizarPokemon(pokemon.id, { favorito: !pokemon.favorito });
            await cargarEquipo();
        } catch (error) {
            setError(`❌ ${error.message}`);
        } finally {
            setAccionando(null);
        }
    };

    const liberarPokemon = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que quieres liberar a ${nombre}?`)) {
            setAccionando(id);
            try {
                await eliminarPokemon(id);
                await cargarEquipo();
            } catch (error) {
                setError(`❌ ${error.message}`);
            } finally {
                setAccionando(null);
            }
        }
    };

    if (isLoading) {
        return (
            <section className="team-section">
                <h2 className="team-title">⚡ Mi Equipo Pokémon</h2>
                <div className="team-grid">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="team-card loading-shimmer" style={{ height: "280px" }} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="team-section">
            <h2 className="team-title">⚡ Mi Equipo Pokémon <span style={{ fontSize: "1rem", fontWeight: "normal", opacity: 0.7 }}>({equipo.length})</span></h2>

            {error && <div className="error-message">{error}</div>}

            {equipo.length === 0 ? (
                <div className="empty-team">
                    <p style={{ fontSize: "3rem", marginBottom: "10px" }}>🏃</p>
                    <p>Todavía no tienes Pokémon en tu equipo.</p>
                    <p style={{ fontSize: "0.9rem", marginTop: "10px", opacity: 0.7 }}>
                        ¡Busca uno arriba y agrégalo!
                    </p>
                </div>
            ) : (
                <div className="team-grid">
                    {equipo.map((pokemon) => (
                        <article
                            key={pokemon.id}
                            className={`team-card ${pokemon.favorito ? "favorite" : ""}`}
                        >
                            <img
                                className="team-pokemon-image"
                                src={pokemon.imagen}
                                alt={pokemon.nombre}
                                onError={(e) => {
                                    e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
                                }}
                            />
                            <h3 className="team-pokemon-name">{pokemon.nombre}</h3>
                            <p className="team-pokemon-level">
                                Nivel: <span>{pokemon.nivel}</span>
                            </p>
                            <div className="team-actions">
                                <button
                                    className="team-btn btn-level"
                                    onClick={() => subirNivel(pokemon)}
                                    disabled={accionando === pokemon.id}
                                >
                                    {accionando === pokemon.id ? "⏳" : "⬆"} Subir nivel
                                </button>
                                <button
                                    className={`team-btn ${pokemon.favorito ? "btn-unfavorite" : "btn-favorite"}`}
                                    onClick={() => cambiarFavorito(pokemon)}
                                    disabled={accionando === pokemon.id}
                                >
                                    {pokemon.favorito ? "⭐" : "☆"} {pokemon.favorito ? "Quitar favorito" : "Marcar favorito"}
                                </button>
                                <button
                                    className="team-btn btn-delete"
                                    onClick={() => liberarPokemon(pokemon.id, pokemon.nombre)}
                                    disabled={accionando === pokemon.id}
                                >
                                    🗑 Liberar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MiEquipo;