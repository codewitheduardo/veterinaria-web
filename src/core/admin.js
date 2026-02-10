export const USUARIO_ADMIN = "admin@veterinaria";
export const CLAVE_ADMIN = "admin123";

export function validarCredencialesAdmin(email, clave) {
  return email === USUARIO_ADMIN && clave === CLAVE_ADMIN;
}

export function obtenerFechaHoyISO() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

export function obtenerClaveSesionAdmin() {
  return "vetagenda_admin";
}

export function estaAdminLogueadoDesdeValor(valor) {
  return valor === "yes";
}

export function valorSesionAdminLogueado() {
  return "yes";
}

export function aMinutos(hora) {
  // "HH:MM" -> minutos
  const [h, m] = String(hora || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function filtrarReservasPorFecha(reservas, fechaISO) {
  if (!fechaISO) return [...(reservas || [])];
  return (reservas || []).filter((r) => r.fecha === fechaISO);
}

export function ordenarReservasPorHora(reservas) {
  return [...(reservas || [])].sort((a, b) => aMinutos(a.hora) - aMinutos(b.hora));
}

export function obtenerReservasParaAdmin(reservas, fechaISO) {
  const filtradas = filtrarReservasPorFecha(reservas, fechaISO);
  return ordenarReservasPorHora(filtradas);
}
