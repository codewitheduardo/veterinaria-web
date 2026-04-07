# Veterinaria Huellas — Sistema de Gestión de Turnos

Prototipo web navegable para la gestión de turnos de la veterinaria **Huellas**, desarrollado 100% del lado del cliente con **HTML, CSS y JavaScript Vanilla**.  
Permite a los clientes reservar turnos online y al administrador gestionar la agenda diaria.  
El sistema no utiliza backend ni base de datos; trabaja con **LocalStorage** y datos precargados.

## Funcionalidades principales

- Visualización de servicios, equipo y contacto
- Reserva de turnos online
- Cálculo de horarios disponibles según reglas de negocio
- Confirmación visual de reserva
- Panel de administrador con login
- Listado y cancelación de reservas
- Persistencia local con LocalStorage

## Reglas de negocio

- Atención de lunes a viernes de 9:00 a 18:00
- Sábados hasta las 12:00
- Domingos cerrado
- Turnos de 30 o 60 minutos según el servicio
- Atención exclusiva para perros y gatos
- Pago únicamente en el local

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- LocalStorage
- Jest para testing

## Estructura del proyecto

- `index.html`: estructura principal
- `styles.css`: estilos y diseño responsive
- `src/app.js`: interacción con DOM y persistencia
- `src/core/`: lógica del sistema y validaciones

## Cómo ejecutar

1. Clonar o descargar el proyecto
2. Abrir `index.html` en el navegador

> Recomendado: usar Live Server para trabajar con mayor comodidad.

## Testing

```bash
npm install
npm test
```

## Acceso administrador

- **Usuario:** `admin@veterinaria`
- **Contraseña:** `admin123`

## Autores

- Rodrigo Pintos Alvariza
- Eduardo Monzón
- Mateo Bragagunde Dufour
