# HTW Campus Event Hub - Technical Report

## 1. Project Overview
The HTW Campus Event Hub is a lightweight web application designed for managing and browsing campus events. The system fulfills requirements for B8 (Cloud IT) and B10 (Web Applications).

## 2. Architecture & Tech Stack
* **Frontend**: HTML5, Custom CSS (Flexbox/Grid layout), Vanilla JavaScript.
* **Backend**: Python Flask REST API (`app.py`).
* **Persistence**: Flask server-side event data with client-side `localStorage` for user registrations.
* **Containerization**: Single-stage Docker containerization for frontend (Nginx) and backend services.
* **Orchestration**: Kubernetes manifests (`backend-deployment.yaml`, `frontend-deployment.yaml`).
* **Serverless Component**: Azure Function endpoint prepared for image upload handling and image URL generation (function_app.py).

## 3. Web Application Features (B10)
1. **Event Catalog View**: Displays active campus events fetched dynamically via REST API.
2. **Event Detail View**: Shows individual event descriptions, dates, and locations.
3. **Registration Form**: Client-side registration processed and saved locally in `localStorage`.
4. **Student Dashboard**: Displays registered events for the student session.
5. **Organizer Dashboard**: Allows creation and basic management of campus events.

## 4. Cloud IT Features (B8)
* **REST API**: Python Flask backend exposing event resources.
* **Docker Setup**: Dedicated Dockerfiles for frontend static hosting and backend Flask runtime.
* **Kubernetes Deployments**: Configured service endpoints and pod replica definitions.
* **Serverless Processing**: Lightweight function endpoint structured for image metadata processing.

## 5. Security & Input Sanitization
* Basic XSS protection implemented on the frontend via HTML character escaping (`escapeHtml()`).
* Standard CORS handling for backend communication.

## 6. Implementation Summary
Satisfied via a responsive frontend layout, REST backend API, client-side input validation, and structured container deployment configurations.