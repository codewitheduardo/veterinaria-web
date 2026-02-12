// =======================
// NAVBAR (HU-15)
// =======================
export function obtenerMapaVisibilidadSecciones(idsSecciones, idObjetivo) {
  const mapa = {};
  idsSecciones.forEach((id) => {
    mapa[id] = id === idObjetivo;
  });
  return mapa;
}

export function obtenerMapaVisibilidadInicio(idsSecciones) {
  const mapa = {};
  idsSecciones.forEach((id) => {
    mapa[id] = id !== "admin";
  });
  return mapa;
}

export function obtenerVisibilidadNavegacion(esAdministrador) {
  return {
    mostrarEnlaces: !esAdministrador,
    mostrarToggle: !esAdministrador,
  };
}

export function resolverSeccionDesdeHash(hash) {
  if (!hash) return "inicio";

  if (hash.startsWith("#")) {
    const valor = hash.slice(1);
    return valor || "inicio";
  }
  return hash;
}
