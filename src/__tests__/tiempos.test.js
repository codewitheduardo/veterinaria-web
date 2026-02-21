const {
  convertirHoraAMinutos,
  formatearMinutosAHora,
  convertirAFechaLocal,
  esDomingo,
  esSabado,
  obtenerInicioAtencionMinutos,
  obtenerFinAtencionMinutos,
  generarHorariosDisponibles,
} = require("../core/tiempos");

describe("tiempos.js (coverage)", () => {
  test("convertirHoraAMinutos devuelve 0 si horaTexto es vacío o no tiene ':'", () => {
    expect(convertirHoraAMinutos("")).toBe(0);
    expect(convertirHoraAMinutos(null)).toBe(0);
    expect(convertirHoraAMinutos(undefined)).toBe(0);
    expect(convertirHoraAMinutos("0900")).toBe(0);
  });

  test("convertirAFechaLocal si recibe Date, devuelve mismo día a medianoche", () => {
    const d = new Date("2026-02-21T15:20:00");
    const local = convertirAFechaLocal(d);

    expect(local.getFullYear()).toBe(2026);
    expect(local.getMonth()).toBe(1);
    expect(local.getDate()).toBe(21);
    expect(local.getHours()).toBe(0);
    expect(local.getMinutes()).toBe(0);
  });

  test("convertirAFechaLocal con string YYYY-MM-DD devuelve esa fecha (rama no-Date)", () => {
    const d = convertirAFechaLocal("2026-02-21");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(21);
  });

  test("generarHorariosDisponibles: domingo devuelve []", () => {
    expect(esDomingo("2026-02-22")).toBe(true);
    expect(generarHorariosDisponibles("2026-02-22", 30)).toEqual([]);
  });

  test("generarHorariosDisponibles usa duracion default 30 si viene vacía", () => {
    const h = generarHorariosDisponibles("2026-02-21", "");
    expect(h).toEqual(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]);
  });

  test("generarHorariosDisponibles usa el parámetro default (30) cuando no se pasa duracionMinutos", () => {
    expect(generarHorariosDisponibles("2026-02-21")).toEqual([
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
    ]);
  });

  test("generarHorariosDisponibles: si duracion es mayor al rango, devuelve [] (no entra al for)", () => {
    expect(generarHorariosDisponibles("2026-02-21", 500)).toEqual([]);
  });

  test("formatearMinutosAHora formatea con ceros a la izquierda", () => {
    expect(formatearMinutosAHora(0)).toBe("00:00");
    expect(formatearMinutosAHora(9 * 60 + 5)).toBe("09:05");
  });

  test("obtenerInicioAtencionMinutos es 09:00", () => {
    expect(obtenerInicioAtencionMinutos()).toBe(9 * 60);
  });

  test("obtenerFinAtencionMinutos: sábado 12:00, día hábil 18:00", () => {
    expect(esSabado("2026-02-21")).toBe(true);
    expect(obtenerFinAtencionMinutos("2026-02-21")).toBe(12 * 60);

    expect(esSabado("2026-02-23")).toBe(false);
    expect(obtenerFinAtencionMinutos("2026-02-23")).toBe(18 * 60);
  });
});