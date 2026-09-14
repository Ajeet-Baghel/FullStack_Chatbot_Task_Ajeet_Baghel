# DroneTV AI Support & Lead Assistant — API Documentation

## Overview

The DroneTV API provides enquiry submission, enquiry management, health monitoring, and admin authentication.

- Production base URL: `https://fullstack-chatbot-task-ajeet-baghel.onrender.com`
- Content type: `application/json`
- Authentication: Signed HTTP-only admin session cookie

All request and response bodies use JSON unless stated otherwise.

## Authentication

Public users may create enquiries. Reading, updating, and deleting enquiries requires an authenticated admin session.

After a successful login, the server sends an HTTP-only cookie named `admin_session`. Browsers must include credentials in subsequent admin requests.

Example JavaScript request:

```javascript
fetch(`${API_URL}/api/enquiries`, {
  credentials: 'include'
})
```

## Data Models

### Enquiry

| Field | Type | Description |
|---|---|---|
| `id` | integer | Unique enquiry identifier |
| `name` | string | Customer or student name |
| `email` | string | Valid email address |
| `phone` | string | Ten-digit phone number |
| `user_type` | string | `Student`, `Customer`, or `Other` |
| `interest` | string | Selected service or course |
| `message` | string | Enquiry message |
| `status` | string | `New`, `Contacted`, `In Progress`, or `Closed` |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

### Enquiry Request

```json
{
  "name": "Ajeet Baghel",
  "email": "ajeet@example.com",
  "phone": "9876543210",
  "user_type": "Student",
  "interest": "Basic Drone Piloting",
  "message": "Please share the next course batch details."
}
```

## Health Endpoint

### Check API and Database Health

```http
GET /api/health
```

Authentication is not required.

#### Successful Response — `200 OK`

```json
{
  "status": "ok",
  "database": "connected"
}
```

#### Database Error — `500 Internal Server Error`

```json
{
  "status": "error",
  "database": "disconnected"
}
```

## Admin Authentication Endpoints

### Login

```http
POST /api/admin/login
```

Authentication is not required. A successful response creates an HTTP-only admin session cookie.

#### Request Body

```json
{
  "password": "admin-password"
}
```

#### Successful Response — `200 OK`

```json
{
  "authenticated": true
}
```

#### Missing Password — `400 Bad Request`

```json
{
  "message": "Password is required"
}
```

#### Invalid Password — `401 Unauthorized`

```json
{
  "message": "Invalid password"
}
```

#### Configuration Error — `500 Internal Server Error`

```json
{
  "message": "Admin authentication is not configured"
}
```

### Check Session

```http
GET /api/admin/session
```

Returns the current admin authentication state.

#### Response — `200 OK`

```json
{
  "authenticated": false
}
```

When a valid session cookie is present:

```json
{
  "authenticated": true
}
```

### Logout

```http
POST /api/admin/logout
```

Clears the admin session cookie.

#### Response — `200 OK`

```json
{
  "authenticated": false
}
```

## Enquiry Endpoints

### Create an Enquiry

```http
POST /api/enquiries
```

Authentication is not required.

#### Request Body

```json
{
  "name": "Ajeet Baghel",
  "email": "ajeet@example.com",
  "phone": "9876543210",
  "user_type": "Student",
  "interest": "Basic Drone Piloting",
  "message": "Please share the next course batch details."
}
```

#### Successful Response — `201 Created`

```json
{
  "id": 1,
  "name": "Ajeet Baghel",
  "email": "ajeet@example.com",
  "phone": "9876543210",
  "user_type": "Student",
  "interest": "Basic Drone Piloting",
  "message": "Please share the next course batch details.",
  "status": "New",
  "created_at": "2026-09-14T10:00:00.000Z",
  "updated_at": "2026-09-14T10:00:00.000Z"
}
```

#### Validation Error — `400 Bad Request`

```json
{
  "message": "All required fields must be filled."
}
```

Other possible validation messages:

- `Invalid email format.`
- `Phone number must be 10 digits.`
- `Invalid user type.`

### Get All Enquiries

```http
GET /api/enquiries
```

Admin authentication is required.

#### Successful Response — `200 OK`

```json
[
  {
    "id": 1,
    "name": "Ajeet Baghel",
    "email": "ajeet@example.com",
    "phone": "9876543210",
    "user_type": "Student",
    "interest": "Basic Drone Piloting",
    "message": "Please share the next course batch details.",
    "status": "New",
    "created_at": "2026-09-14T10:00:00.000Z",
    "updated_at": "2026-09-14T10:00:00.000Z"
  }
]
```

Results are ordered by creation time, newest first.

### Get One Enquiry

```http
GET /api/enquiries/:id
```

Admin authentication is required.

Example:

```http
GET /api/enquiries/1
```

#### Successful Response — `200 OK`

Returns one Enquiry object.

#### Not Found — `404 Not Found`

```json
{
  "message": "Enquiry not found"
}
```

### Update an Enquiry

```http
PUT /api/enquiries/:id
```

Admin authentication is required. Send all enquiry fields and the new status.

Example:

```http
PUT /api/enquiries/1
```

#### Request Body

```json
{
  "name": "Ajeet Baghel",
  "email": "ajeet@example.com",
  "phone": "9876543210",
  "user_type": "Student",
  "interest": "Basic Drone Piloting",
  "message": "Please share the next course batch details.",
  "status": "Contacted"
}
```

#### Successful Response — `200 OK`

Returns the updated Enquiry object.

#### Validation Error — `400 Bad Request`

```json
{
  "message": "Invalid status."
}
```

#### Not Found — `404 Not Found`

```json
{
  "message": "Enquiry not found"
}
```

### Delete an Enquiry

```http
DELETE /api/enquiries/:id
```

Admin authentication is required.

Example:

```http
DELETE /api/enquiries/1
```

#### Successful Response — `200 OK`

```json
{
  "message": "Enquiry deleted"
}
```

#### Not Found — `404 Not Found`

```json
{
  "message": "Enquiry not found"
}
```

## Shared Error Responses

### Authentication Required — `401 Unauthorized`

Returned when a protected endpoint is accessed without a valid admin session.

```json
{
  "message": "Authentication required"
}
```

### Internal Server Error — `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```

Internal database and server details are logged by the backend and are not exposed to API clients.

## Validation Rules

- `name`, `email`, `phone`, `user_type`, `interest`, and `message` are required.
- `email` must have a valid email format.
- `phone` must contain exactly ten digits.
- `user_type` must be `Student`, `Customer`, or `Other`.
- `status` must be `New`, `Contacted`, `In Progress`, or `Closed`.

## Endpoint Summary

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Check API and database health |
| `POST` | `/api/admin/login` | Public | Create an admin session |
| `GET` | `/api/admin/session` | Public | Check session status |
| `POST` | `/api/admin/logout` | Public | Clear the admin session |
| `POST` | `/api/enquiries` | Public | Create an enquiry |
| `GET` | `/api/enquiries` | Admin | List all enquiries |
| `GET` | `/api/enquiries/:id` | Admin | Get one enquiry |
| `PUT` | `/api/enquiries/:id` | Admin | Update an enquiry |
| `DELETE` | `/api/enquiries/:id` | Admin | Delete an enquiry |

## Security Notes

- Database credentials, the admin password hash, and the session secret are stored in backend environment variables.
- The plain admin password is never stored in the application.
- Admin session cookies are HTTP-only and secure in production.
- Database operations use parameterized PostgreSQL queries.
- Protected endpoints return `401 Unauthorized` without a valid session.
- Production requests must use HTTPS.
