// ========================================
// SERVICIOS (HU-01, HU-02)
// ========================================
import {
  servicios,
  obtenerServicioPorId,
  formatearPrecio,
  claseCategoria,
} from "./core/servicios.js";

const contenedorModal = document.getElementById("modal");
const overlayModal = document.getElementById("modalOverlay");
const botonCerrarModal = document.getElementById("modalClose");
const cuerpoModal = document.getElementById("modalBody");

let servicioSeleccionadoDesdeModal = null;

function abrirModal(contenidoHtml) {
  if (!contenedorModal || !cuerpoModal) return;

  cuerpoModal.innerHTML = contenidoHtml;
  contenedorModal.classList.add("active");
  contenedorModal.setAttribute("aria-hidden", "false");
}

function cerrarModal() {
  if (!contenedorModal) return;

  contenedorModal.classList.remove("active");
  contenedorModal.setAttribute("aria-hidden", "true");
}

botonCerrarModal?.addEventListener("click", cerrarModal);
overlayModal?.addEventListener("click", (e) => {
  if (e.target === overlayModal) {
    cerrarModal();
  }
});

cuerpoModal?.addEventListener("click", (e) => {
  const objetivo = e.target.closest("[data-accion='cerrar-modal']");
  if (!objetivo) return;
  cerrarModal();
});

cuerpoModal?.addEventListener("click", (e) => {
  const reservarBtn = e.target.closest('[data-accion="reservar"]');
  if (!reservarBtn) return;

  e.preventDefault();

  if (!servicioSeleccionadoDesdeModal) return;

  mostrarSoloSeccion("reservar");
  actualizarNavPorAutenticacion();

  if (selectServicio) {
    selectServicio.value = String(servicioSeleccionadoDesdeModal);
    selectServicio.dispatchEvent(new Event("change", { bubbles: true }));
  }

  history.replaceState(null, "", "#reservar");

  cerrarModal();
});

const carruselServicios = document.getElementById("servicesCarousel");

if (!carruselServicios) {
  console.warn("Carrusel: falta el elemento #servicesCarousel.");
}

let estaPresionado = false;
let posicionInicialX = 0;
let scrollInicial = 0;
let huboMovimiento = false;

let temporizadorAuto = null;
let usuarioInteractuando = false;
let debeReiniciar = false;

function obtenerPasoPorTarjeta() {
  const primeraTarjeta = carruselServicios.querySelector(".service-card");
  if (!primeraTarjeta) return 0;

  const anchoTarjeta = primeraTarjeta.offsetWidth;
  const estilos = getComputedStyle(carruselServicios);
  const separacion = parseFloat(estilos.columnGap || estilos.gap || 0);

  return anchoTarjeta + separacion;
}

function renderizarServicios() {
  if (!carruselServicios) return;

  carruselServicios.innerHTML = servicios
    .map(
      (servicio) => `
      <div class="service-card" role="listitem" data-service-id="${servicio.id}" tabindex="0">
        <div class="service-media">
          <img src="${servicio.img}" alt="Servicio: ${servicio.titulo}" class="service-img" loading="lazy" />
        </div>

        <span class="service-badge ${claseCategoria(servicio.categoria)}">
          ${servicio.categoria}
        </span>

        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcion}</p>
        <div class="service-price">${formatearPrecio(servicio.precio)}</div>

        <button class="btn btn-primary" data-accion="detalles">
          Ver detalles
        </button>
      </div>
    `,
    )
    .join("");

  carruselServicios.querySelectorAll(".service-card").forEach((tarjeta) => {
    const id = Number(tarjeta.dataset.serviceId);
    const servicio = obtenerServicioPorId(id);
    if (!servicio) return;

    const abrirDetalles = () => {
      servicioSeleccionadoDesdeModal = servicio.id;

      abrirModal(`
        <h2>${servicio.titulo}</h2>
        <span class="service-badge ${claseCategoria(servicio.categoria)}">
          ${servicio.categoria}
        </span>
        <p>${servicio.descripcion}</p>
        <div class="modal-price">${formatearPrecio(servicio.precio)}</div>

        <div class="modal-info">
          <p><strong>Recordatorio:</strong> la duración del turno es de 30 minutos.</p>
        </div>

        <a href="#reservar" class="btn btn-primary btn-block" data-accion="reservar">
          Reservar este servicio
        </a>
      `);
    };

    tarjeta.addEventListener("click", (e) => {
      if (huboMovimiento) return;

      if (
        e.target?.dataset?.accion === "detalles" ||
        e.currentTarget === tarjeta
      ) {
        abrirDetalles();
      }
    });

    tarjeta.addEventListener("keydown", (e) => {
      if (e.key === "Enter") abrirDetalles();
    });
  });

  requestAnimationFrame(() => {
    carruselServicios.scrollLeft = 0;
  });

  iniciarAutoPlay();
}

