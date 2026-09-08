import { CONFIG } from "../config";

export const buscarPokemon = async (nombre) => {
    const respuesta = await fetch(
        `${CONFIG.POKE_API}/pokemon/${nombre.toLowerCase()}`
    );

    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado");
    }

    return await respuesta.json();
};

export const buscarPokemonPorId = async (id) => {
    const respuesta = await fetch(
        `${CONFIG.POKE_API}/pokemon/${id}`
    );

    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado");
    }

    return await respuesta.json();
};

export const obtenerListaPokemon = async (limit = 20, offset = 0) => {
    const respuesta = await fetch(
        `${CONFIG.POKE_API}/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener la lista");
    }

    return await respuesta.json();
};