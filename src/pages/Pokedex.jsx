import { useState } from "react";
import { buscarPokemon } from "../services/pokeApi";
import { agregarAlEquipo, verificarExistencia } from "../services/equipoApi";

function Pokedex({ onPokemonAgregado }) {
    const [busqueda, setBusqueda] = useState("");
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const buscar = async () => {
        if (!busqueda.trim()) {
            setError("⚠️ Por favor, ingresa un nombre o número de Pokémon");
            setPokemon(null);
            return;
        }

        setIsLoading(true);
        setError("");
        setPokemon(null);

        try {
            const datos = await buscarPokemon(busqueda);
            setPokemon(datos);
        } catch (error) {
            setPokemon(null);
            setError(`❌ ${error.message}. Intenta con otro nombre o número.`);
        } finally {
            setIsLoading(false);
        }
    };

    const agregarPokemon = async () => {
        if (!pokemon) return;

        setIsAdding(true);
        setError("");

        // Verificar si el Pokémon ya está en el equipo
        const existe = await verificarExistencia(pokemon.name);
        if (existe) {
            setError(`⚠️ ${pokemon.name} ya está en tu equipo!`);
            setIsAdding(false);
            setTimeout(() => setError(""), 3000);
            return;
        }

        const nuevoPokemon = {
            nombre: pokemon.name,
            imagen: pokemon.sprites.front_default || pokemon.sprites.other["official-artwork"].front_default,
            nivel: 1,
            favorito: false,
        };

        try {
            await agregarAlEquipo(nuevoPokemon);
            onPokemonAgregado();
            setError(`✅ ${pokemon.name} fue agregado al equipo!`);
            setTimeout(() => setError(""), 3000);
        } catch (error) {
            setError(`❌ ${error.message}`);
        } finally {
            setIsAdding(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            buscar();
        }
    };

    return (
        <section className="pokedex-section">
            <h2 className="section-title">🔍 Buscar Pokémon</h2>

            <div className="search-container">
                <input
                    className="search-input"
                    type="text"
                    value={busqueda}
                    placeholder="Ejemplo: pikachu, charizard, 25..."
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                />
                <button 
                    className="search-button" 
                    onClick={buscar}
                    disabled={isLoading}
                >
                    {isLoading ? "⏳ Buscando..." : "🔍 Buscar"}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {isLoading && (
                <div className="pokemon-card loading-shimmer" style={{ height: "350px" }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", paddingTop: "150px" }}>
                        ⏳ Cargando Pokémon...
                    </p>
                </div>
            )}

            {pokemon && !isLoading && (
                <article className="pokemon-card">
                    <h2 className="pokemon-name">#{String(pokemon.id).padStart(3, '0')} {pokemon.name}</h2>
                    <img
                        className="pokemon-image"
                        src={pokemon.sprites.front_default || pokemon.sprites.other["official-artwork"].front_default}
                        alt={pokemon.name}
                    />
                    <div className="pokemon-stats">
                        <div className="pokemon-stat">
                            <div className="pokemon-stat-label">📏 Altura</div>
                            <div className="pokemon-stat-value">{pokemon.height / 10}m</div>
                        </div>
                        <div className="pokemon-stat">
                            <div className="pokemon-stat-label">⚖️ Peso</div>
                            <div className="pokemon-stat-value">{pokemon.weight / 10}kg</div>
                        </div>
                        <div className="pokemon-stat">
                            <div className="pokemon-stat-label">🎯 Tipo</div>
                            <div className="pokemon-stat-value" style={{ display: "flex", gap: "5px", justifyContent: "center", flexWrap: "wrap" }}>
                                {pokemon.types.map((t, i) => (
                                    <span key={i} style={{ 
                                        padding: "3px 12px",
                                        borderRadius: "20px",
                                        background: getTypeColor(t.type.name),
                                        color: "#fff",
                                        fontSize: "0.8rem",
                                        fontWeight: "600",
                                        textTransform: "capitalize"
                                    }}>
                                        {t.type.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="pokemon-stat">
                            <div className="pokemon-stat-label">⭐ Experiencia</div>
                            <div className="pokemon-stat-value">{pokemon.base_experience}</div>
                        </div>
                    </div>
                    <button
                        className="add-button"
                        onClick={agregarPokemon}
                        disabled={isAdding}
                    >
                        {isAdding ? "⏳ Agregando..." : "➕ Agregar a mi equipo"}
                    </button>
                </article>
            )}
        </section>
    );
}

function getTypeColor(type) {
    const colors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC"
    };
    return colors[type] || "#A8A878";
}

export default Pokedex;