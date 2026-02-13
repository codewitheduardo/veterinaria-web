const USUARIO_ADMIN = "admin@veterinaria";
const CLAVE_ADMIN = "admin123";

function validarCredencialesAdmin(email, clave) {
  return email === USUARIO_ADMIN && clave === CLAVE_ADMIN;
}

function obtenerFechaHoyISO() {
  return new Date().toISOString().split("T")[0];
}

function obtenerClaveSesionAdmin() {
  return "vetagenda_admin";
}

function estaAdminLogueadoDesdeValor(valor) {
  return valor === "yes";
}

function valorSesionAdminLogueado() {
  return "yes";
}

function aMinutos(hora) {
  const [h, m] = String(hora || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function filtrarReservasPorFecha(reservas, fechaISO) {
  if (!fechaISO) return [...(reservas || [])];
  return (reservas || []).filter((r) => r.fecha === fechaISO);
}

function ordenarReservasPorHora(reservas) {
  return [...(reservas || [])].sort(
    (a, b) => aMinutos(a.hora) - aMinutos(b.hora)
  );
}

function obtenerReservasParaAdmin(reservas, fechaISO) {
  const filtradas = filtrarReservasPorFecha(reservas, fechaISO);
  return ordenarReservasPorHora(filtradas);
}

if (typeof module !== "undefined") {
  module.exports = {
    USUARIO_ADMIN,
    CLAVE_ADMIN,
    validarCredencialesAdmin,
    obtenerFechaHoyISO,
    obtenerClaveSesionAdmin,
    estaAdminLogueadoDesdeValor,
    valorSesionAdminLogueado,
    aMinutos,
    filtrarReservasPorFecha,
    ordenarReservasPorHora,
    obtenerReservasParaAdmin,
  };
}
