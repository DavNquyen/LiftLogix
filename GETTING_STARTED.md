# Getting Started with LiftLogix

This guide will help you and your teammates get the LiftLogix mockup running quickly.

## 🎯 What's Been Built

This is a **basic mockup** of the LiftLogix app with a solid foundation for your team to build upon. It includes:

### ✅ Complete Features

1. **Full Project Structure**
   - Frontend (Next.js + TypeScript + Tailwind)
   - Backend (FastAPI + PostgreSQL + Redis)
   - Infrastructure (Docker Compose)

2. **Authentication System**
   - User registration and login (JWT-based)
   - Protected routes
   - Auth pages with forms

3. **Database & Models**
   - User, Exercise, Workout, Set, Meal, Plan models
   - Alembic migrations setup
   - Seed script with 40+ exercises

4. **API Endpoints**
   - `/api/v1/auth/*` - Authentication
   - `/api/v1/exercises` - Exercise catalog
   - `/api/v1/workouts` - Workout logging
   - `/api/v1/meals` - Meal tracking

5. **Frontend Pages**
   - Landing page with hero and features
   - Login/Register pages
   - Dashboard with navigation
   - Workouts, Meals, History, Profile pages (with placeholder UI)

6. **Developer Tools**
   - API client (`web/src/lib/api.ts`)
   - TypeScript types (`web/src/types/`)
   - Environment config templates
   - Comprehensive README

## 🚀 Quick Start (Easiest Method)

### Option 1: Use the Start Script

```bash
# Start everything with one command
./start.sh
```

This will:
- Start PostgreSQL and Redis (Docker)
- Set up Python environment
- Run database migrations
- Seed exercises
- Start FastAPI backend (port 8000)
- Start Next.js frontend (port 3000)

Visit `http://localhost:3000` to see the app!

### Option 2: Manual Start (Step by Step)

If the script doesn't work, follow these steps:

#### 1. Start Docker Services

```bash
cd ops
docker compose up -d
```

#### 2. Set Up Backend

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r api/requirements.txt

# Set up environment
cp api/.env.example api/.env

# Run migrations
cd api
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Seed database
python seed.py

# Start API
uvicorn app.main:app --reload --port 8000
```

#### 3. Set Up Frontend (New Terminal)

```bash
cd web

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start dev server
npm run dev
```

Visit:
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:8000/docs`

## 📁 Project Overview

### Key Directories

```
LiftLogix/
├── web/                    # Frontend (Next.js)
│   ├── src/app/           # Pages (App Router)
│   ├── src/components/    # React components
│   └── src/lib/           # API client
│
├── api/                   # Backend (FastAPI)
│   ├── app/              # Application code
│   ├── alembic/          # Database migrations
│   └── seed.py           # Database seeder
│
└── ops/                  # Infrastructure
    └── docker-compose.yml # PostgreSQL + Redis
```

### Key Files to Know

**Backend:**
- `api/app/main.py` - FastAPI app entry point
- `api/app/models.py` - Database models (SQLAlchemy)
- `api/app/routes.py` - API endpoints
- `api/app/auth.py` - JWT authentication
- `api/app/schemas.py` - Request/response schemas (Pydantic)

**Frontend:**
- `web/src/app/page.tsx` - Landing page
- `web/src/app/dashboard/page.tsx` - Main dashboard
- `web/src/lib/api.ts` - API client functions
- `web/src/types/index.ts` - TypeScript types
- `web/src/components/DashboardNav.tsx` - Navigation component

## 🛠️ What Your Team Should Build Next

This mockup provides the foundation. Here are suggested next steps:

### Phase 1: Make It Work (Week 1-2)
1. **Connect Auth Pages to API**
   - Wire up login/register forms
   - Store JWT tokens
   - Implement logout

2. **Implement Workout Logging**
   - Create workout form
   - Add sets dynamically
   - Save to API

3. **Implement Meal Logging**
   - Create meal form
   - Quick-add macros
   - Daily totals calculation

### Phase 2: Core Features (Week 3-4)
4. **Workout Plans**
   - Create plan templates
   - Assign to users
   - Auto-populate workouts

5. **Progress Tracking**
   - Add charts (Chart.js or Recharts)
   - Volume tracking
   - Personal records

6. **User Profile**
   - Edit profile info
   - Set goals
   - Preferences

### Phase 3: Advanced (Week 5+)
7. **Social Features**
   - Friend system
   - Activity feed
   - Comments/reactions

8. **Nutrition Integration**
   - Food search API
   - Barcode scanning
   - Favorites

9. **Notifications**
   - Email reminders
   - Push notifications (PWA)

## 🔑 Important Notes

### Environment Variables

**Backend** (`.env`):
- `DATABASE_URL` - PostgreSQL connection
- `SECRET_KEY` - JWT secret (change in production!)
- `CORS_ORIGINS` - Allowed frontend URLs

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Database

- PostgreSQL runs on port 5432
- Default credentials: `lift/lift`
- Database name: `liftlogix`
- Use `docker compose down -v` to reset (⚠️ deletes data)

### API Documentation

Visit `http://localhost:8000/docs` for:
- Interactive API testing (Swagger UI)
- Request/response schemas
- Authentication testing

## 🐛 Common Issues

### "Cannot connect to Docker daemon"
- Start Docker Desktop
- Check if Docker is running: `docker info`

### "Module not found" (Python)
- Activate virtual environment: `source .venv/bin/activate`
- Reinstall: `pip install -r api/requirements.txt`

### "Failed to fetch" (Frontend)
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in `api/.env`

### Port already in use
- Frontend (3000): `lsof -ti:3000 | xargs kill`
- Backend (8000): `lsof -ti:8000 | xargs kill`

## 📚 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Tailwind CSS**: https://tailwindcss.com/docs

## 🤝 Team Workflow Suggestions

1. **Use Git branches** for each feature
2. **Review the CLAUDE.md** spec regularly
3. **Update the README** as you build
4. **Assign features** from the OKRs
5. **Test locally** before merging

## 📞 Need Help?

- Check the main `README.md` for detailed docs
- Review `CLAUDE.md` for the original spec
- Inspect the code - it's well-commented!
- Use the API docs at `/docs` endpoint

---

**Good luck with your semester project! 🚀**
