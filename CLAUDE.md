LiftLogix — A Campus Fitness & Nutrition Coach
Course: CS 4624 (Fall 2025)
 Author: David Nguyen
 Date: September 17, 2025

1) Project Title & Description
Title: LiftLogix — Train smarter, eat better, stay consistent.
Description (1–2 paragraphs):
 LiftLogix is a full‑stack web application that helps college students plan workouts, track meals, and stay accountable with friends. It combines a simple logging experience, evidence‑based programming templates, and social nudges (check‑ins, streaks, and group challenges). The goal isn’t to be the most feature‑rich tracker—it’s to be the most consistent one: fast logging, sensible defaults, and weekly insights that drive behavior change.
Under the hood, LiftLogix provides a React/Next.js front end, a FastAPI REST backend, PostgreSQL for relational data (users, workouts, foods, goals), and a background worker for analytics and notifications. It integrates with an open nutrition database (USDA FoodData Central / OpenFoodFacts) to enrich barcode scans and macro targets. Over time, we’ll add wearable integrations (Apple Health/Google Fit) and personalized plans.

2) Problem Statement
Students juggle classes, jobs, and clubs. They want to get stronger and eat better but struggle with:
Friction: Logging workouts/meals takes too long; apps feel bloated.


Decision fatigue: Too many plans, not enough guidance or defaults.


Accountability: Fitness is social, yet most tools are solo.


We aim to reduce logging time to <20 seconds per workout set/meal, ship sensible starter plans, and make accountability effortless through friend check‑ins and streaks.

3) OKR (Objectives & Key Results)
End users: College students (18–26) who lift or want to start; campus rec center staff who may host group challenges.
Objective A — Make logging effortless (reduce friction)
KR A1: Median time to log a workout set ≤ 20s by end of MVP.


KR A2: Median time to log a meal ≤ 25s with barcode/quick‑add by Main Phase.


KR A3: ≥ 75% of first‑week users complete at least one full workout.


Objective B — Improve consistency (habit formation)
KR B1: Day‑7 retention ≥ 35%; Day‑28 retention ≥ 20%.


KR B2: Average weekly active users (WAU/MAU) ≥ 0.6 by end of semester.


KR B3: ≥ 40% of active users maintain a 7‑day streak at least once.


Objective C — Deliver actionable insight (not vanity charts)
KR C1: Weekly recap emails push a ≥ 10% uplift in next‑week workout completion.


KR C2: ≥ 80% of surveyed users report that “the recap helped me plan the next week.”


Solution Discovery (how we’ll learn)
Start with 8–12 student interviews + 2 rec‑center staff interviews.


Deploy weekly in small increments; instrument funnels (signup → first workout → second workout).


A/B test logging shortcuts (quick add vs template set) within the team.


Tradeoffs (discovery/solution)
Breadth vs depth: We’ll scope to strength training + macros (not cardio periodization) to ship faster.


AI plans vs curated templates: Start with curated beginner/intermediate templates; add personalization later to avoid cold‑start complexity.


Integrations: Barcode + nutrition API first; wearables later (stretch), because OAuth & health data privacy add overhead.



4) Workflow Diagram(s)
4.1 Core User Flows (ASCII)
[Landing] -> [Sign Up] -> [Onboarding: goals, experience]
              |                          |
              v                          v
        [Empty Dashboard] ----> [Starter Plan Suggested]
              |                          |
              v                          v
        [Quick Log Workout]      [Accept Plan & Start]
              |                          |
              v                          v
        [Log Meal (barcode)] <--- [Daily Checklist]
              |
              v
        [Weekly Recap & Nudge]

4.2 Logging Shortcut (Set Timer + Quick Add)
[Workout Screen]
   |-- Add Set (1 tap)
   |-- Auto rest timer starts
   |-- Weight/Reps prefilled from last session
   |-- Save (1 tap) -> next set queued

4.3 Social Accountability
[Friend Feed]
  |-- "David completed Push A"  
  |-- "You’re 1 workout away from a 7-day streak!"  
  |-- Join campus challenge -> weekly leaderboard


5) Technical Breakdown of Major Features
Legend: T‑shirt sizes — S (≤1 day), M (2–3 days), L (4–6 days), XL (1–2 weeks).
 Semester cadence (rough): Weeks 4–6 MVP, Weeks 7–12 Main, Weeks 13–14 Stretch/Polish.
5.1 MVP Phase (Weeks 4–6)
Auth & Profiles (JWT + email) — S–M


Register/login, password reset, basic profile (height/weight/units).


Acceptance: can create account, login persists via refresh token; unit settings respected.


Workout Logging (Core) — M–L


Exercises catalog, create workout, add sets (weight/reps/RPE), rest timer.


Acceptance: log ≥1 workout; recent weights/reps prefill; edit & delete sets.


Meal Logging (Quick Add) — M


Manual macros entry + favorites.


Acceptance: add breakfast/lunch/dinner; see daily macro totals.


Dashboard & History — M


Today view, last 7 days chart, streak indicator.


Acceptance: dashboard shows today’s plan and progress; history list.


Weekly Recap (Email) — M–L


