import {
  generarHorariosDisponibles,
  convertirHoraAMinutos,
  obtenerFinAtencionMinutos,
} from "./tiempos.js";

function seSolapan(aInicio, aFin, bInicio, bFin) {
  return aInicio < bFin && aFin > bInicio;
}

export function obtenerReservasOcupadas(idProfesional, fecha, obtenerReservas) {
  return obtenerReservas().filter(
    (reserva) =>
      Number(reserva.profesionalId) === Number(idProfesional) &&
      reserva.fecha === fecha &&
      reserva.estado !== "cancelado",
  );
}

export function obtenerHorariosDisponiblesPorProfesional(
  idProfesional,
  fecha,
  obtenerReservas,
  duracionMinutos = 30,
) {
  const todos = generarHorariosDisponibles(fecha, duracionMinutos);
  const reservasOcupadas = obtenerReservasOcupadas(
    idProfesional,
    fecha,
    obtenerReservas,
  );

  const finAtencion = obtenerFinAtencionMinutos(fecha);

  return todos.filter((horaInicio) => {
    const inicioNuevo = convertirHoraAMinutos(horaInicio);
    const finNuevo = inicioNuevo + Number(duracionMinutos || 30);

    if (finNuevo > finAtencion) return false;

    return !reservasOcupadas.some((r) => {
      const inicioExistente = convertirHoraAMinutos(r.hora);
      const durExistente = Number(r.duracionMinutos || 30);
      const finExistente = inicioExistente + durExistente;

      return seSolapan(inicioNuevo, finNuevo, inicioExistente, finExistente);
    });
  });
}

export function estaHorarioOcupado(
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

  const inicioNuevo = convertirHoraAMinutos(horaInicio);
  const finNuevo = inicioNuevo + Number(duracionMinutos || 30);

  return reservasOcupadas.some((r) => {
    const inicioExistente = convertirHoraAMinutos(r.hora);
    const durExistente = Number(r.duracionMinutos || 30);
    const finExistente = inicioExistente + durExistente;

    return seSolapan(inicioNuevo, finNuevo, inicioExistente, finExistente);
  });
}

export function marcarReservasFinalizadas(reservas, ahora = new Date()) {
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
