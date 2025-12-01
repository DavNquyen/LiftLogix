# LiftLogix

**Train smarter, eat better, stay consistent.**

LiftLogix is a full-stack web application that helps college students plan workouts, track meals, and stay accountable with friends. Fast logging, sensible defaults, and weekly insights that drive behavior change.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Migrations**: Alembic

## 📁 Project Structure

```
LiftLogix/
├── web/              # Next.js frontend
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/
│   │   ├── lib/      # API client & utilities
│   │   └── types/    # TypeScript types
│   └── package.json
│
├── api/              # FastAPI backend
│   ├── app/
│   │   ├── main.py   # FastAPI app
│   │   ├── models.py # Database models
│   │   ├── schemas.py # Pydantic schemas
│   │   ├── routes.py # API routes
│   │   ├── auth.py   # Authentication
│   │   ├── db.py     # Database config
│   │   └── config.py # Settings
│   ├── alembic/      # Database migrations
│   ├── seed.py       # Seed script
│   └── requirements.txt
│
└── ops/              # Infrastructure
    └── docker-compose.yml
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd LiftLogix
```

### 2. Start Infrastructure (PostgreSQL & Redis)

```bash
cd ops
docker compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

### 3. Set Up Backend

```bash
# Create Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r api/requirements.txt

# Set up environment variables
cp api/.env.example api/.env
# Edit api/.env if needed

# Run database migrations
cd api
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Seed the database with exercises
python seed.py

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### 4. Set Up Frontend

```bash
# In a new terminal
cd web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local if needed

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🎯 Features

### ✅ Implemented (MVP)

- **Authentication**: JWT-based auth with register/login
- **User Profiles**: Height, weight, units preferences
- **Exercise Catalog**: Pre-seeded database with 40+ exercises
- **Workout Logging**: Create workouts with sets (weight/reps/RPE)
- **Meal Logging**: Track meals with macros (calories, protein, carbs, fat)
- **Dashboard**: Overview with stats and quick actions
- **API Routes**: RESTful API with FastAPI
- **Database Models**: User, Exercise, Workout, Set, Meal, Plan

### 🚧 To Be Implemented

- **Starter Plans**: Beginner/Intermediate templates (Push/Pull/Legs, Upper/Lower)
- **Nutrition API**: Barcode scanning and food search
- **Social Features**: Friends, check-ins, feed
- **Weekly Recap**: Email summaries
- **Notifications**: Push notifications for reminders
- **Analytics**: Progress tracking and charts
- **Wearables**: Apple Health/Google Fit integration

## 🔑 Environment Variables

### Backend (`api/.env`)

```env
DATABASE_URL=postgresql://lift:lift@localhost:5432/liftlogix
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
REDIS_URL=redis://localhost:6379
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (`web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get tokens
- `GET /api/v1/auth/me` - Get current user

### Exercises
- `GET /api/v1/exercises` - List all exercises
- `POST /api/v1/exercises` - Create custom exercise

### Workouts
- `GET /api/v1/workouts` - List user's workouts
- `POST /api/v1/workouts` - Create new workout

### Meals
- `GET /api/v1/meals` - List user's meals
- `POST /api/v1/meals` - Log new meal

## 🧪 Development Commands

### Backend

```bash
# Activate virtual environment
source .venv/bin/activate

# Run API server
uvicorn app.main:app --reload --port 8000

# Create new migration
alembic revision --autogenerate -m "Description"

# Run migrations
alembic upgrade head

# Seed database
python api/seed.py
```

### Frontend

```bash
cd web

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database

```bash
# Start database
cd ops && docker compose up -d

# Stop database
cd ops && docker compose down

# View logs
cd ops && docker compose logs -f

# Reset database (⚠️ destructive)
cd ops && docker compose down -v
```

## 🔧 Troubleshooting

### Database connection issues

1. Ensure Docker is running
2. Check containers: `docker ps`
3. Restart: `cd ops && docker compose restart`

### Frontend can't connect to API

1. Verify API is running on port 8000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS origins are configured in `api/.env`

### Module import errors (Python)

1. Activate virtual environment: `source .venv/bin/activate`
2. Reinstall dependencies: `pip install -r api/requirements.txt`

## 📝 Development Notes

### Adding a New Database Model

1. Add model to `api/app/models.py`
2. Create migration: `alembic revision --autogenerate -m "Add model"`
3. Review and run: `alembic upgrade head`
4. Add Pydantic schemas to `api/app/schemas.py`
5. Add API routes to `api/app/routes.py`

### Adding a New Page

1. Create page in `web/src/app/`
2. Add to navigation in `web/src/components/DashboardNav.tsx`
3. Add API client methods in `web/src/lib/api.ts`
4. Add TypeScript types in `web/src/types/index.ts`

## 🎨 Tech Stack Details

- **Next.js 14**: React framework with App Router, Server Components
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Alembic**: Database migrations
- **Pydantic**: Data validation
- **JWT**: Token-based authentication
- **PostgreSQL**: Relational database
- **Redis**: Caching and queues (planned)

## 👥 Team

- David Nguyen (Author)

---

**Built with ❤️ for college students who want to train smarter and stay consistent.**
