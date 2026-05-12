from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.api import health

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)

@app.get("/")
def root():
    return {"message": "Sihat AI API"}

@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Salom {name}!"}

@app.get("/api/status")
def status():
    return {
        "platform": "Sihat AI",
        "status": "online",
        "message": "Platforma ishlayapti"
    }

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")