function detenerAutoPlay() {
  if (temporizadorAuto) clearInterval(temporizadorAuto);
  temporizadorAuto = null;
}

function iniciarAutoPlay() {
  detenerAutoPlay();

  temporizadorAuto = setInterval(() => {
    if (usuarioInteractuando) return;

    const maxScroll =
      carruselServicios.scrollWidth - carruselServicios.clientWidth;

    if (maxScroll <= 2) return;

    if (debeReiniciar) {
      carruselServicios.scrollTo({ left: 0, behavior: "smooth" });
      debeReiniciar = false;
      return;
    }

    const paso = obtenerPasoPorTarjeta();
    const siguiente = carruselServicios.scrollLeft + paso;

    if (siguiente >= maxScroll - 2) {
      carruselServicios.scrollTo({ left: maxScroll, behavior: "smooth" });
      debeReiniciar = true;
      return;
    }

    carruselServicios.scrollBy({ left: paso, behavior: "smooth" });
  }, 1200);
}

function pausarTemporalmente(ms = 1200) {
  usuarioInteractuando = true;
  detenerAutoPlay();

  clearTimeout(pausarTemporalmente._t);
  pausarTemporalmente._t = setTimeout(() => {
    usuarioInteractuando = false;
    iniciarAutoPlay();
  }, ms);
}

if (carruselServicios) {
  carruselServicios.addEventListener("mouseenter", () =>
    pausarTemporalmente(1500),
  );
  carruselServicios.addEventListener("mouseleave", () =>
    pausarTemporalmente(300),
  );

  carruselServicios.addEventListener("scroll", () => pausarTemporalmente(1200));

  window.addEventListener("resize", () => pausarTemporalmente(1200));
}

if (carruselServicios) {
  carruselServicios.addEventListener("mousedown", (e) => {
    estaPresionado = true;
    huboMovimiento = false;
    posicionInicialX = e.pageX;
    scrollInicial = carruselServicios.scrollLeft;
    pausarTemporalmente(2500);
  });

  window.addEventListener("mouseup", () => {
    estaPresionado = false;
    setTimeout(() => (huboMovimiento = false), 40);
  });

  carruselServicios.addEventListener("mousemove", (e) => {
    if (!estaPresionado) return;
    e.preventDefault();

    const desplazamiento = e.pageX - posicionInicialX;
    if (Math.abs(desplazamiento) > 6) huboMovimiento = true;

    carruselServicios.scrollLeft = scrollInicial - desplazamiento;
  });
}

// =======================
// RESERVAS (HU-04, HU-05, HU-06, HU-07)
// =======================
import { esDomingo } from "./core/tiempo.js";

import {
  obtenerHorariosDisponiblesPorProfesional,
  estaHorarioOcupado,
} from "./core/reservas.js";

import {
  obtenerProfesionalPorId,
  obtenerProfesionalesPorServicio,
} from "./core/profesionales.js";

import { obtenerDuracionServicioMinutos } from "./core/servicios.js";

const formularioReserva = document.getElementById("bookingForm");
const selectServicio = document.getElementById("service");
const selectProfesional = document.getElementById("professional");
const inputFecha = document.getElementById("date");
const selectHora = document.getElementById("time");

const validacionesCampos = {
  ownerName: (v) => (v.trim().length >= 2 ? "" : "Ingresá tu nombre."),
  petName: (v) => (v.trim().length >= 2 ? "" : "Ingresá el nombre de tu mascota."),
  phone: (v) =>
    /\d{7,}/.test(v.replace(/\D/g, "")) ? "" : "Ingresá un teléfono válido.",
  service: (v) => (v ? "" : "Seleccioná un servicio."),
  professional: (v) => (v ? "" : "Seleccioná un profesional."),
  date: (v) => (v ? "" : "Seleccioná una fecha."),
  time: (v) => (v ? "" : "Seleccioná un horario."),
};

