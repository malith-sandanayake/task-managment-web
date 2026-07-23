# Task Management System

A full-stack task management application built with React, Node.js, Express, TypeScript, and MySQL.

The application allows an authenticated user to create, view, update, delete, search, filter, sort, and complete tasks through a responsive dashboard.

## Features

### Authentication

- Email and password login
- Password hashing with bcrypt
- JWT-based authentication
- Protected frontend routes
- Protected backend endpoints
- Automatic logout when the session becomes invalid
- Current authenticated user endpoint

### Dashboard

- Total task count
- Pending task count
- In-progress task count
- Completed task count
- Overdue task count
- Responsive statistics cards

### Task management

- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Task ownership protection
- Task title
- Task description
- Priority
- Status
- Due date

### Search, filtering, and sorting

- Search tasks by title
- Filter by status
- Filter by priority
- Sort by newest
- Sort by oldest
- Sort by due date
- Combine search, filters, and sorting

### User experience

- Responsive desktop, tablet, and mobile layouts
- Loading states
- Empty states
- Error states
- Confirmation dialog before deletion
- Success notifications
- Modal keyboard support
- Modal backdrop closing
- Background scroll prevention while dialogs are open

## Technology stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express
- TypeScript
- MySQL
- mysql2
- Zod
- bcrypt
- JSON Web Token

## Project structure

```text
task-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   ├── seed.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── database/
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 20 or later
- npm
- MySQL 8 or later
- Git

## Local setup

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd task-management-system
```

Replace `YOUR_REPOSITORY_URL` with the repository URL.

### 2. Configure the database

Ensure the MySQL server is running.

Run the schema file:

```bash
mysql -u root -p < database/schema.sql
```

Enter the MySQL password when prompted.

The schema creates the required database and tables.

### 3. Configure the backend

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

On Windows Command Prompt, use:

```bash
copy .env.example .env
```

Update `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=task_management
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Do not commit the `.env` file.

### 4. Seed the default user

From the `backend` directory, run:

```bash
npm run seed
```

Default login credentials:

```text
Email: admin@test.com
Password: 123456
```

The password is stored as a bcrypt hash in the database.

### 5. Start the backend

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

### 6. Configure the frontend

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

On Windows Command Prompt, use:

```bash
copy .env.example .env
```

Update `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Do not commit the `.env` file.

### 7. Start the frontend

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

## Available scripts

### Backend

Run the development server:

```bash
npm run dev
```

Build the backend:

```bash
npm run build
```

Start the compiled backend:

```bash
npm start
```

Seed the database:

```bash
npm run seed
```

Create the schema and seed the database:

```bash
npm run db:setup
```

### Frontend

Run the development server:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment variables

### Backend variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_PORT` | MySQL server port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_NAME` | MySQL database name | `task_management` |
| `JWT_SECRET` | Secret used to sign JWTs | Long random string |
| `JWT_EXPIRES_IN` | JWT expiration time | `1d` |
| `CLIENT_URL` | Allowed frontend origin | `http://localhost:5173` |

### Frontend variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## API endpoints

All protected endpoints require this header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication endpoints

#### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

#### Get the authenticated user

```http
GET /api/auth/me
```

Requires authentication.

### Task endpoints

#### Get dashboard statistics

```http
GET /api/tasks/dashboard/stats
```

Requires authentication.

#### Get tasks

```http
GET /api/tasks
```

Requires authentication.

Supported query parameters:

| Parameter | Supported values |
|---|---|
| `search` | Task title text |
| `status` | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `priority` | `LOW`, `MEDIUM`, `HIGH` |
| `sort` | `newest`, `oldest`, `dueDate` |

Example:

```http
GET /api/tasks?search=report&status=PENDING&priority=HIGH&sort=dueDate
```

#### Get one task

```http
GET /api/tasks/:id
```

Requires authentication.

#### Create a task

```http
POST /api/tasks
```

Requires authentication.

Request body:

```json
{
  "title": "Complete project documentation",
  "description": "Write setup and API documentation",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "dueDate": "2026-07-23"
}
```

#### Update a task

```http
PUT /api/tasks/:id
```

Requires authentication.

Example request body:

```json
{
  "status": "COMPLETED"
}
```

#### Delete a task

```http
DELETE /api/tasks/:id
```

Requires authentication.

## Task values

### Priority

```text
LOW
MEDIUM
HIGH
```

### Status

```text
PENDING
IN_PROGRESS
COMPLETED
```

## Validation

The backend validates incoming request data using Zod.

Examples of rejected data include:

- Missing email
- Invalid email
- Missing password
- Missing task title
- Missing due date
- Invalid task status
- Invalid task priority
- Invalid task ID

The frontend also performs basic form validation to provide immediate feedback.

## Security

The application includes:

- bcrypt password hashing
- JWT authentication
- Authenticated API routes
- Task ownership checks
- Environment-based secrets
- Parameterized SQL queries
- Request validation
- Centralized error handling
- CORS configuration

## Assumptions

- The assessment uses one seeded user because registration was not required.
- Each task belongs to exactly one authenticated user.
- Task due dates are stored as MySQL `DATE` values.
- The frontend stores the JWT in local storage for assessment simplicity.
- Pagination is not included because it was not required.
- Task search matches task titles.
- Overdue tasks are incomplete tasks with a due date before the current date.

## Known limitations

- There is no user registration screen.
- There is no password reset flow.
- There is no refresh-token implementation.
- There is no pagination.
- There are no file attachments.
- There are no task comments.
- There are no automated unit or integration tests.
- Local storage is used for JWT persistence.

## Production deployment

### Backend

Production backend URL:

```text
NOT_DEPLOYED_YET
```

### Frontend

Production frontend URL:

```text
NOT_DEPLOYED_YET
```

After deployment, replace the placeholder values with the real URLs.

Also update:

```env
CLIENT_URL=YOUR_PRODUCTION_FRONTEND_URL
```

and:

```env
VITE_API_BASE_URL=YOUR_PRODUCTION_BACKEND_URL/api
```

## Build verification

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

Both commands should complete without TypeScript errors.

## Author

```text
YOUR_NAME
```

Replace `YOUR_NAME` before submission.
