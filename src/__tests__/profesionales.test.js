const {
  profesionales,
  obtenerProfesionalPorId,
  obtenerProfesionalesPorServicio,
} = require("../core/profesionales");

describe("profesionales.js (HU-03)", () => {
  test("profesionales tiene elementos", () => {
    expect(Array.isArray(profesionales)).toBe(true);
    expect(profesionales.length).toBeGreaterThan(0);
  });

  test("cada profesional tiene estructura mínima", () => {
    for (const p of profesionales) {
      expect(typeof p.id).toBe("number");
      expect(p.id).toBeGreaterThan(0);

      expect(typeof p.nombre).toBe("string");
      expect(p.nombre.length).toBeGreaterThan(0);

      expect(typeof p.rol).toBe("string");
      expect(typeof p.especialidad).toBe("string");
      expect(typeof p.descripcion).toBe("string");

      expect(Array.isArray(p.servicios)).toBe(true);
      expect(p.servicios.length).toBeGreaterThan(0);

      // opcional: que todos los ids de servicios sean números
      expect(p.servicios.every((s) => typeof s === "number")).toBe(true);
    }
  });

  test("obtenerProfesionalPorId devuelve profesional válido con id numérico y string", () => {
    expect(obtenerProfesionalPorId(1)?.id).toBe(1);
    expect(obtenerProfesionalPorId("2")?.id).toBe(2);
  });

  test("obtenerProfesionalPorId devuelve null si no existe", () => {
    expect(obtenerProfesionalPorId(999)).toBeNull();
    expect(obtenerProfesionalPorId(0)).toBeNull();
    expect(obtenerProfesionalPorId(-1)).toBeNull();
  });

  test("obtenerProfesionalPorId maneja ids inválidos", () => {
    expect(obtenerProfesionalPorId("abc")).toBeNull();
    expect(obtenerProfesionalPorId(null)).toBeNull();
    expect(obtenerProfesionalPorId(undefined)).toBeNull();
    expect(obtenerProfesionalPorId("")).toBeNull();
  });

  test("obtenerProfesionalesPorServicio devuelve profesionales que ofrecen ese servicio", () => {
    const resultado = obtenerProfesionalesPorServicio(1);
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((p) => p.servicios.includes(1))).toBe(true);
  });

  test("obtenerProfesionalesPorServicio acepta idServicio como string", () => {
    const resultado = obtenerProfesionalesPorServicio("2");
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((p) => p.servicios.includes(2))).toBe(true);
  });

  test("obtenerProfesionalesPorServicio devuelve [] si ningún profesional ofrece el servicio", () => {
    expect(obtenerProfesionalesPorServicio(999)).toEqual([]);
  });

  test("obtenerProfesionalesPorServicio con inválidos devuelve [] (comportamiento actual)", () => {
    expect(obtenerProfesionalesPorServicio("abc")).toEqual([]);
    expect(obtenerProfesionalesPorServicio(null)).toEqual([]);
    expect(obtenerProfesionalesPorServicio(undefined)).toEqual([]);
    expect(obtenerProfesionalesPorServicio("")).toEqual([]);
  });

  test("obtenerProfesionalesPorServicio no devuelve profesionales de otro servicio", () => {
    const resultado = obtenerProfesionalesPorServicio(6);
    // todos deben incluir 6
    expect(resultado.every((p) => p.servicios.includes(6))).toBe(true);

    // y por ejemplo, que alguno no tenga 1 (solo para asegurar que filtra)
    // (este check es opcional; si cambia el dataset podría fallar)
    expect(resultado.some((p) => !p.servicios.includes(1))).toBe(true);
  });
});