function mostrarErrorCampo(idCampo, mensaje) {
  const elemento = document.querySelector(`[data-error-for="${idCampo}"]`);
  if (elemento) elemento.textContent = mensaje || "";
}

selectServicio.innerHTML =
  '<option value="">Seleccioná un servicio</option>' +
  servicios
    .map(
      (servicio) =>
        `<option value="${servicio.id}">
          ${servicio.titulo} — ${formatearPrecio(servicio.precio)}
        </option>`,
    )
    .join("");

selectServicio.addEventListener("change", () => {
  const idServicio = Number(selectServicio.value);
  mostrarErrorCampo("service", validacionesCampos.service(idServicio));

  selectProfesional.value = "";
  selectProfesional.disabled = true;
  selectProfesional.innerHTML = '<option value="">Primero elegí un servicio</option>';

  inputFecha.value = "";
  inputFecha.disabled = true;

  selectHora.value = "";
  selectHora.disabled = true;
  selectHora.innerHTML = '<option value="">Elegí fecha y profesional</option>';

  if (!idServicio) return;

  const profesionalesDisponibles = obtenerProfesionalesPorServicio(idServicio);

  selectProfesional.disabled = false;
  selectProfesional.innerHTML =
    '<option value="">Seleccioná un profesional</option>' +
    profesionalesDisponibles
      .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
      .join("");
});

selectProfesional.addEventListener("change", () => {
  mostrarErrorCampo(
    "professional",
    validacionesCampos.professional(selectProfesional.value),
  );

  inputFecha.value = "";
  mostrarErrorCampo("date", "");
  inputFecha.disabled = !selectProfesional.value;

  selectHora.value = "";
  selectHora.disabled = true;
  selectHora.innerHTML = '<option value="">Elegí fecha y profesional</option>';
});

inputFecha.addEventListener("change", () => {
  mostrarErrorCampo("date", validacionesCampos.date(inputFecha.value));

  const idProfesional = Number(selectProfesional.value);
  const fecha = inputFecha.value;

  const idServicio = Number(selectServicio.value);
  const servicio = obtenerServicioPorId(idServicio);
  const duracionMinutos = obtenerDuracionServicioMinutos(servicio);

  if (!idProfesional || !fecha) {
    selectHora.disabled = true;
    return;
  }

  if (esDomingo(fecha)) {
    selectHora.disabled = true;
    selectHora.innerHTML = '<option value="">Domingo cerrado</option>';
    return;
  }

  const horariosDisponibles = obtenerHorariosDisponiblesPorProfesional(
    idProfesional,
    fecha,
    obtenerReservasStorage,
    duracionMinutos,
  );

  if (horariosDisponibles.length === 0) {
    selectHora.disabled = true;
    selectHora.innerHTML = '<option value="">No hay horarios disponibles</option>';
    return;
  }

  selectHora.disabled = false;
  selectHora.innerHTML =
    '<option value="">Seleccioná un horario</option>' +
    horariosDisponibles.map((h) => `<option value="${h}">${h}</option>`).join("");
});

