from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.diabetes import router as diabetes_router

# Initialize FastAPI app
app = FastAPI()

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8501",
        "http://127.0.0.1:8080",

    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(diabetes_router, prefix="/api/diabetes")


@app.get("/")
async def root():

    return {
        "message": "Diabetes Prediction API",
        "docs": "/api/docs",
        "health": "/api/diabetes/health"
    }


@app.get("/health")
async def health():
   
    return {"status": "ok", "service": "diabetes-prediction-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
