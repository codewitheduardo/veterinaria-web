// "HH:mm" → minutos totales
function convertirHoraAMinutos(horaTexto) {
  if (!horaTexto || !horaTexto.includes(":")) return 0;
  const [horas, minutos] = horaTexto.split(":").map(Number);
  return horas * 60 + minutos;
}

// minutos → "HH:mm"
function formatearMinutosAHora(minutosTotales) {
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

// "YYYY-MM-DD" → Date local (sin UTC)
function convertirAFechaLocal(fechaIso) {
  if (fechaIso instanceof Date) {
    return new Date(
      fechaIso.getFullYear(),
      fechaIso.getMonth(),
      fechaIso.getDate(),
    );
  }
  const [anio, mes, dia] = String(fechaIso).split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

function esDomingo(fecha) {
  return convertirAFechaLocal(fecha).getDay() === 0;
}

function esSabado(fecha) {
  return convertirAFechaLocal(fecha).getDay() === 6;
}

function obtenerInicioAtencionMinutos() {
  return convertirHoraAMinutos("09:00");
}

function obtenerFinAtencionMinutos(fecha) {
  return esSabado(fecha)
    ? convertirHoraAMinutos("12:00")
    : convertirHoraAMinutos("18:00");
}

function generarHorariosDisponibles(fecha, duracionMinutos = 30) {
  const horarios = [];
  if (esDomingo(fecha)) return horarios;

  const inicio = obtenerInicioAtencionMinutos();
  const fin = obtenerFinAtencionMinutos(fecha);

  const dur = Number(duracionMinutos || 30);

  for (let actual = inicio; actual + dur <= fin; actual += dur) {
    horarios.push(formatearMinutosAHora(actual));
  }

  return horarios;
}

 /* istanbul ignore next */
if (typeof module !== "undefined") {
  module.exports = {
    convertirHoraAMinutos,
    formatearMinutosAHora,
    convertirAFechaLocal,
    esDomingo,
    esSabado,
    obtenerInicioAtencionMinutos,
    obtenerFinAtencionMinutos,
    generarHorariosDisponibles,
  };
}
