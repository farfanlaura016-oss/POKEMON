const API = "http://localhost:3001/equipo";

export const obtenerEquipo = async () => {
    const respuesta = await fetch(API);

    if (!respuesta.ok) {
        throw new Error("No fue posible cargar el equipo");
    }

    return await respuesta.json();
};

export const agregarAlEquipo = async (pokemon) => {
    const respuesta = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pokemon)
    });

    if (!respuesta.ok) {
        throw new Error("No fue posible agregar el Pokémon");
    }

    return await respuesta.json();
};

export const actualizarPokemon = async (id, cambios) => {
    const respuesta = await fetch(
        `${API}/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cambios)
        }
    );

    if (!respuesta.ok) {
        throw new Error("No se pudo actualizar");
    }

    return await respuesta.json();
};
export const eliminarPokemon = async (id) => {
    const respuesta = await fetch(
        `${API}/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!respuesta.ok) {
        throw new Error(
            "No se pudo eliminar el Pokémon"
        );
    }
};