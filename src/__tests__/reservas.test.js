const {
  obtenerReservasOcupadas,
  obtenerHorariosDisponiblesPorProfesional,
  estaHorarioOcupado,
  marcarReservasFinalizadas,
} = require("../core/reservas");

describe("reservas.js (tests limpios + coverage)", () => {
  // ======================================================
  // obtenerReservasOcupadas
  // ======================================================
  test("filtra por profesionalId, fecha y excluye canceladas", () => {
    const obtenerReservas = () => [
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", estado: "pendiente" },
      { profesionalId: "1", fecha: "2026-02-21", hora: "11:00", estado: "confirmado" },
      { profesionalId: 1, fecha: "2026-02-21", hora: "12:00", estado: "cancelado" }, // excluida
      { profesionalId: 2, fecha: "2026-02-21", hora: "10:00", estado: "pendiente" }, // otro profesional
      { profesionalId: 1, fecha: "2026-02-20", hora: "10:00", estado: "pendiente" }, // otra fecha
    ];

    const r = obtenerReservasOcupadas(1, "2026-02-21", obtenerReservas);
    expect(r.map((x) => x.hora)).toEqual(["10:00", "11:00"]);
  });

  test("devuelve [] si no hay coincidencias", () => {
    const obtenerReservas = () => [
      { profesionalId: 2, fecha: "2026-02-21", hora: "10:00", estado: "pendiente" },
    ];

    expect(obtenerReservasOcupadas(1, "2026-02-21", obtenerReservas)).toEqual([]);
  });

  // ======================================================
  // estaHorarioOcupado
  // ======================================================
  test("true si se solapa (10:15-10:45 con 10:00-10:30)", () => {
    const obtenerReservas = () => [
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
    ];

    expect(estaHorarioOcupado(1, "2026-02-21", "10:15", obtenerReservas, 30)).toBe(true);
  });

  test("false si solo toca borde (10:30-11:00 con 10:00-10:30)", () => {
    const obtenerReservas = () => [
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
    ];

    expect(estaHorarioOcupado(1, "2026-02-21", "10:30", obtenerReservas, 30)).toBe(false);
  });

  test("ignora reservas canceladas", () => {
    const obtenerReservas = () => [
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", duracionMinutos: 60, estado: "cancelado" },
    ];

    expect(estaHorarioOcupado(1, "2026-02-21", "10:00", obtenerReservas, 30)).toBe(false);
  });

  test("usa duracionMinutos=30 por default cuando no se pasa (default param)", () => {
    const obtenerReservas = () => [
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
    ];

    // sin 5to parámetro => default 30
    expect(estaHorarioOcupado(1, "2026-02-21", "10:15", obtenerReservas)).toBe(true);
  });

  test("si reserva existente no tiene duracionMinutos, usa default 30 (r.duracionMinutos || 30)", () => {
    const obtenerReservas = () => [
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", estado: "pendiente" }, // sin duracionMinutos
    ];

    expect(estaHorarioOcupado(1, "2026-02-21", "10:15", obtenerReservas, 30)).toBe(true);
  });

  test("false cuando hay reservas pero de otro profesional o fecha", () => {
    const obtenerReservas = () => [
      { profesionalId: 2, fecha: "2026-02-21", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
      { profesionalId: 1, fecha: "2026-02-20", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
    ];

    expect(estaHorarioOcupado(1, "2026-02-21", "10:00", obtenerReservas, 30)).toBe(false);
  });

  // ======================================================
  // obtenerHorariosDisponiblesPorProfesional
  // ======================================================
  test("domingo devuelve []", () => {
    const obtenerReservas = () => [];
    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-22", // domingo
      obtenerReservas,
      30,
      new Date("2026-02-21T08:00:00")
    );
    expect(disponibles).toEqual([]);
  });

  test("usa el default ahora=new Date() cuando NO se pasa (default param)", () => {
    const obtenerReservas = () => [];

    // domingo => no depende de la hora real, pero cubre default param
    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-22",
      obtenerReservas,
      30
      // no pasamos 'ahora'
    );

    expect(disponibles).toEqual([]);
  });

  test("sábado: filtra ocupados y respeta solapes", () => {
    const obtenerReservas = () => [
      // ocupa 09:00-09:30
      { profesionalId: 1, fecha: "2026-02-21", hora: "09:00", duracionMinutos: 30, estado: "pendiente" },
      // ocupa 10:00-11:00
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", duracionMinutos: 60, estado: "pendiente" },
      // cancelada no bloquea
      { profesionalId: 1, fecha: "2026-02-21", hora: "11:00", duracionMinutos: 30, estado: "cancelado" },
    ];

    const ahora = new Date("2026-02-20T08:00:00"); // no es hoy
    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-21", // sábado (fin 12:00)
      obtenerReservas,
      30,
      ahora
    );

    // sábado genera: 09:00,09:30,10:00,10:30,11:00,11:30
    // ocupadas: 09:00 (bloquea 09:00), 10:00-11:00 (bloquea 10:00 y 10:30)
    // 11:00 NO se solapa (borde), 11:30 libre
    expect(disponibles).toEqual(["09:30", "11:00", "11:30"]);
  });

  test("evalúa durExistente default 30 dentro del .some() y detecta solape", () => {
    const obtenerReservas = () => [
      // existente 10:00-10:30 (duracionMinutos undefined => default 30)
      { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", estado: "pendiente" },
    ];

    const ahora = new Date("2026-02-20T08:00:00"); // no es hoy
    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-21",
      obtenerReservas,
      30,
      ahora
    );

    expect(disponibles).not.toContain("10:00");
  });

  test("si es HOY, descarta horarios <= ahora", () => {
    const obtenerReservas = () => [];
    const ahora = new Date("2026-02-21T10:00:00"); // mismo día

    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-21",
      obtenerReservas,
      30,
      ahora
    );

    expect(disponibles).toEqual(["10:30", "11:00", "11:30"]);
  });

  test("esHoy true pero NO filtra cuando inicioNuevo > minutosAhora (cubre rama contraria)", () => {
    const obtenerReservas = () => [];
    const ahora = new Date("2026-02-21T09:10:00"); // hoy 09:10

    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-21",
      obtenerReservas,
      30,
      ahora
    );

    expect(disponibles[0]).toBe("09:30");
  });

  test("duracionMinutos=0 usa 30 por (duracionMinutos || 30)", () => {
    const obtenerReservas = () => [];
    const ahora = new Date("2026-02-20T08:00:00"); // no es hoy

    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-21",
      obtenerReservas,
      0,
      ahora
    );

    // equivale a dur 30
    expect(disponibles).toEqual(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]);
  });

  test("usa el default duracionMinutos=30 cuando NO se pasa (default param)", () => {
    const obtenerReservas = () => [];
    const ahora = new Date("2026-02-20T08:00:00"); // no es hoy

    const disponibles = obtenerHorariosDisponiblesPorProfesional(
      1,
      "2026-02-21",
      obtenerReservas,
      undefined,
      ahora
    );

    expect(disponibles).toEqual(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]);
  });

  // ======================================================
  // marcarReservasFinalizadas
  // ======================================================
  test("marca como finalizado si fin < ahora y estaba pendiente", () => {
    const reservas = [
      { fecha: "2026-02-21", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
    ];

    const { reservasActualizadas, cambio } = marcarReservasFinalizadas(
      reservas,
      new Date("2026-02-21T10:31:00")
    );

    expect(cambio).toBe(true);
    expect(reservasActualizadas[0].estado).toBe("finalizado");
  });

  test("NO marca si fin == ahora (fin < ahora)", () => {
    const reservas = [
      { fecha: "2026-02-21", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
    ];

    const { reservasActualizadas, cambio } = marcarReservasFinalizadas(
      reservas,
      new Date("2026-02-21T10:30:00")
    );

    expect(cambio).toBe(false);
    expect(reservasActualizadas[0].estado).toBe("pendiente");
  });

  test("ignora reservas no pendientes (return temprano) y no muta input", () => {
    const reservas = [
      { fecha: "2026-02-21", hora: "09:00", duracionMinutos: 30, estado: "confirmado" },
      { fecha: "2026-02-21", hora: "08:00", duracionMinutos: 30, estado: "cancelado" },
    ];
    const snapshot = JSON.parse(JSON.stringify(reservas));

    const { reservasActualizadas, cambio } = marcarReservasFinalizadas(
      reservas,
      new Date("2026-02-21T12:00:00")
    );

    expect(cambio).toBe(false);
    expect(reservasActualizadas.map((r) => r.estado)).toEqual(["confirmado", "cancelado"]);
    expect(reservas).toEqual(snapshot);
  });

  test("maneja null/undefined", () => {
    const ahora = new Date("2026-02-21T12:00:00");
    expect(marcarReservasFinalizadas(null, ahora)).toEqual({ reservasActualizadas: [], cambio: false });
    expect(marcarReservasFinalizadas(undefined, ahora)).toEqual({ reservasActualizadas: [], cambio: false });
  });

  test("usa default 30 si duracionMinutos viene undefined", () => {
    const reservas = [
      { fecha: "2026-02-21", hora: "10:00", estado: "pendiente" }, // sin duracionMinutos
    ];

    const { reservasActualizadas, cambio } = marcarReservasFinalizadas(
      reservas,
      new Date("2026-02-21T10:31:00")
    );

    expect(cambio).toBe(true);
    expect(reservasActualizadas[0].estado).toBe("finalizado");
  });

  test("usa ahora=new Date() por default cuando no se pasa (default param estable)", () => {
    const reservas = [
      { fecha: "2000-01-01", hora: "00:00", duracionMinutos: 30, estado: "pendiente" },
    ];

    const { reservasActualizadas, cambio } = marcarReservasFinalizadas(reservas); // sin 'ahora'
    expect(cambio).toBe(true);
    expect(reservasActualizadas[0].estado).toBe("finalizado");
  });
});

test("estaHorarioOcupado: si duracionMinutos es 0, usa 30 por (duracionMinutos || 30)", () => {
  const obtenerReservas = () => [
    { profesionalId: 1, fecha: "2026-02-21", hora: "10:00", duracionMinutos: 30, estado: "pendiente" },
  ];

  // duracionMinutos = 0 => cae al 30
  expect(estaHorarioOcupado(1, "2026-02-21", "10:15", obtenerReservas, 0)).toBe(true);
});