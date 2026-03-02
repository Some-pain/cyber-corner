# CYBER CORNER - Digital Service Center

## Project Overview
Full-stack web application for CYBER CORNER, a digital service center in Gopiballavpur, Jhargram. Prop. - Prabir & Subham.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js + TypeScript (serves Vite middleware in dev, static files in prod)
- **Database**: PostgreSQL (Replit built-in) + Drizzle ORM
- **Auth**: JWT (HTTP-only cookies) + bcryptjs
- **File Upload**: Multer (PDF/JPG/PNG, max 5MB)

## Architecture
- `client/src/` - React frontend (pages, components, hooks, lib)
- `server/` - Express backend (routes, storage, db)
- `shared/` - Shared TypeScript types and Drizzle schema
- `script/` - Build scripts

## Key Features
1. **Public**: Homepage with services, notices, WhatsApp float button
2. **Service Request**: Form with file upload (documents)
3. **Track Request**: Track by phone number with status badges
4. **Admin Panel**: Protected dashboard, manage requests, manage notices
5. **Bilingual**: English + Bengali language toggle

## Default Admin Credentials
- Email: `admin@cybercorner.com`
- Password: `admin123`

## Dev Server
Runs on port 5000. Backend serves Vite middleware in development.
Workflow: `npm run dev` → port 5000

## Database Tables
- `admins` - Admin users
- `service_requests` - Customer service requests
- `notices` - Public notices

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (Replit built-in)
- `JWT_SECRET` - Optional (has fallback default)
- `PORT` - Server port (default 5000)

## Deployment
- Target: autoscale
- Build: `npm run build`
- Run: `node ./dist/index.cjs`

## Business Info
- Address: Gopiballavpur (In front of Yatra Maydan), Jhargram - 721506
- Phone: 9832450395 | 6297320156
- WhatsApp: 6297320156
