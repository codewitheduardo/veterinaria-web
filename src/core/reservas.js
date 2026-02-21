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
  const todos = generarHorariosDisponibles(fecha, duracionMinutos);
  const reservasOcupadas = obtenerReservasOcupadas(
    idProfesional,
    fecha,
    obtenerReservas,
  );

  const finAtencion = obtenerFinAtencionMinutos(fecha);

  const esHoy =
    convertirAFechaLocal(fecha).getTime() === convertirAFechaLocal(ahora).getTime();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  return todos.filter((horaInicio) => {
    const inicioNuevo = convertirHoraAMinutos(horaInicio);
    const finNuevo = inicioNuevo + Number(duracionMinutos || 30);

    if (finNuevo > finAtencion) return false;

    if (esHoy && inicioNuevo <= minutosAhora) return false;

    return !reservasOcupadas.some((r) => {
      const inicioExistente = convertirHoraAMinutos(r.hora);
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

  const inicioNuevo = convertirHoraAMinutos(horaInicio);
  const finNuevo = inicioNuevo + Number(duracionMinutos || 30);

  return reservasOcupadas.some((r) => {
    const inicioExistente = convertirHoraAMinutos(r.hora);
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

if (typeof module !== "undefined") {
  module.exports = {
    obtenerReservasOcupadas,
    obtenerHorariosDisponiblesPorProfesional,
    estaHorarioOcupado,
    marcarReservasFinalizadas,
  };
}
