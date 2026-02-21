const {
  USUARIO_ADMIN,
  CLAVE_ADMIN,
  validarCredencialesAdmin,
  obtenerClaveSesionAdmin,
  estaAdminLogueadoDesdeValor,
  valorSesionAdminLogueado,
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
});