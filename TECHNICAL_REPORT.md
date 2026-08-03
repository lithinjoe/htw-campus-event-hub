# Technical & Architectural Report: HTW Event System

## 1. Project Requirements & User Stories

### User Stories
- **US-1:** As a student, I want to view upcoming campus events so that I can participate in activities.
- **US-2:** As an event organizer, I want to create new event listings so that students can find my workshops.
- **US-3:** As an administrator, I want to upload banner images using cloud storage so that events look appealing.

### MoSCoW Prioritization
| Requirement | Priority | Implementation Status |
| :--- | :--- | :--- |
| Event Listing API | **Must Have** | Implemented (Flask REST API) |
| Web UI | **Must Have** | Implemented (HTML/JS/Nginx) |
| Containerization | **Must Have** | Implemented (Docker & K8s) |
| Serverless Image Upload | **Should Have** | Implemented (Azure Function) |
| User Login/Auth | **Could Have** | Out of Scope |

## 2. Architecture & Design
The application follows a microservices architecture:
1. **Frontend:** Serves static assets via Nginx on port 80.
2. **Backend:** Processes REST requests at `/api/events` via Python Flask.
3. **Cloud Function:** Handles blob upload triggers via Azure Functions API.

## 3. Implementation Details & Verification
*(Insert your terminal screenshots here before final submission)*
- Screenshot 1: `docker-compose up` running without errors.
- Screenshot 2: `kubectl get pods,svc` output showing running Kubernetes clusters.