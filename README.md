# JobPortal 💼

A modern, highly polished, and feature-rich full-stack job application platform designed to connect candidate developers with recruiters.

---

## 🚀 Technology Stack

### Frontend
- **React (Vite)**: Fast, single-page application framework.
- **Zustand**: Lightweight, reactive state management.
- **TailwindCSS**: Sleek, premium utility-first CSS styling.
- **Lucide Icons & Sonner Toasts**: Micro-interactions, animations, and clean notification system.
- **Axios**: Standardized client API communicator with global interception.

### Backend
- **Node.js & Express**: Clean, modular API controllers, middleware layers, and routing.
- **PostgreSQL**: Robust relational database storage using `pg` pool queries.
- **Cloudinary**: File attachments manager (handling candidate resumes, profile photos, and recruiter company logos).
- **Multer**: Multi-part form data uploads compiler.

---

## ✨ Features

### 🔐 Authentication & Security
- Role-based account system (Candidate vs. Recruiter).
- Register & Login panels featuring Confirm Password checks and toggleable password visibility buttons.
- JWT-based authentication check on page reload to prevent premature session loss or route navigation glitches.

### 👨‍💻 Candidate Workspace
- **Dynamic Profile Management**: Edit full name, contact phone, biographical profile summary, skills keywords, years of experience, avatar photo, and PDF resume attachments.
- **Job Directory & Search**: Browse job listings with dynamic keywords filters (by title, location, salary levels, and job types).
- **Easy Applying**: Apply to positions with an optional cover note and attach either your saved profile resume or upload a fresh PDF.
- **Applications Status Tracker**: Real-time progress dashboard showing applied positions, company details, applied dates, and color-coded status badges (`applied`, `shortlisted`, `interviewing`, `rejected`).
- **Profile Initialization Guard**: Candidates are blocked from applying to jobs until their profile has been set up, redirecting them automatically to the profile page.

### 🏢 Recruiter Workspace
- **Company Branding**: Set up company name, logo, website, and company address coordinates.
- **Post a Job opening**: Write job details including requirements, locations, salary brackets, job types, and a custom list of required skills.
- **My Posted Jobs**: Manage all published roles with a clean dashboard and delete shortcuts.
- **Candidates Status Board**: Click on any active job listing to pop open a candidates modal, showing full applicant summaries, click-to-view resume links, and select dropdowns to update candidate statuses in real-time.

---

## 📁 Repository Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route controllers (auth, job, application, profile)
│   │   ├── middleware/    # Auth verification & role guards
│   │   ├── models/        # PostgreSQL raw queries & joins
│   │   ├── routes/        # Express REST routes
│   │   └── app.js         # Express app configurations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI widgets (JobCard, AuthSidebar, forms)
│   │   ├── pages/         # Page controllers (Home, Jobs, Profile, Auth, Apply)
│   │   ├── store/         # Zustand store handlers (useJobStore, useAuthStore)
│   │   └── App.tsx        # React routes & global layout
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisities
- **Node.js** (v16+)
- **PostgreSQL** (running locally or remotely)
- **Cloudinary Account** (for resume and image uploads)

### 1. Database Setup
Execute the SQL queries below in your PostgreSQL tool to establish the required tables:

```sql
-- Users Table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'recruiter')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Profiles Table
CREATE TABLE company_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  logo_url TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidate Profiles Table
CREATE TABLE candidate_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  skills TEXT[],
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary_min NUMERIC NOT NULL,
  salary_max NUMERIC NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  skills TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'interviewing', 'rejected');

CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  resume_url TEXT,
  status application_status DEFAULT 'applied',
  cover_note TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Config
1. Create a `backend/.env` file with the following variables:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<dbname>
   JWT_SECRET=your_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
2. Install dependencies & run backend dev server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### 3. Frontend Config
1. Setup local communicating URL inside `frontend/src/utils/axios.ts` or as configured (default is `/api`).
2. Install dependencies & launch Vite:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