Background job aggregates week → sends recap.


Acceptance: email delivered to test users Sunday 7pm.


MVP Exit Criteria: KRs A1/A3 instrumented; end‑to‑end logging and weekly recap live.
5.2 Main Build Phase (Weeks 7–12)
Starter Plans (Beginner/Intermediate) — M–L


Templates: Push/Pull/Legs, Upper/Lower; copy to user plan; progression rules.


Acceptance: select a plan; workouts auto‑populate; progression applies.


Nutrition Enrichment (API) — L


Food search via USDA FoodData Central or OpenFoodFacts; barcode lookup.


Acceptance: scan UPC → macros autofill; save to favorites.


Social: Friends & Check‑ins — L–XL


Follow friends, privacy controls, feed of completions, comments/reactions.


Acceptance: users can friend, see feed, react, and toggle visibility.


Notifications (Email + Push/PWA) — M–L


Reminders based on schedule/streak; web push via service worker.


Acceptance: opt‑in push; reminder fires at user’s chosen slot.


Analytics & Admin — M–L


Funnel dashboards, feature flags for experiments, simple admin panel.


Acceptance: see signup→first workout→week 1 metrics; toggle flags.


5.3 Stretch Goals (Weeks 13–14)
Wearables Integration — XL


Apple Health/Google Fit steps & heart rate import.


Acceptance: daily steps appear on dashboard; opt‑in OAuth.


Plan Personalization v1 — L–XL


Rule‑based adjustments (e.g., progression stalls → auto‑deload).


Acceptance: plan adapts after N sessions without progress.


Offline‑first/PWA Enhancements — M–L


Cache last 7 days; queue logs offline.


Acceptance: airplane‑mode logging syncs later.



6) Feature Requirements (structured samples)
FR‑01: Workout Logging
Description: Users can create a workout, add/edit/delete sets with weight/reps/RPE, and use a rest timer.


User Value: Fast logging drives consistency.


Assumptions: Exercises catalog exists; user authenticated.


Acceptance Criteria:


Add set in ≤2 taps (prefill previous).


Rest timer auto‑starts on save.


Undo last set within 10 seconds.


Accessible on mobile viewport (≤390px).


Dependencies: Auth, Exercises table.


FR‑02: Meal Logging with Quick Add
Description: Add meals via quick macros or search/barcode (Main Phase).


Acceptance Criteria:


Enter macros manually (MVP); save as favorite.


Search API/barcode fills macros (Main); user can edit and save.


Daily totals update immediately.


FR‑03: Weekly Recap
Description: Summarizes workouts, volume PRs, streaks, and nutrition adherence.


Acceptance Criteria:


Sends Sunday 7pm local time.


Includes next‑week suggestion (e.g., schedule or deload prompt).


Click‑through opens “Plan Next Week” modal.


(Additional FRs listed in backlog appendix.)

7) Architecture Diagram(s) & Technical Overview
7.1 High‑Level Architecture (ASCII)
[ Web / Mobile Browser ]
        |
        v
[ Next.js (React) ] --(REST/JSON)--> [ FastAPI (Python) ] -- SQLAlchemy --> [ PostgreSQL ]
        |                                     |
        |                                     +--> [ Redis ] (caching, sessions, rate limits)
        |                                     |
        |                                     +--> [ Celery Worker ] --(SMTP/API)--> [ Email/Push ]
        |                                                     |
        |                                                     +--> [ Analytics Jobs ]
        |
        +--> [ Service Worker ] (PWA, push, offline cache)

7.2 Technologies (initial picks)
Frontend: Next.js (React), TypeScript, Vite or Next build, Tailwind CSS, PWA service worker.


API/Middleware: FastAPI (Python), Pydantic, Uvicorn/Gunicorn, REST (JSON).


Backend/DB: PostgreSQL (relational), SQLAlchemy + Alembic migrations; Redis for caching/queues.


Background: Celery + Redis; APScheduler for cron‑like jobs (weekly recap).


Auth: JWT (access + refresh), email verification + reset via signed links.


Integrations: Nutrition data (USDA FoodData Central or OpenFoodFacts) for search/barcode.


Infra: Docker Compose for local; Render/Fly.io/DigitalOcean App Platform for staging; S3‑compatible object storage for exports (if needed).


Observability: OpenTelemetry traces (basic), structured logging, Sentry for errors.


7.3 Data Model (sketch)
User(id, email, password_hash, name, height_cm, weight_kg, units, created_at)
Friendship(user_id, friend_id, status)
Exercise(id, name, muscle_group, is_user_defined)
Workout(id, user_id, plan_id, date, notes)
Set(id, workout_id, exercise_id, weight, reps, rpe, created_at)
Meal(id, user_id, date, type, calories, protein_g, carbs_g, fat_g)
FoodFavorite(id, user_id, name, brand, upc, macros_json)
Plan(id, user_id|null, template_key, name, level, split, progression_rules_json)
CheckIn(id, user_id, type, payload_json, created_at)
Notification(id, user_id, channel, payload_json, sent_at)
FeatureFlag(key, is_enabled)

