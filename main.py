from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import health

app = FastAPI(
    title="Sihat AI Health Platform",
    description="Sun'iy intellekt asosidagi sog'liqni baholash platformasi",
    version="1.0.0"
)

# CORS sozlamalari
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routerlarni ulash
app.include_router(health.router)

# Frontend papkasini statik qilib ulash
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

@app.get("/")
def root():
    return {"message": "Sihat AI API ishga tushdi!"}

@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Salom {name}!"}