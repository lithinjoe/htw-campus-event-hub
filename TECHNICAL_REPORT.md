# Technical Engineering Report: HTW Campus Event Hub

## 1. Introduction & Objectives
- **Project Goal:** Build a centralized event management platform for HTW Berlin students to discover, create, and register for campus activities.
- **Scope:** Full-stack architecture incorporating client-side storage fallback, a RESTful API backend, containerization, and cloud orchestration.

## 2. System Architecture & Tech Stack
- **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6+), jQuery, and Bootstrap UI, served via Nginx.
- **Backend:** Python Flask framework providing RESTful CRUD operations for events and user registrations.
- **Storage:** LocalStorage for client-side offline persistence and JSON-based request validation.
- **Deployment & Cloud:** Docker containerization, Kubernetes manifest orchestration (`ClusterIP` / `NodePort`), and serverless Azure Functions for image handling.

## 3. Core Features & User Stories
- **Event Discovery:** Students can view a dynamic grid of campus events with filtering and search capabilities.
- **Event Creation:** Organizers can publish new events with titles, dates, locations, and categories.
- **Registration & Attendance:** Users can register for events, updating seat counts in real-time.
- **Offline / Local Fallback:** Utilizes `localStorage` to ensure the application remains functional even when disconnected from the backend API.

## 4. Security & Input Validation
- **XSS Prevention:** All user-supplied inputs are sanitized and escaped before DOM insertion using custom escape functions (`escapeHtml`) to prevent script injection attacks.
- **Payload Validation:** Backend endpoints explicitly check HTTP headers and validate JSON payloads against missing fields or type mismatches (returning `400 Bad Request` where appropriate).
- **CORS & Auth Headers:** Restricts unauthorized access and implements structured security headers across Flask and serverless endpoints.

## 5. Testing, Containerization & Deployment
- **Containerization:** Both backend (`app.py`) and frontend (`index.html`) are isolated into independent Docker containers using optimized multi-stage and lightweight Nginx/Python base images.
- **Orchestration:** Managed locally using Kubernetes manifests (`k8s/`), ensuring standard deployment, replica management, and service exposure via `NodePort`.
- **Serverless Integration:** Simulated Azure Functions handle cloud storage uploads asynchronously via REST endpoints (`/api/upload_banner`).

## 6. Conclusion & Module Mapping
- **Cloud-IT (B8) Compliance:** Achieved through microservice containerization, Kubernetes orchestration, and serverless architecture.
- **Web Application (B10) Compliance:** Satisfied via a complete responsive frontend, secure REST backend, standard input validation, and structured documentation.