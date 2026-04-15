from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health

app = FastAPI()

# CORS - barcha manbalarga ruxsat
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
    return {"message": "SHATAI API"}

@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Salom {name}!"}