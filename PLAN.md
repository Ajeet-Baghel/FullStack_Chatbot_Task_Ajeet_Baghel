# DroneTV AI Support & Lead Assistant — Project Plan

## Goal
Build a responsive full-stack web application for DroneTV that includes an AI chatbot, an enquiry/lead form, a REST API, a PostgreSQL database, and a simple admin dashboard.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, `pg`
- **Database:** PostgreSQL
- **Version Control:** Git, GitHub

## Repository
`https://github.com/Ajeet-Baghel/FullStack_Chatbot_Task_Ajeet_Baghel`

## Commit Strategy
Create a meaningful commit after each completed epic / phase. Commit messages follow `Phase N: short description`.

## Epics & User Stories

### Epic 1 — Public Website
**As a** visitor, **I want** to explore DroneTV services and courses, **so that** I can understand what is offered.
- **US-1.1** View responsive landing, services, courses, and contact sections.
  - AC: Pages render on desktop, tablet, and mobile.
- **US-1.2** Submit an enquiry from a contact form.
  - AC: Name, email, phone, user type, interest, message are required and validated.
  - AC: Success and error messages are shown clearly.

### Epic 2 — AI Support Chatbot
**As a** visitor, **I want** to ask common questions in a chat, **so that** I get instant answers.
- **US-2.1** Ask predefined questions and receive bot replies.
  - AC: Supports: services, courses, contact, registration, service interest, student interest, speak with someone.
- **US-2.2** See a graceful fallback for unknown questions.
  - AC: Unknown inputs return a helpful "I didn't understand" response.
- **US-2.3** Reset the conversation.
  - AC: Clear/reset button clears session history.
- **US-2.4** Submit an enquiry through the chatbot.
  - AC: Same fields as contact form, validated, with success/error messages.

### Epic 3 — Enquiry Management (Backend)
**As a** system, **I want** to store and manage enquiries, **so that** admins can follow up.
- **US-3.1** Create an enquiry via `POST /api/enquiries`.
- **US-3.2** Read all / single enquiries via `GET /api/enquiries` and `GET /api/enquiries/:id`.
- **US-3.3** Update an enquiry via `PUT /api/enquiries/:id`.
- **US-3.4** Delete an enquiry via `DELETE /api/enquiries/:id`.
- **US-3.5** Validate all inputs on the backend.

### Epic 4 — Admin Dashboard
**As an** admin, **I want** to manage enquiries, **so that** I can track leads.
- **US-4.1** View all enquiries.
- **US-4.2** Search and filter by user type (Student / Customer / Other).
- **US-4.3** View full enquiry details.
- **US-4.4** Change enquiry status (New, Contacted, In Progress, Closed).
- **US-4.5** Delete an enquiry.

### Epic 5 — Security & Error Handling
**As a** user, **I want** my data handled safely, **so that** I trust the application.
- **US-5.1** Validate input on the frontend and backend.
- **US-5.2** Sanitize/escape user-generated content.
- **US-5.3** Never expose database credentials or internal error details.
- **US-5.4** Use environment variables for secrets.

### Epic 6 — Documentation & Delivery
**As a** reviewer, **I want** clear documentation, **so that** I can run and evaluate the project.
- **US-6.1** README with description, features, tech, structure, setup, env vars, DB setup, API endpoints, screenshots, run instructions, demo link.
- **US-6.2** Submission package: source code, screenshots, API docs, DB schema, GitHub link, video, resume.

## Milestones

| Milestone | Deliverables | Target |
|---|---|---|
| **M0 — Plan & Repo** | `PLAN.md`, `README.md`, `.gitignore`, git init, remote connected | Day 1, start |
| **M1 — Project Scaffold** | Client + server folders, package files, TS config, DB connection | Day 1, mid-morning |
| **M2 — Public Frontend** | Home, Services, Courses, Contact (responsive) | Day 1, afternoon |
| **M3 — Chatbot + Enquiry** | Predefined Q&A, fallback, reset, chat enquiry form | Day 1, evening |
| **M4 — Backend CRUD API** | PostgreSQL schema, full CRUD, validation, error handling | Day 2, morning |
| **M5 — Admin Dashboard** | View, search, filter, status change, delete | Day 2, afternoon |
| **M6 — Docs & Submission** | Final README, screenshots, video script, GitHub push | Day 2, evening |

## Phase Plan

### Phase 0 — Plan & Repo Setup
- Create `PLAN.md`, `README.md`, `.gitignore`
- Initialize local git repository
- Connect `origin` to GitHub
- Commit: `Phase 0: project plan and repository setup`

### Phase 1 — Project Scaffold
- `client/`: Vite React + TypeScript + Tailwind
- `server/`: Express + TypeScript + `pg`
- `.env.example` with PostgreSQL config
- Test `/api/health` DB connection
- Commit: `Phase 1: project scaffold and database connection`

### Phase 2 — Public Frontend Pages
- Landing / Home
- Services section
- Courses / Training section
- Contact / Enquiry form
- Responsive layout
- Commit: `Phase 2: public frontend pages`

### Phase 3 — Chatbot & Enquiry Form
- Chat UI with session history
- Predefined Q&A map and fallback
- Clear/reset conversation
- Enquiry submission inside chat
- Commit: `Phase 3: chatbot and enquiry form`

### Phase 4 — Backend CRUD API
- PostgreSQL `enquiries` table
- REST endpoints: `GET`, `GET /:id`, `POST`, `PUT`, `DELETE`
- Validation and error handling
- Commit: `Phase 4: backend CRUD API`

### Phase 5 — Admin Dashboard
- View enquiries
- Search and filter
- Update status
- Delete enquiry
- Commit: `Phase 5: admin dashboard`

### Phase 6 — Documentation & Delivery
- Complete `README.md`
- Add screenshots
- Prepare video walkthrough notes
- Final commit and push
- Commit: `Phase 6: final documentation and submission`

## Planned API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/enquiries` | Get all enquiries |
| GET | `/api/enquiries/:id` | Get single enquiry |
| POST | `/api/enquiries` | Create new enquiry |
| PUT | `/api/enquiries/:id` | Update enquiry |
| DELETE | `/api/enquiries/:id` | Delete enquiry |

## Planned Database Schema

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

## Notes
- Do not copy the existing DroneTV website.
- Keep error messages user-friendly; never expose stack traces or DB credentials.
- Use environment variables for all secrets.
