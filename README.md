# Porter Clone --- Vehicle Booking System

## Project Overview

A full-stack vehicle booking system where employees request vehicles for
official work and administrators review, approve/reject, assign
vehicles, and complete bookings.

## Features

### Employee

-   Register/login
-   View available vehicles
-   Create booking
-   View own bookings
-   View booking details
-   Cancel eligible bookings

### Admin

-   Login
-   Dashboard
-   Manage vehicles
-   View all bookings
-   Approve/reject bookings
-   Assign vehicles
-   Complete bookings

## Technology Stack

Frontend: React, Vite, React Router, Axios, CSS\
Backend: Node.js, Express.js, Mongoose, JWT, bcryptjs, Helmet, CORS,
dotenv\
Database: MongoDB / MongoDB Atlas

**Assignment note:** The assignment asks for PostgreSQL, MySQL, or
SQLite. This implementation uses MongoDB/Mongoose. This deviation should
be disclosed during the final discussion.

## Booking Status Flow

``` text
PENDING → APPROVED → ASSIGNED → COMPLETED
PENDING → REJECTED
PENDING / APPROVED / ASSIGNED → CANCELLED
```

Completed and rejected bookings are final.

## Vehicle Assignment Rules

A vehicle can be assigned only if: 1. The booking is approved. 2. The
vehicle exists. 3. The vehicle is active. 4. Capacity is sufficient. 5.
The vehicle has no overlapping booking.

Overlap rule:

``` text
existing.start < requested.end
AND
existing.end > requested.start
```

## Validation

The backend handles required fields, date/time validation, capacity,
vehicle activity, overlapping assignments, cancellation rules, and
ownership checks.

## Authentication

JWT is sent as:

``` text
Authorization: Bearer <token>
```

Authentication middleware verifies the token and loads the user into
`req.user`. Role middleware protects admin operations.

## Main APIs

``` text
POST  /api/auth/register
POST  /api/auth/login

POST  /api/bookings
GET   /api/bookings/my
GET   /api/bookings/:id
PATCH /api/bookings/:id/cancel

GET   /api/bookings
PATCH /api/bookings/:id/approve
PATCH /api/bookings/:id/reject
PATCH /api/bookings/:id/assign-vehicle
PATCH /api/bookings/:id/complete

GET   /api/vehicles
GET   /api/vehicles/admin
POST  /api/vehicles
PUT   /api/vehicles/:id
PATCH /api/vehicles/:id/status
```

## Database Design

Collections: - Users - Vehicles - Bookings

A Booking references a User and may reference a Vehicle using MongoDB
ObjectIds.

## Setup

### Backend

``` bash
cd backend
npm install
```

`.env`:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

Run:

``` bash
npm run dev
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

Do not commit `.env`, passwords, or secrets.

## Testing Required by Assignment

1.  Create valid booking
2.  Reject invalid booking
3.  Assign available vehicle
4.  Prevent overlapping vehicle booking
5.  Cancel booking
6.  Complete booking

## Assumptions

-   Admin approval is required before assignment.
-   Only active vehicles can be assigned.
-   Vehicle capacity must satisfy the request.
-   Employees can access only their own bookings.
-   Completed bookings cannot be cancelled.
-   Rejected bookings are final.

## Future Improvements

-   PostgreSQL migration
-   More automated integration tests
-   Audit logs
-   Pagination/filtering
-   Standardized timezone handling
-   Production monitoring and logging
