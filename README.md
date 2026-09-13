# DroneTV AI Support & Lead Assistant

Full Stack Developer Internship technical assignment for IPAGE Group.

## Project Description
A responsive web application for DroneTV featuring an AI support chatbot, customer/student enquiry capture, a REST API, PostgreSQL persistence, and an admin dashboard.

## Features
- Landing / Home page
- Services and Courses sections
- Contact / Enquiry form
- Rule-based AI chatbot with conversation history
- Predefined question/answer support with fallback
- Lead collection with validation
- Full CRUD REST API
- Admin dashboard with search, filter, status update, and delete
- Responsive design for desktop, tablet, and mobile

## Technologies Used
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- PostgreSQL
- Git / GitHub

## Project Structure

```
FullStack_Chatbot_Task_Ajeet_Baghel/
├── client/                 # Vite React + TypeScript frontend
│   ├── src/
│   └── ...
├── server/                 # Express + TypeScript + PostgreSQL backend
│   ├── src/
│   └── ...
├── PLAN.md
├── README.md
└── .gitignore
```

## Setup Instructions

1. Clone the repository.
2. Create `server/.env` from `server/.env.example` and fill in your PostgreSQL credentials.
3. Install dependencies:
   - `cd client && npm install`
   - `cd server && npm install`
4. Create the PostgreSQL database `dronetv` and run the schema from `server/src/schema.sql`.
5. Start the backend: `cd server && npm run dev`
6. Start the frontend: `cd client && npm run dev`

## Environment Variables

Server `.env`:

```
PORT=5000
PGUSER=postgres
PGHOST=localhost
PGDATABASE=dronetv
PGPASSWORD=your_password
PGPORT=5432
```

## Database Setup

See `server/src/schema.sql` for the full schema. Example table:

```sql
CREATE TABLE enquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  interest VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'New' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/enquiries` | Get all enquiries |
| GET | `/api/enquiries/:id` | Get single enquiry |
| POST | `/api/enquiries` | Create new enquiry |
| PUT | `/api/enquiries/:id` | Update enquiry |
| DELETE | `/api/enquiries/:id` | Delete enquiry |

## Screenshots

To be added in Phase 6.

## Run Instructions

- Frontend: `npm run dev` inside `client/`
- Backend: `npm run dev` inside `server/`

## Live Demo

To be added in Phase 6.
