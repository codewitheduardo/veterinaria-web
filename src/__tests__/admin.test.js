const {
  USUARIO_ADMIN,
  CLAVE_ADMIN,
  validarCredencialesAdmin,
  obtenerFechaHoyISO,
  obtenerClaveSesionAdmin,
  estaAdminLogueadoDesdeValor,
  valorSesionAdminLogueado,
  aMinutos,
  filtrarReservasPorFecha,
  ordenarReservasPorHora,
  obtenerReservasParaAdmin,
} = require("../core/admin");

describe("admin.js", () => {
  test("credenciales admin definidas", () => {
    expect(USUARIO_ADMIN).toBeTruthy();
    expect(CLAVE_ADMIN).toBeTruthy();
  });

  test("validarCredencialesAdmin acepta credenciales correctas", () => {
    expect(validarCredencialesAdmin(USUARIO_ADMIN, CLAVE_ADMIN)).toBe(true);
  });

  test("validarCredencialesAdmin rechaza credenciales incorrectas", () => {
    expect(validarCredencialesAdmin("otro@veterinaria", CLAVE_ADMIN)).toBe(false);
    expect(validarCredencialesAdmin(USUARIO_ADMIN, "otraClave")).toBe(false);
    expect(validarCredencialesAdmin("otro@veterinaria", "otraClave")).toBe(false);
  });

  test("clave de sesión admin es la esperada", () => {
    expect(obtenerClaveSesionAdmin()).toBe("vetagenda_admin");
  });

  test("valor de sesión admin logueado es el esperado", () => {
    expect(valorSesionAdminLogueado()).toBe("yes");
  });

  test("estaAdminLogueadoDesdeValor valida correctamente el estado", () => {
    expect(estaAdminLogueadoDesdeValor("yes")).toBe(true);
    expect(estaAdminLogueadoDesdeValor("no")).toBe(false);
    expect(estaAdminLogueadoDesdeValor(null)).toBe(false);
    expect(estaAdminLogueadoDesdeValor("")).toBe(false);
  });

  
  // Cobertura de funciones faltantes para el HU-09
  

  test("obtenerFechaHoyISO devuelve formato YYYY-MM-DD", () => {
    const hoy = obtenerFechaHoyISO();

    expect(typeof hoy).toBe("string");
    expect(hoy).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const [anio, mes, dia] = hoy.split("-").map(Number);
    expect(anio).toBeGreaterThan(2000);
    expect(mes).toBeGreaterThanOrEqual(1);
    expect(mes).toBeLessThanOrEqual(12);
    expect(dia).toBeGreaterThanOrEqual(1);
    expect(dia).toBeLessThanOrEqual(31);
  });

  test("aMinutos convierte HH:mm a minutos totales", () => {
    expect(aMinutos("00:00")).toBe(0);
    expect(aMinutos("01:00")).toBe(60);
    expect(aMinutos("09:30")).toBe(570);
    expect(aMinutos("18:00")).toBe(1080);
  });

  test("aMinutos maneja valores vacíos o null como 0", () => {
    expect(aMinutos(null)).toBe(0);
    expect(aMinutos(undefined)).toBe(0);
    expect(aMinutos("")).toBe(0);
  });

  test("filtrarReservasPorFecha devuelve todas si no hay fecha", () => {
    const reservas = [
      { fecha: "2026-02-20", hora: "10:00" },
      { fecha: "2026-02-21", hora: "09:00" },
    ];

    const resultado = filtrarReservasPorFecha(reservas, "");
    expect(resultado.length).toBe(2);
  });

  test("filtrarReservasPorFecha filtra solo las de la fecha indicada", () => {
    const reservas = [
      { fecha: "2026-02-20", hora: "10:00" },
      { fecha: "2026-02-21", hora: "09:00" },
      { fecha: "2026-02-20", hora: "12:00" },
    ];

    const resultado = filtrarReservasPorFecha(reservas, "2026-02-20");
    expect(resultado.length).toBe(2);
    expect(resultado.every((r) => r.fecha === "2026-02-20")).toBe(true);
  });

  test("ordenarReservasPorHora ordena por hora ascendente", () => {
    const reservas = [
      { hora: "12:00" },
      { hora: "09:30" },
      { hora: "10:00" },
    ];

    const ordenadas = ordenarReservasPorHora(reservas);
    expect(ordenadas.map((r) => r.hora)).toEqual(["09:30", "10:00", "12:00"]);
  });

  test("obtenerReservasParaAdmin filtra por fecha y ordena por hora", () => {
    const reservas = [
      { fecha: "2026-02-21", hora: "12:00" },
      { fecha: "2026-02-21", hora: "09:30" },
      { fecha: "2026-02-20", hora: "10:00" },
      { fecha: "2026-02-21", hora: "10:00" },
    ];

    const resultado = obtenerReservasParaAdmin(reservas, "2026-02-21");

    expect(resultado.length).toBe(3);
    expect(resultado.map((r) => r.hora)).toEqual(["09:30", "10:00", "12:00"]);
    expect(resultado.every((r) => r.fecha === "2026-02-21")).toBe(true);
  });

  test("obtenerReservasParaAdmin sin fecha devuelve todo ordenado", () => {
    const reservas = [
      { fecha: "2026-02-21", hora: "12:00" },
      { fecha: "2026-02-20", hora: "09:30" },
      { fecha: "2026-02-21", hora: "10:00" },
    ];

    const resultado = obtenerReservasParaAdmin(reservas, "");

    expect(resultado.map((r) => r.hora)).toEqual(["09:30", "10:00", "12:00"]);
  });
});

test("filtrarReservasPorFecha maneja reservas null/undefined", () => {
  expect(filtrarReservasPorFecha(null, "2026-02-21")).toEqual([]);
  expect(filtrarReservasPorFecha(undefined, "")).toEqual([]);
});

test("ordenarReservasPorHora no muta el array original", () => {
  const reservas = [{ hora: "12:00" }, { hora: "09:30" }];
  const copia = [...reservas];

  ordenarReservasPorHora(reservas);

  expect(reservas).toEqual(copia);
});

test("aMinutos maneja formatos raros sin romper", () => {
  expect(aMinutos("9:5")).toBe(545);      // 9*60 + 5
  expect(aMinutos("09")).toBe(540);       // "09:0"
  expect(aMinutos("aa:bb")).toBe(0);      // NaN -> 0
});

test("ordenarReservasPorHora coloca horas vacías como 0 minutos", () => {
  const reservas = [{ hora: "10:00" }, { hora: null }, { hora: "09:30" }];
  const ordenadas = ordenarReservasPorHora(reservas);

  expect(ordenadas.map((r) => r.hora)).toEqual([null, "09:30", "10:00"]);
});

test("obtenerReservasParaAdmin con reservas null devuelve []", () => {
  expect(obtenerReservasParaAdmin(null, "2026-02-21")).toEqual([]);
});

test("ordenarReservasPorHora con null devuelve []", () => {
  expect(ordenarReservasPorHora(null)).toEqual([]);
  expect(ordenarReservasPorHora(undefined)).toEqual([]);
});