formularioReserva.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombreDueno = document.getElementById("ownerName").value;
  const nombreMascota = document.getElementById("petName").value;
  const telefono = document.getElementById("phone").value;

  const idServicio = Number(selectServicio.value);
  const idProfesional = Number(selectProfesional.value);
  const fecha = inputFecha.value;
  const hora = selectHora.value;

  const errores = {
    ownerName: validacionesCampos.ownerName(nombreDueno),
    petName: validacionesCampos.petName(nombreMascota),
    phone: validacionesCampos.phone(telefono),
    service: validacionesCampos.service(idServicio),
    professional: validacionesCampos.professional(idProfesional),
    date: validacionesCampos.date(fecha),
    time: validacionesCampos.time(hora),
  };

  Object.entries(errores).forEach(([campo, msg]) => mostrarErrorCampo(campo, msg));
  if (Object.values(errores).some(Boolean)) return;

  const servicio = obtenerServicioPorId(idServicio);
  const duracionMinutos = obtenerDuracionServicioMinutos(servicio);

  if (
    estaHorarioOcupado(
      idProfesional,
      fecha,
      hora,
      obtenerReservasStorage,
      duracionMinutos,
    )
  ) {
    abrirModal(`
      <h2>Horario no disponible</h2>
      <p>El horario seleccionado se solapa con otra reserva para este profesional.</p>
      <a href="#reservar" class="btn btn-primary btn-block" data-accion="cerrar-modal">Volver</a>
    `);
    return;
  }

  const profesional = obtenerProfesionalPorId(idProfesional);

  const reserva = {
    id: crypto?.randomUUID?.() || String(Date.now()),
    dueno: nombreDueno.trim(),
    mascota: nombreMascota.trim(),
    telefono: telefono.trim(),
    servicioId: idServicio,
    servicio: servicio?.titulo || "",
    profesionalId: idProfesional,
    profesional: profesional?.nombre || "",
    fecha,
    hora,
    duracionMinutos,
    estado: "pendiente",
    createdAt: new Date().toISOString(),
  };

  agregarReservaStorage(reserva);

  abrirModal(`
    <h2>✅ Reserva Confirmada</h2>
    <div class="modal-info">
      <p><strong>Dueño:</strong> ${reserva.dueno}</p>
      <p><strong>Mascota:</strong> ${reserva.mascota}</p>
      <p><strong>Servicio:</strong> ${reserva.servicio}</p>
      <p><strong>Profesional:</strong> ${reserva.profesional}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Duración:</strong> ${duracionMinutos} min</p>
    </div>
    <a href="#reservar" class="btn btn-primary btn-block" data-accion="cerrar-modal">Aceptar</a>
  `);

  formularioReserva.reset();

  selectProfesional.disabled = true;
  selectProfesional.innerHTML = '<option value="">Primero elegí un servicio</option>';

  inputFecha.disabled = true;

  selectHora.disabled = true;
  selectHora.innerHTML = '<option value="">Elegí fecha y profesional</option>';
});

function resetearFormularioReserva() {
  if (!formularioReserva) return;

  formularioReserva.reset();

  Object.keys(validacionesCampos).forEach((idCampo) => {
    mostrarErrorCampo(idCampo, "");
  });

  if (selectServicio) {
    selectServicio.value = "";
  }

  if (selectProfesional) {
    selectProfesional.value = "";
    selectProfesional.disabled = true;
    selectProfesional.innerHTML =
      '<option value="">Primero elegí un servicio</option>';
  }

  if (inputFecha) {
    inputFecha.value = "";
    inputFecha.disabled = true;
  }

  if (selectHora) {
    selectHora.value = "";
    selectHora.disabled = true;
    selectHora.innerHTML = '<option value="">Elegí fecha y profesional</option>';
  }
}

const _mostrarSoloSeccionOriginal = mostrarSoloSeccion;
mostrarSoloSeccion = function (idObjetivo) {
  const estabaEnReservar = resolverSeccionDesdeHash(location.hash) === "reservar";

  _mostrarSoloSeccionOriginal(idObjetivo);

  if (estabaEnReservar && idObjetivo !== "reservar") {
    resetearFormularioReserva();
  }
};

const _mostrarModoInicioOriginal = mostrarModoInicio;
mostrarModoInicio = function () {
  const estabaEnReservar = resolverSeccionDesdeHash(location.hash) === "reservar";

  _mostrarModoInicioOriginal();

  if (estabaEnReservar) {
    resetearFormularioReserva();
  }
};

// =======================
// PERSISTENCIA LOCAL DE DATOS (HU-12)
// =======================
const CLAVE_STORAGE_RESERVAS = "reservas";

function obtenerReservasStorage() {
  try {
    const datos = localStorage.getItem(CLAVE_STORAGE_RESERVAS);
    return datos ? JSON.parse(datos) : [];
  } catch (e) {
    console.warn("Error leyendo reservas", e);
    return [];
  }
}

function guardarReservasStorage(reservas) {
  localStorage.setItem(CLAVE_STORAGE_RESERVAS, JSON.stringify(reservas));
}

function agregarReservaStorage(reserva) {
  const reservas = obtenerReservasStorage();
  reservas.push(reserva);
  guardarReservasStorage(reservas);
}

function cancelarReservaStorage(index) {
  const reservas = obtenerReservasStorage();
  if (reservas[index]) {
    reservas[index].estado = "cancelado";
    guardarReservasStorage(reservas);
  }
}