7.4 Tradeoffs (tech/frameworks)
PostgreSQL vs MongoDB: Workouts/meals are naturally relational with joins and constraints → Postgres. Mongo would simplify flexible documents but complicate strong reporting/analytics.


FastAPI (Python) vs Node/Express: Team familiarity with Python; Pydantic types are great for contracts. Node offers a single‑language stack but we value Python’s ecosystem for data/ML later.


REST vs GraphQL: REST is simpler to ship and cache; GraphQL could come later for mobile app flexibility.


Next.js vs pure React SPA: Next enables SSR/ISR for faster first paint and good SEO; SPA is simpler but worse for performance on low‑end phones.


Celery+Redis vs CRON only: Background queues scale better for emails/analytics; CRON alone is brittle.



8) Estimates & Timeline
MVP (Wks 4–6): Auth (S–M), Workout logging (M–L), Meal quick‑add (M), Dashboard (M), Weekly recap (M–L).
 Main (Wks 7–12): Starter plans (M–L), Nutrition API (L), Social (L–XL), Notifications (M–L), Analytics/Admin (M–L).
 Stretch (Wks 13–14): Wearables (XL), Personalization (L–XL), Offline‑first (M–L).
Risk buffer: 1 week total across Main/Stretch.

9) Risks & Mitigations
Scope creep: Keep strict MVP; anything not improving logging time or consistency moves to backlog.


Data quality (nutrition): Choose one API first; build override/edit path for users.


Privacy: No health diagnoses; clear privacy settings; minimal PII; encrypted passwords; rotate secrets.


Engagement: Instrument funnels and iterate weekly on biggest drop‑offs.



10) Deliverables
Proposal Document (this file) with all required sections and diagrams.


5‑Minute Video (outline & script below).


10.1 Video Plan (5:00)
0:00–0:30 — Hook: “Logging shouldn’t be homework. LiftLogix makes it <20 seconds.”


0:30–1:15 — Problem & Users: Friction, decision fatigue, accountability; target campus lifters.


1:15–2:15 — Demo Flow (mock): Signup → quick log → barcode meal → streaks → weekly recap.


2:15–3:15 — Architecture: Next.js + FastAPI + Postgres + Redis/Celery. Show ASCII diagram; call out tradeoffs.


3:15–4:15 — Roadmap & OKRs: MVP/Main/Stretch; key KRs (time‑to‑log, retention, streaks).


4:15–5:00 — Ask: What excites you? Who wants to own Social vs Plans vs Analytics?


Slide list: Title, Problem, Users & OKRs, Workflows, Architecture, Phases/Estimates, Risks, Call‑to‑Action.
Recording tips: 720p+ screen‑share, 16:9 slides, large cursor, live click‑through of a Figma mock if available.

11) Appendix — Initial Setup Plan (exact steps)
These steps create a working skeleton by end of Week 4.
11.1 Repos & Project
Create GitHub org liftlogix.


Repos: web (Next.js), api (FastAPI), ops (compose/deploy).


11.2 Local Dev (from project root)
# 1) Clone
mkdir liftlogix && cd liftlogix

# 2) Frontend
npx create-next-app@latest web --ts --eslint --src-dir --app --tailwind
cd web && npm i && cd ..

# 3) Backend
python3 -m venv .venv && source .venv/bin/activate
pip install fastapi uvicorn[standard] sqlalchemy alembic psycopg2-binary pydantic-settings python-jose passlib[bcrypt] celery redis apscheduler
mkdir -p api/app && touch api/app/{main.py,models.py,schemas.py,db.py,auth.py,routes.py}

# 4) Docker Compose (ops)
mkdir ops && cat > ops/docker-compose.yml <<'YAML'
version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: lift
      POSTGRES_PASSWORD: lift
      POSTGRES_DB: liftlogix
    ports: ["5432:5432"]
    volumes: [db_data:/var/lib/postgresql/data]
  redis:
    image: redis:7
    ports: ["6379:6379"]
volumes:
  db_data:
YAML

# 5) Run infra
cd ops && docker compose up -d && cd ..

# 6) Backend dev server (from repo root)
source .venv/bin/activate
uvicorn api.app.main:app --reload --port 8000

# 7) Frontend dev server
cd web && npm run dev

11.3 Minimal FastAPI skeleton (api/app/main.py)
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True}

11.4 Minimal Next.js call (client page)
// web/app/page.tsx
export default async function Home() {
  const res = await fetch("http://localhost:8000/health", { cache: "no-store" });
  const data = await res.json();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">LiftLogix</h1>
      <pre className="mt-4">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}

11.5 Next Steps (Week 4 checklist)
Add User model + JWT auth endpoints.


Create Exercise, Workout, Set tables with Alembic migration.


Implement workout logging route + simple UI page.


Instrument event timing (time‑to‑log) via simple client timestamps.



12) Summary
LiftLogix focuses on the boring-but-hard parts of fitness: fast logging, smart defaults, and friendly nudges. It’s technically appropriate for a semester team (React/Next + FastAPI + Postgres + Redis) with clear OKRs, diagrams, and a staged roadmap. The result is a production‑shaped app that can actually help students train better—together.