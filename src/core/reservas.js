// =======================
// DEPENDENCIAS (browser + Jest)
// =======================
let convertirHoraAMinutosRef;
let convertirAFechaLocalRef;
let obtenerFinAtencionMinutosRef;
let generarHorariosDisponiblesRef;

/* istanbul ignore next */
if (typeof require !== "undefined") {
  // Jest / Node (CommonJS)
  const tiempos = require("./tiempos");
  convertirHoraAMinutosRef = tiempos.convertirHoraAMinutos;
  convertirAFechaLocalRef = tiempos.convertirAFechaLocal;
  obtenerFinAtencionMinutosRef = tiempos.obtenerFinAtencionMinutos;
  generarHorariosDisponiblesRef = tiempos.generarHorariosDisponibles;
} else {
  // Navegador (tiempos.js ya fue cargado antes por <script>)
  convertirHoraAMinutosRef = convertirHoraAMinutos;
  convertirAFechaLocalRef = convertirAFechaLocal;
  obtenerFinAtencionMinutosRef = obtenerFinAtencionMinutos;
  generarHorariosDisponiblesRef = generarHorariosDisponibles;
}

function seSolapan(aInicio, aFin, bInicio, bFin) {
  return aInicio < bFin && aFin > bInicio;
}

function obtenerReservasOcupadas(idProfesional, fecha, obtenerReservas) {
  return obtenerReservas().filter(
    (reserva) =>
      Number(reserva.profesionalId) === Number(idProfesional) &&
      reserva.fecha === fecha &&
      reserva.estado !== "cancelado",
  );
}

function obtenerHorariosDisponiblesPorProfesional(
  idProfesional,
  fecha,
  obtenerReservas,
  duracionMinutos = 30,
  ahora = new Date(),
) {
  const todos = generarHorariosDisponiblesRef(fecha, duracionMinutos);

  const reservasOcupadas = obtenerReservasOcupadas(
    idProfesional,
    fecha,
    obtenerReservas,
  );

  const finAtencion = obtenerFinAtencionMinutosRef(fecha);

  const esHoy =
    convertirAFechaLocalRef(fecha).getTime() ===
    convertirAFechaLocalRef(ahora).getTime();

  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  return todos.filter((horaInicio) => {
    const inicioNuevo = convertirHoraAMinutosRef(horaInicio);
    const finNuevo = inicioNuevo + Number(duracionMinutos || 30);

    /* istanbul ignore next */
    if (finNuevo > finAtencion) return false;

    if (esHoy && inicioNuevo <= minutosAhora) return false;

    return !reservasOcupadas.some((r) => {
      const inicioExistente = convertirHoraAMinutosRef(r.hora);
      const durExistente = Number(r.duracionMinutos || 30);
      const finExistente = inicioExistente + durExistente;

      return seSolapan(inicioNuevo, finNuevo, inicioExistente, finExistente);
    });
  });
}

function estaHorarioOcupado(
  idProfesional,
  fecha,
  horaInicio,
  obtenerReservas,
  duracionMinutos = 30,
) {
  const reservasOcupadas = obtenerReservasOcupadas(
    idProfesional,
    fecha,
    obtenerReservas,
  );

  const inicioNuevo = convertirHoraAMinutosRef(horaInicio);
  const finNuevo = inicioNuevo + Number(duracionMinutos || 30);

  return reservasOcupadas.some((r) => {
    const inicioExistente = convertirHoraAMinutosRef(r.hora);
    const durExistente = Number(r.duracionMinutos || 30);
    const finExistente = inicioExistente + durExistente;

    return seSolapan(inicioNuevo, finNuevo, inicioExistente, finExistente);
  });
}

function marcarReservasFinalizadas(reservas, ahora = new Date()) {
  let cambio = false;

  const copia = (reservas || []).map((r) => ({ ...r }));

  copia.forEach((r) => {
    if (r.estado !== "pendiente") return;

    const duracion = Number(r.duracionMinutos || 30);
    const inicio = new Date(`${r.fecha}T${r.hora}:00`);
    const fin = new Date(inicio.getTime() + duracion * 60 * 1000);

    if (fin < ahora) {
      r.estado = "finalizado";
      cambio = true;
    }
  });

  return { reservasActualizadas: copia, cambio };
}

/* istanbul ignore next */
if (typeof module !== "undefined") {
  module.exports = {
    obtenerReservasOcupadas,
    obtenerHorariosDisponiblesPorProfesional,
    estaHorarioOcupado,
    marcarReservasFinalizadas,
  };
}