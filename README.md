# ETHARA AI - Human Resource Management System

A full-stack HRMS (Human Resource Management System) application for managing employees, departments, and attendance tracking.

## Project Overview

ETHARA AI HRMS is a modern web application that provides:

- **Employee Management** - Add, edit, and manage employee records
- **Department Management** - Organize employees into departments with customizable settings
- **Attendance Tracking** - Mark and track daily attendance with check-in/check-out times
- **Dashboard Analytics** - Visual overview of workforce statistics

## Tech Stack

### Frontend
| Technology |  |
|------------|---------|
| Next.js 16 
| React 19 
| TypeScript 
| Tailwind CSS 4

### Backend
| Technology |  |
|------------|---------|
| Node.js | 
| Express.js 
| TypeScript 
| MongoDB 
| Mongoose 

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| GitHub Actions | CI/CD pipelines |

## Prerequisites

- Node.js 18+ 
- npm and pnpm
- MongoDB (local or Atlas)

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ethara-ai.git
cd ethara-ai
```

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/ethara-hrms

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies (using pnpm)
pnpm install
# OR using npm
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local (default is fine for local dev)
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
pnpm dev
# OR
npm run dev
```

The frontend will run on `http://localhost:3000`

## Assumptions

1. **Single Organization** - The system is designed for a single organization/company
2. **Daily Attendance** - Attendance is tracked on a daily basis, manually
3. **No Authentication** - Currently no user authentication (assumed internal use only)
4. **Timezone** - All times are stored and displayed in the server's timezone

## Limitations

1. **No User Authentication** - No login/logout functionality; suitable for internal trusted networks only
2. **No Role-Based Access** - All users have full access to all features
3. **Single Tenant** - Not designed for multi-organization use
4. **No Reporting** - Basic dashboard only; no exportable reports
5. **Render Free Tier** - Backend may have cold starts due to using Render free tier

## Future Enhancements

- User authentication with JWT
- Role-based access control (Admin, Manager, Employee)
- Leave management system
- Payroll integration
- Export reports (PDF, Excel)

**Built by Japman Kohli**
