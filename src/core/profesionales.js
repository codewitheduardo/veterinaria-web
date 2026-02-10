// =======================
// EQUIPO (HU-03)
// =======================
export const profesionales = [
  {
    id: 1,
    nombre: "Dra. María González",
    rol: "Médica Veterinaria",
    especialidad: "Clínica general y cirugía menor",
    descripcion:
      "Atiende medicina preventiva y cirugías ambulatorias con enfoque humano.",
    servicios: [1, 2, 5],
    img: "../img/equipo/maria.png",
  },
  {
    id: 2,
    nombre: "Dr. Carlos Rodríguez",
    rol: "Médico Veterinario",
    especialidad: "Diagnóstico y vacunación",
    descripcion:
      "Apasionado por la medicina preventiva y el bienestar integral.",
    servicios: [1, 2, 5],
    img: "../img/equipo/carlos.png",
  },
  {
    id: 3,
    nombre: "Dra. Laura Martínez",
    rol: "Médica Veterinaria",
    especialidad: "Clínica de pequeños animales",
    descripcion:
      "Foco en manejo del dolor y planes de cuidados personalizados.",
    servicios: [1, 2],
    img: "../img/equipo/laura.png",
  },
  {
    id: 4,
    nombre: "Sofía Fernández",
    rol: "Especialista en Estética",
    especialidad: "Peluquería integral",
    descripcion: "Cortes, baño y grooming con productos hipoalergénicos.",
    servicios: [3, 4, 6],
    img: "../img/equipo/sofia.png",
  },
  {
    id: 5,
    nombre: "Pablo Sánchez",
    rol: "Especialista en Estética",
    especialidad: "Baño y spa",
    descripcion:
      "Experto en higiene completa y técnicas de cepillado avanzadas.",
    servicios: [3, 4, 6],
    img: "../img/equipo/pablo.png",
  },
  {
    id: 6,
    nombre: "Ana Gutiérrez",
    rol: "Especialista en Estética",
    especialidad: "Corte de uñas y grooming",
    descripcion: "Atención delicada para mascotas sensibles o ansiosas.",
    servicios: [4, 6],
    img: "../img/equipo/ana.png",
  },
];

export function obtenerProfesionalPorId(id) {
  const identificador = Number(id);
  return profesionales.find((p) => p.id === identificador) || null;
}

export function obtenerProfesionalesPorServicio(idServicio) {
  const id = Number(idServicio);
  return profesionales.filter((p) => p.servicios.includes(id));
}