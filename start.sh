#!/bin/bash

# LiftLogix Quick Start Script
# This script helps you start the entire LiftLogix stack

set -e

echo "🚀 Starting LiftLogix..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Start infrastructure
echo "📦 Starting PostgreSQL and Redis..."
cd ops
docker compose up -d
cd ..

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
  echo "🐍 Creating Python virtual environment..."
  python3 -m venv .venv
fi

# Activate virtual environment and install dependencies
echo "📚 Installing Python dependencies..."
source .venv/bin/activate
pip install -q -r api/requirements.txt

# Run migrations if needed
echo "🗄️  Setting up database..."
cd api
if [ ! -d "alembic/versions" ] || [ -z "$(ls -A alembic/versions)" ]; then
  echo "Creating initial migration..."
  alembic revision --autogenerate -m "Initial migration" > /dev/null 2>&1 || true
fi
alembic upgrade head > /dev/null 2>&1 || true

# Seed database
echo "🌱 Seeding exercise catalog..."
python seed.py

cd ..

# Install frontend dependencies if needed
if [ ! -d "web/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd web
  npm install
  cd ..
fi

# Start backend in background
echo "🔧 Starting FastAPI backend..."
source .venv/bin/activate
cd api
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd web
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ LiftLogix is running!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; cd ops; docker compose down; echo '✅ All services stopped'; exit 0" INT

# Keep script running
wait
