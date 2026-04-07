# Veterinaria Huellas — Appointment Management System (Web Prototype)

A navigable web prototype (100% client-side) for the digital management of appointments for **Huellas Veterinary Clinic**, designed to reduce the operational burden of phone scheduling and allow customers to self-manage bookings, while maintaining internal agenda control by the administrator.  
The system **does not use a backend or database**; it works with **preloaded data** and persistence through **LocalStorage**.

## 🎯 Objectives

* Allow visitors to view services and prices clearly.
* Allow customers to book appointments online by showing **only available time slots**.
* Allow the administrator to view and cancel reservations in order to control the daily schedule.
* Validate the solution through a navigable prototype before making a larger investment.

## 👥 Actors

* **Visitor**: browses the site and checks general information (services, team, contact).
* **Customer**: a visitor who starts and completes the booking process.
* **Administrator**: logs in with credentials and manages reservations (list/cancel).

## 🧩 Main Features (Summary)

* Display of services (title, description, fixed price).
* Services shown in carousel-style cards (loop with regular intervals).
* Display of the team (preloaded members).
* Appointment booking: owner/pet information + service + professional + date + time.
* Available time slots calculated according to business rules and existing reservations.
* Visual booking confirmation.
* Administrator access (login) + daily listing + cancellation with confirmation.
* Local persistence of reservations using LocalStorage.

## 📌 Business Rules

* **Opening hours**: Monday to Friday 9:00 AM–6:00 PM; Saturdays until noon; closed on Sundays.
* **Appointment duration**:

  * 30 minutes: clinical and medical services
  * 60 minutes: grooming, bathing, and nail trimming
* **Late arrival policy**: if the customer does not arrive and the professional is already attending the next appointment, the appointment is considered canceled.
* **Payments**: only accepted on-site.
* **Species**: only dogs and cats are treated.

## 🧱 Technologies and Constraints

* HTML5 + CSS3 + Vanilla JavaScript
* No external frameworks/libraries at runtime
* No backend / no database
* Persistence: LocalStorage
* Navigable prototype (not production-ready)
* **Testing (development): Jest**

## 🗂️ Project Structure

The project follows a clear separation of responsibilities:

* `index.html`: interface structure and sections.
* `styles.css`: styling and responsive design.
* `src/app.js`: DOM interaction, event handling, and LocalStorage persistence **without business rules**.
* `src/core/`: pure system logic + validations (no DOM access), designed to be testable with unit tests.

## ▶️ How to Run Locally

1. Clone or download the project.
2. Open `index.html` in the browser.

> Recommended: use an extension such as **Live Server** to avoid path issues when working with modules/files.

## ✅ Testing (with Jest)

The logic core located in `src/core/` is designed to be unit testable (it does not depend on the DOM).

### Requirements

* Node.js + npm

### Installation

```bash
npm install
```

### Run tests

```bash
npm test
```

### Run tests in watch mode (optional)

```bash
npm test -- --watch
```

### View coverage (optional)

```bash
npm test -- --coverage
```

### Test Scope

Unit tests focus on:

* Calculation of available time slots by professional and date
* Booking validations (required data, valid date/time, etc.)
* Business rules (duration by service, opening hours, no overlapping appointments)
* **Simulated** persistence (if applicable) through function injection or mocks (without depending on the DOM)

## 🔐 Administrator Access

To enter the administration panel, use:

* **Username:** `admin@veterinaria`
* **Password:** `admin123`

> Note: these credentials are for academic/demo use of the prototype.

## 📎 Documentation

This repository is based on the requirement gathering, design, planning, and testing document developed for the academic project (Software Engineering Workshop).

## ✍️ Authors

* Rodrigo Pintos Alvariza
* Eduardo Monzón
* Mateo Bragunde Dufour

---
