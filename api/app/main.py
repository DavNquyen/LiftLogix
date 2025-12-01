from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .config import get_settings
from .routes import router

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for progress photos
upload_dir = Path("uploads")
if upload_dir.exists():
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routes
app.include_router(router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "LiftLogix API"}
