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