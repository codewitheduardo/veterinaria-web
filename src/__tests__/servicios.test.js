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

test("obtenerServicioPorId maneja ids inválidos", () => {
  expect(obtenerServicioPorId("abc")).toBeNull();
  expect(obtenerServicioPorId(null)).toBeNull();
  expect(obtenerServicioPorId(undefined)).toBeNull();
  expect(obtenerServicioPorId("")).toBeNull();
  expect(obtenerServicioPorId(0)).toBeNull();
  expect(obtenerServicioPorId(-1)).toBeNull();
});

test("formatearPrecio acepta string numérico", () => {
  expect(formatearPrecio("1200")).toBe("$1.200");
});

test("formatearPrecio con inválidos devuelve $NaN (comportamiento actual)", () => {
  expect(formatearPrecio("abc")).toBe("$NaN");
  expect(formatearPrecio(undefined)).toBe("$NaN");
});

test("claseCategoria maneja undefined y números", () => {
  expect(claseCategoria(undefined)).toBe("");
  expect(claseCategoria(123)).toBe("123");
});

test("obtenerDuracionServicioMinutos es case-insensitive y tolera null", () => {
  expect(obtenerDuracionServicioMinutos({ categoria: "aesthetic" })).toBe(60);
  expect(obtenerDuracionServicioMinutos()).toBe(30);
  expect(obtenerDuracionServicioMinutos(null)).toBe(30);
});
