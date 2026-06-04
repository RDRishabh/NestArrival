# NestArrival 🏡✨

NestArrival is a secure arrival, housing verification, and tenant-owner matching platform designed to facilitate relocations (specifically targeting arrivals to Canada). It connects incoming tenants with property owners safely, utilizing identity/residency verification and subscription models to verify trust, prioritize matches, and prevent rental scams.

---

## 🛠️ Tech Stack Overview

- **Frontend**: Next.js (App Router, React 19, Tailwind CSS v4, Framer Motion, GSAP, Socket.io Client, Lucide icons, Recharts)
- **Backend**: Node.js, Express, Socket.io (for real-time chat), Multer (for document uploads), Nodemailer (for emails)
- **Database & ORM**: PostgreSQL (hosted on Neon) managed via Prisma ORM
- **Authentication**: JWT-based session security and Google OAuth2 integration

---

## 📂 Project Architecture & Directory Structure

The project is structured as a monorepo containing a separate `frontend` and `backend`:

```
NestArrival/
├── backend/                  # Express REST & WebSocket Server
│   ├── prisma/               # Database Schema and Seeding Scripts
│   │   ├── schema.prisma     # Master Prisma database schema
│   │   ├── seed.js           # Production system data seeding script
│   │   └── seed-dummy-data.js# Test dummy data seeding script
│   ├── uploads/              # Local storage folder for uploaded verification docs
│   ├── server.js             # Main server script (Express + Socket.io listener)
│   └── package.json          # Backend dependencies & scripts
│
├── frontend/                 # Next.js Web App
│   ├── prisma/               # Synced database schema (generated from backend schema)
│   ├── public/               # Public assets (icons, images)
│   ├── scripts/              # Helper utility scripts
│   │   └── sync-prisma.js    # Utility to copy backend schema to frontend
│   ├── src/                  # Next.js Source Code
│   │   ├── app/              # Next.js App Router (Routes & Pages)
│   │   └── components/       # Reusable global layout/UI components
│   └── package.json          # Frontend dependencies & scripts
│
└── .env                      # Core environment configuration
```

---

## 🌐 Website Route Structure

The Next.js App Router defines the following web page structure:

### Public Pages
- **Home (`/`)**: Main landing page with a hero banner, project vision, interactive steps explaining how the platform works, trending housing listings, founder's note, partners/affiliates section, and early access subscription forms.
- **About (`/about`)**: Detailed page detailing the NestArrival mission, core pillars of security, scam protection advisory, and a comprehensive FAQ accordion.
- **Contact (`/contact`)**: Customer support contact form.
- **Pricing (`/pricing`)**: Overview of membership packages, booster options (e.g., "Urgent Match"), and refund disclosures.
- **Policies (`/policies/[id]`)**: Dynamic CMS-based or static policy viewer for Terms of Service, Privacy Policies, and disclosure agreements.

### Authentication & Account
- **Login (`/login`)**: Supports traditional credentials login as well as Google OAuth login.
- **Signup (`/signup`)**: Supports user registration with role selection (Tenant vs. Owner).

### Tenant Space
- **Tenant Dashboard (`/tenant/dashboard`)**: Central hub for verified or pending tenants. Allows searching listings, viewing matching metrics, executing real-time chat with landlords, managing "Urgent Match" premium status, and submitting refund requests.
- **Tenant Verification (`/tenant/verification`)**: Secure portal to submit relocation details (planned move date, visa type, visa status, destination, residency status) and upload identity documentation.

### Owner Space
- **Owner Dashboard (`/owner/dashboard`)**: Interface for property owners/landlords to manage property listings (Draft, Pending Review, Approved, Rejected) with details such as rent, location, photos, bedroom/bathroom counts, and availability. Includes inbox for chatting with prospective tenants.
- **Owner Verification (`/owner/verification`)**: Portal for landlords to verify their identity and property credentials.

### Admin Space
- **Admin Dashboard (`/admin/dashboard`)**: Administrative console to manage platform metrics, review and approve/reject tenant and owner verification documents, audit listings, approve/reject listing publications, and process subscription refund claims.

---

## 🚀 Setup & Initiation Steps

Follow these sequential steps to run NestArrival locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18+ or v20+ recommended)
- **npm** (v9+ / v10+ recommended)
- A **PostgreSQL database instance** (e.g., Neon Postgres, or a local server)

### 2. Configure Environment Variables
You need to create a `.env` file at the root level, `backend/`, and `frontend/`. They should match or share relevant variables:

Create a `.env` file:
```env
# Database Connection URL (PostgreSQL)
DATABASE_URL="your-postgresql-connection-string"

# Force standard node-api libraries for Prisma
PRISMA_CLIENT_ENGINE_TYPE="library"
PRISMA_CLI_QUERY_ENGINE_TYPE="library"

# Custom Session Secret
JWT_SECRET="your-jwt-secure-session-key"

# Nodemailer SMTP Settings (Fill out to enable emails; leave empty/default for console mockup fallback)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_FROM="NestArrival Verification <no-reply@nestarrival.ca>"

# Google Authentication IDs (Required for Google Login)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

> 💡 **Note**: In `frontend/.env`, make sure to prepend the client ID with the prefix `NEXT_PUBLIC_`:
> `NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-oauth-client-id"`

---

### 3. Initialize the Backend
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database schema and seed the database with initial configurations and dummy data:
   ```bash
   npm run db:setup
   ```
   *This command maps the schema via Prisma, seeds required CMS pages/plans, and populates the database with test profiles/listings.*
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs by default on `http://localhost:5000` (or as configured in `server.js`).*

---

### 4. Initialize the Frontend
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   *Note: During `postinstall`, Node will run `scripts/sync-prisma.js` to sync the Prisma database schema from the backend and generate the Prisma Client bindings automatically.*
3. Perform database client setup locally on the frontend (if needed):
   ```bash
   npm run db:generate
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

---

## 📜 Development Scripts Index

### Backend Scripts
- `npm run dev`: Runs the Node backend using `nodemon` to watch for local updates.
- `npm run start`: Runs the Node server in production mode.
- `npm run db:setup`: Syncs the Prisma models to the database and seeds the configuration and mock data.

### Frontend Scripts
- `npm run dev`: Launches the Next.js development server.
- `npm run build`: Compiles the React/NextJS pages for production.
- `npm run start`: Boots the production-optimized frontend server.
- `npm run db:generate`: Syncs `schema.prisma` from the backend directory and recreates local Prisma client definitions.
- `npm run db:setup`: Pushes schema configurations and runs database seeding.
