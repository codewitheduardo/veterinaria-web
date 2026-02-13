const servicios = [
  {
    id: 1,
    titulo: "Consulta Médica",
    descripcion:
      "Evaluación completa del estado de salud de tu mascota con diagnóstico profesional.",
    precio: 500,
    categoria: "MEDICAL",
    img: "../img/servicios/consulta.jpg",
  },
  {
    id: 2,
    titulo: "Vacunación",
    descripcion:
      "Plan completo de vacunación según calendario y edad de tu mascota.",
    precio: 1200,
    categoria: "MEDICAL",
    img: "../img/servicios/vacunacion.jpg",
  },
  {
    id: 3,
    titulo: "Estética Completa",
    descripcion: "Peluquería integral: corte, limpieza de oídos y glándulas.",
    precio: 1800,
    categoria: "AESTHETIC",
    img: "../img/servicios/estetica-completa.jpg",
  },
  {
    id: 4,
    titulo: "Baño e Higiene",
    descripcion: "Baño con productos premium, secado y cepillado profesional.",
    precio: 1300,
    categoria: "AESTHETIC",
    img: "../img/servicios/higiene.jpg",
  },
  {
    id: 5,
    titulo: "Cirugía",
    descripcion:
      "Intervenciones quirúrgicas con tecnología de punta y cuidados post-operatorios.",
    precio: 8500,
    categoria: "MEDICAL",
    img: "../img/servicios/cirugia.jpg",
  },
  {
    id: 6,
    titulo: "Corte de Uñas",
    descripcion: "Corte seguro y limado de uñas para mayor comodidad.",
    precio: 600,
    categoria: "AESTHETIC",
    img: "../img/servicios/uñas.avif",
  },
];

function obtenerServicioPorId(id) {
  const identificador = Number(id);
  return servicios.find((servicio) => servicio.id === identificador) || null;
}

function formatearPrecio(precio) {
  return `$${Number(precio).toLocaleString("es-AR")}`;
}

function claseCategoria(categoria) {
  return String(categoria || "").toLowerCase();
}

function obtenerDuracionServicioMinutos(servicio) {
  const categoria = String(servicio?.categoria || "").toUpperCase();
  return categoria === "AESTHETIC" ? 60 : 30;
}

if (typeof module !== "undefined") {
  module.exports = {
    servicios,
    obtenerServicioPorId,
    formatearPrecio,
    claseCategoria,
    obtenerDuracionServicioMinutos,
  };
}
