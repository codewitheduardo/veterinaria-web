const {
  servicios,
  obtenerServicioPorId,
  formatearPrecio,
  claseCategoria,
  obtenerDuracionServicioMinutos,
} = require("../core/servicios");

describe("servicios.js", () => {
  test("servicios tiene elementos", () => {
    expect(servicios.length).toBeGreaterThan(0);
  });

  test("obtenerServicioPorId devuelve servicio válido", () => {
    expect(obtenerServicioPorId(1)?.id).toBe(1);
    expect(obtenerServicioPorId("2")?.id).toBe(2);
  });

  test("obtenerServicioPorId devuelve null si no existe", () => {
    expect(obtenerServicioPorId(999)).toBeNull();
  });

  test("formatearPrecio formatea bien", () => {
    expect(formatearPrecio(1200)).toBe("$1.200");
    expect(formatearPrecio(500)).toBe("$500");
  });

  test("claseCategoria a minúscula", () => {
    expect(claseCategoria("MEDICAL")).toBe("medical");
    expect(claseCategoria(null)).toBe("");
  });

  test("duración AESTHETIC 60, resto 30", () => {
    expect(obtenerDuracionServicioMinutos({ categoria: "AESTHETIC" })).toBe(60);
    expect(obtenerDuracionServicioMinutos({ categoria: "MEDICAL" })).toBe(30);
  });
});
