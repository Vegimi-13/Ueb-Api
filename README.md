# Job Application Platform - Microservices Architecture

A full-stack job application platform built with microservices architecture, featuring separate services for authentication, job/company management, and applications.

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Docker Desktop** (with Docker Engine running)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Install Dependencies

After extracting the project, you need to install dependencies for all services:

```bash
# Install backend dependencies
cd backend
npm install

# Install each service's dependencies
cd services/auth-service
npm install
cd ../job-company-service
npm install
cd ../application-service
npm install

# Go back to backend root
cd ../..

# Install frontend dependencies
cd ../frontend/vite-project
npm install
```

### 2. Start Docker

**VERY IMPORTANT:** Open Docker Desktop and make sure Docker Engine is running before proceeding.

Verify Docker is running:
```bash
docker info
```

### 3. Start the Application

#### Backend (from `backend/` directory):

```bash
# Start all databases
npm run dbs

# Start all services in development mode
npm run dev
```

#### Frontend (from `frontend/vite-project/` directory):

```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Auth Service:** http://localhost:4001
- **Job/Company Service:** http://localhost:4002
- **Application Service:** http://localhost:4003

## 🛠️ Running Individual Services

If you want to run only specific services:

```bash
# From backend/ directory

# Auth Service only:
docker compose up -d auth-db
npm run dev:auth

# Job/Company Service only:
docker compose up -d jobcompany-db
npm run dev:job

# Application Service only:
docker compose up -d application-db
npm run dev:app
```

## 🗄️ Database Management (Prisma)

If you need to reset or update the database:

```bash
# Navigate to a specific service
cd backend/services/<service-name>

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

## 🐳 Docker Commands

```bash
# Start all services in Docker (optional)
npm run docker:all

# Stop all Docker containers
npm run docker:down

# View running containers
docker ps
```

## 📁 Project Structure

```
Ueb-Api/
├── backend/
│   ├── services/
│   │   ├── auth-service/         # User authentication
│   │   ├── job-company-service/  # Job and company management
│   │   └── application-service/  # Job applications
│   ├── docker-compose.yml
│   └── package.json
├── frontend/
│   └── vite-project/             # React frontend
└── README.md
```

## ⚠️ Troubleshooting

### Port Already in Use
If you get port errors, make sure no other services are running on ports 3001, 3002, 3003, or 5173.

### Docker Connection Issues
Ensure Docker Desktop is running and the Docker daemon is active.

### Database Connection Errors
Make sure the databases are running:
```bash
docker ps
```

### Missing Dependencies
If you encounter module errors, reinstall dependencies:
```bash
npm install
```

## 🔑 Default Users

After running the auth service, you can use these default accounts:

- **Admin:** admin@example.com

(Check auth-service seed file for default passwords)

## 📝 Notes

- Always start Docker before running any services
- Each microservice has its own database
- Services communicate via REST APIs
- Frontend uses React with Vite
- Backend uses Express.js with Prisma ORM
