# HTW Campus Event Hub

Small web project for managing HTW campus events. Built with a Flask REST API backend running in Docker and a standard jQuery frontend.

## Features
- **Guest mode**: Search and filter upcoming events.
- **Student mode**: Register for events using `@htw-berlin.de` email address validation. Save registrations locally.
- **Organizer mode**: Add, edit, and delete events (communicates directly with backend API).

## Running the App

### 1. Backend (Flask API)
Build and run the container:
```bash
docker build -t htw-backend .
docker run -p 5000:5000 --name htw-api htw-backend