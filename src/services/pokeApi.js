const API_URL = "https://pokeapi.co/api/v2";

export const buscarPokemon = async (nombre) => {

    const respuesta = await fetch(
        `${API_URL}/pokemon/${nombre.toLowerCase()}`
    );

    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado");
    }

    return await respuesta.json();
};