Markdown
# HTW Event Management System

A containerized cloud application for managing HTW Berlin student events.

## Architecture
- **Frontend:** HTML5, CSS3, JavaScript (Nginx Container)
- **Backend:** Python Flask REST API (Docker Container)
- **Serverless:** Azure Function for image banner uploads
- **Orchestration:** Kubernetes (Deployments, Services, Ingress)

## Local Setup & Running

### 1. Docker Compose (Quickstart)
```bash
docker-compose up --build
Access frontend at http://localhost:8080 and API at http://localhost:5000.

2. Manual Container Build
Bash
# Backend
docker build -t htw-backend ./backend
docker run -p 5000:5000 htw-backend

# Frontend
docker build -t htw-frontend ./frontend
docker run -p 8080:80 htw-frontend
3. Kubernetes Deployment
Bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml