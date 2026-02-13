// =======================
// NAVBAR (HU-15)
// =======================
function obtenerMapaVisibilidadSecciones(idsSecciones, idObjetivo) {
  const mapa = {};
  idsSecciones.forEach((id) => {
    mapa[id] = id === idObjetivo;
  });
  return mapa;
}

function obtenerMapaVisibilidadInicio(idsSecciones) {
  const mapa = {};
  idsSecciones.forEach((id) => {
    mapa[id] = id !== "admin";
  });
  return mapa;
}

function obtenerVisibilidadNavegacion(esAdministrador) {
  return {
    mostrarEnlaces: !esAdministrador,
    mostrarToggle: !esAdministrador,
  };
}

function resolverSeccionDesdeHash(hash) {
  if (!hash) return "inicio";

  if (hash.startsWith("#")) {
    const valor = hash.slice(1);
    return valor || "inicio";
  }
  return hash;
}

if (typeof module !== "undefined") {
  module.exports = {
    obtenerMapaVisibilidadSecciones,
    obtenerMapaVisibilidadInicio,
    obtenerVisibilidadNavegacion,
    resolverSeccionDesdeHash,
  };
}

