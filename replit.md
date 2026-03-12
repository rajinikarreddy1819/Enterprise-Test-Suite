# Doctor Verification and Emergency Prescription Portal

## Overview
A full-stack web application for doctor verification management. It allows medical professionals to apply for verification, administrators to manage applications, and the public to verify doctor credentials via search or QR code scanning. Verified doctors can also issue emergency prescriptions.

## Architecture
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Radix UI, Wouter (routing), TanStack Query
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL (Replit built-in) with Drizzle ORM
- **Validation**: Zod + drizzle-zod

## Key Features
- Public doctor search and credential verification
- QR code-based doctor verification
- Doctor application submission and status tracking
- Admin dashboard for managing applications and verification statuses
- Doctor dashboard for issuing emergency prescriptions
- Session-based authentication for doctors and admins

## Project Structure
- `shared/schema.ts` - Database schema and Zod types (users, doctors, applications, prescriptions, qr_scan_logs)
- `server/` - Express backend (index.ts, routes.ts, storage.ts, db.ts)
- `client/src/` - React frontend (pages, components, hooks)
- `script/build.ts` - Custom build script

## Deployment
- Target: Autoscale
- Build: `npm run build` → outputs to `dist/`
- Run: `node dist/index.cjs`
- Database: Replit PostgreSQL (DATABASE_URL env var)

## Development
- Run: `npm run dev` (tsx server/index.ts + Vite)
- DB migrations: `npm run db:push`
