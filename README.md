# Skill Bridge API

Backend API for a tutoring platform where students can discover tutors, book sessions, and leave reviews.

## Tech Stack

- Node.js + TypeScript
- Express.js
- Prisma ORM (PostgreSQL)
- Better Auth (email/password auth + session handling)
- Zod
- pnpm
- tsup (build for deployment)

## Features

- Role-based access (`ADMIN`, `TUTOR`, `STUDENT`)
- Session-based authentication via Better Auth
- Tutor profiles and tutor subject management
- Availability slots for tutors
- Student booking flow with cancellation support
- Tutor reviews by students
- Dashboard statistics (role-aware + landing page stats)
- Category and subject management
- Admin user seeding script

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database

## Environment Variables

Create a `.env` file in the project root with:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
ADMIN_NAME=Admin Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password
```

## Installation and Local Development

```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```

Server starts on `http://localhost:5000` by default.

### Seed Admin User

After server is running, seed the admin account:

```bash
pnpm seed:admin
```

The script signs up the admin through Better Auth, then updates that user role to `ADMIN`.

## Available Scripts

- `pnpm dev` - run the API in watch mode
- `pnpm build` - generate Prisma client and build server bundle to `api/`
- `pnpm seed:admin` - create/update initial admin user

## Authentication

- Better Auth routes are mounted at: `/api/auth/{*any}`
- API v1 routes are mounted at: `/api/v1`
- Protected endpoints require a valid session (cookie-based)
- Authorization is role-based via middleware

## API Overview

Base URL: `http://localhost:5000/api/v1`

### Users

- `GET /users` - list users (supports filters/search/pagination)
- `GET /users/:userId` - get user details (`ADMIN`)
- `GET /users/public/:userId` - public tutor details by user id
- `PATCH /users/:userId/ban` - ban user (`ADMIN`)
- `PATCH /users/:userId/unban` - unban user (`ADMIN`)
- `PATCH /users/:userId` - update user (`ADMIN`, `TUTOR`, `STUDENT`)

### Tutors (Tutor Profiles)

- `POST /tutors/profile` - create tutor profile (`TUTOR`)
- `GET /tutors/my-profile` - get current tutor profile (`TUTOR`)
- `GET /tutors` - list tutors
- `GET /tutors/:tutorId` - get tutor details
- `PATCH /tutors/profile/:tutorProfileId` - update profile (`ADMIN`, `TUTOR`)
- `PUT /tutors/profile` - update profile (`ADMIN`, `TUTOR`)

### Categories

- `POST /categories` - create category (`ADMIN`)
- `GET /categories` - list categories (pagination enabled)

### Subjects

- `POST /subjects` - create subject
- `GET /subjects` - list subjects

### Availabilities

- `POST /availabilities` - create one or multiple availability slots (`TUTOR`)
- `DELETE /availabilities/:availabilityId` - delete slot (`TUTOR`)

### Tutor Subjects

- `POST /tutor-subjects` - add subject to tutor (`TUTOR`)
- `GET /tutor-subjects` - get current tutor subjects (`TUTOR`)
- `DELETE /tutor-subjects/:subjectId` - remove subject from tutor (`TUTOR`)

### Bookings

- `POST /bookings` - create booking (`STUDENT`)
- `GET /bookings` - list bookings (`STUDENT`, `TUTOR`, `ADMIN`)
- `GET /bookings/:bookingId` - booking details (`STUDENT`, `TUTOR`)
- `PATCH /bookings/:bookingId/cancel` - cancel booking (`STUDENT`)

### Reviews

- `POST /reviews` - create review (`STUDENT`)
- `GET /reviews` - list reviews (`STUDENT`)
- `GET /reviews/:reviewId` - review details (`STUDENT`)

### Dashboard

- `GET /dashboard/stats` - role-based dashboard stats (`ADMIN`, `TUTOR`, `STUDENT`)
- `GET /dashboard/landing-page-stats` - public landing statistics
