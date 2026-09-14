# DroneTV Database Setup Instructions

## Database

The application uses PostgreSQL. The schema file is located at `server/src/schema.sql`.

## Prerequisites

- PostgreSQL installed locally, or a managed PostgreSQL database such as Render PostgreSQL
- `psql` command-line client or pgAdmin
- Database connection credentials

## Local PostgreSQL Setup

### 1. Create the database

Using `psql`:

```sql
CREATE DATABASE dronetv;
```

### 2. Apply the schema

Run this command from the project root:

```bash
psql -U postgres -d dronetv -f server/src/schema.sql
```

Enter your PostgreSQL password when prompted.

### 3. Configure the backend

Create `server/.env` from `server/.env.example` and set:

```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=dronetv
PGPASSWORD=your_postgresql_password
PGPORT=5432
PGSSL=false
```

Do not commit `server/.env`.

## Render PostgreSQL Setup

### 1. Create the database

1. Open the Render dashboard.
2. Select **New > PostgreSQL**.
3. Create a database in the same region as the backend web service.
4. Wait until the database status is **Available**.

### 2. Configure the Render backend

Add these environment variables to the Render web service:

```env
DATABASE_URL=your_render_internal_database_url
PGSSL=true
```

Use the Internal Database URL for communication between services on Render. Never commit or publicly share the URL because it contains credentials.

### 3. Apply the schema with `psql`

Copy the External Database URL from Render and run:

```bash
psql "your_render_external_database_url" -f server/src/schema.sql
```

Use the External Database URL only when connecting from your computer.

### 4. Apply the schema with pgAdmin

1. Register a new server in pgAdmin.
2. Enter the external hostname, port, database, username, and password supplied by Render.
3. Set SSL mode to `Require`.
4. Open **Query Tool** for the database.
5. Open `server/src/schema.sql`, copy its contents, and execute the query.

## Schema

The schema creates an `enquiries` table with these columns:

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `name` | `VARCHAR(255)` | Required |
| `email` | `VARCHAR(255)` | Required |
| `phone` | `VARCHAR(50)` | Required |
| `user_type` | `VARCHAR(50)` | Required |
| `interest` | `VARCHAR(255)` | Required |
| `message` | `TEXT` | Required |
| `status` | `VARCHAR(50)` | Required, defaults to `New` |
| `created_at` | `TIMESTAMP` | Defaults to current time |
| `updated_at` | `TIMESTAMP` | Defaults to current time |

## Verification

Confirm that the table exists:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'enquiries';
```

Inspect its columns:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'enquiries'
ORDER BY ordinal_position;
```

Confirm that queries work:

```sql
SELECT * FROM enquiries ORDER BY created_at DESC;
```

An empty result is valid before enquiries are submitted.

## Backend Verification

Start the backend and request:

```http
GET /api/health
```

A successful connection returns:

```json
{
  "status": "ok",
  "database": "connected"
}
```

Then submit an enquiry using `POST /api/enquiries`. A successful insertion returns HTTP `201 Created`.

## Troubleshooting

- **Database disconnected:** Verify credentials, hostname, port, and SSL settings.
- **Relation `enquiries` does not exist:** Apply `server/src/schema.sql` to the selected database.
- **Authentication failed:** Confirm the database username and password.
- **Connection timeout:** Confirm network access and use the provider's external URL from your computer.
- **SSL error:** Set `PGSSL=true` for providers that require encrypted connections.
