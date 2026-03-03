# Veterinaria Huellas — Sistema de Gestión de Turnos (Prototipo Web)

Prototipo web navegable (100% client-side) para la gestión digital de turnos de la veterinaria **Huellas**, orientado a reducir la carga operativa telefónica y permitir la autogestión de reservas por parte de los clientes, manteniendo el control interno de la agenda por parte del administrador.
El sistema **no utiliza backend ni base de datos**, trabaja con **datos precargados** y persistencia mediante **LocalStorage**.

## 🎯 Objetivos

* Permitir que el visitante consulte servicios y precios de forma clara.
* Permitir que el cliente reserve turnos online mostrando **solo horarios disponibles**.
* Permitir al administrador visualizar y cancelar reservas para controlar la agenda diaria.
* Validar la solución mediante un prototipo navegable antes de una inversión mayor.

## 👥 Actores

* **Visitante**: navega el sitio y consulta información general (servicios, equipo, contacto).
* **Cliente**: visitante que inicia y completa el proceso de reserva.
* **Administrador**: accede con credenciales y gestiona reservas (listar/cancelar).

## 🧩 Funcionalidades principales (resumen)

* Visualización de servicios (título, descripción, precio fijo).
* Servicios en tarjetas tipo carrusel (loop con intervalos regulares).
* Visualización del equipo (integrantes precargados).
* Reserva de turno: datos del dueño/mascota + servicio + profesional + fecha + hora.
* Horarios disponibles calculados según reglas de negocio y turnos ya reservados.
* Confirmación visual de reserva.
* Acceso administrador (login) + listado por día + cancelación con confirmación.
* Persistencia local de reservas con LocalStorage.

## 📌 Reglas de negocio

* **Horarios de atención**: lunes a viernes 9:00–18:00; sábados hasta el mediodía; domingos cerrado.
* **Duración de turnos**:

  * 30 minutos: servicios clínico-médicos
  * 60 minutos: estética, baño y corte de uñas
* **Política de retrasos**: si el cliente no se presenta y el profesional ya atiende el siguiente turno, el turno se considera cancelado.
* **Pagos**: exclusivamente en el local.
* **Especies**: atención exclusiva de perros y gatos.

## 🧱 Tecnologías y restricciones

* HTML5 + CSS3 + JavaScript Vanilla
* Sin frameworks/librerías externas (en runtime)
* Sin backend / sin base de datos
* Persistencia: LocalStorage
* Prototipo navegable (no productivo)
* **Testing (desarrollo): Jest**

## 🗂️ Estructura del proyecto

El proyecto respeta una separación clara de responsabilidades:

* `index.html`: estructura de la interfaz y secciones.
* `styles.css`: estilos y responsive.
* `src/app.js`: interacción con el DOM, manejo de eventos y persistencia en LocalStorage **sin reglas de negocio**.
* `src/core/`: lógica pura del sistema + validaciones (sin acceso al DOM), diseñada para ser testeable con pruebas unitarias.

## ▶️ Cómo ejecutar (local)

1. Clonar o descargar el proyecto.
2. Abrir `index.html` en el navegador.

> Recomendado: usar una extensión tipo **Live Server** para evitar problemas de rutas al trabajar con módulos/archivos.

## ✅ Testing (con Jest)

El núcleo de lógica ubicado en `src/core/` está diseñado para ser testeable unitariamente (no depende del DOM).

### Requisitos

* Node.js + npm

### Instalación

```bash
npm install
```

### Ejecutar pruebas

```bash
npm test
```

### Ejecutar pruebas en modo watch (opcional)

```bash
npm test -- --watch
```

### Ver cobertura (opcional)

```bash
npm test -- --coverage
```

### Alcance de las pruebas

Las pruebas unitarias se enfocan en:

* Cálculo de horarios disponibles por profesional y fecha
* Validaciones de reserva (datos obligatorios, fecha/hora válidas, etc.)
* Reglas de negocio (duración por servicio, horarios de atención, no solapamiento)
* Persistencia **simulada** (si corresponde) mediante inyección de funciones o mocks (sin depender del DOM)

## 🔐 Acceso administrador

Para ingresar al panel de administración usá:

* **Usuario:** `admin@veterinaria`
* **Contraseña:** `admin123`

> Nota: estas credenciales son para uso académico/demostración del prototipo.

## 📎 Documentación

Este repositorio se basa en el documento de relevamiento, diseño, planificación y testing del obligatorio (Taller de Ingeniería de Software).

## ✍️ Autores

* Rodrigo Pintos Alvariza
* Eduardo Monzón
* Mateo Bragagunde Dufour

---
