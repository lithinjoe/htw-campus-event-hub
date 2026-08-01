# HTW Berlin Campus Event Hub

A full-stack campus event management application built with a responsive JavaScript/HTML/CSS front-end and a containerized Python Flask REST API back-end.

---

## System Architecture

* **Front-End:** HTML5, CSS3, JavaScript (jQuery, AJAX)
* **Back-End API:** Python 3.11, Flask, Flask-CORS
* **Containerization:** Docker Desktop
* **Version Control:** Git & GitHub

---

## Application Features

1. **Role-Based Views:**
   * **Guest:** Browse catalog and search/filter events by category.
   * **Student:** Register for events with `@htw-berlin.de` email validation and manage personal registrations.
   * **Organizer:** Full CRUD operations (Create, Read, Update, Delete) for campus events.

2. **REST API Integration:**
   * All event catalog updates communicate directly with the Flask backend API via JSON over HTTP.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/events` | Fetch all scheduled events |
| `POST` | `/api/events` | Create a new event |
| `PUT` | `/api/events/<id>` | Update an existing event by ID |
| `DELETE` | `/api/events/<id>` | Delete an event by ID |

---

## How to Run locally

### 1. Run Backend API in Docker

```bash
cd backend
docker build -t htw-backend .
docker run -d -p 5000:5000 --name htw-api htw-backend