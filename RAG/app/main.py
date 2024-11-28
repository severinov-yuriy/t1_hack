from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, query

# Инициализация приложения
app = FastAPI(
    title="RAG Service",
    description="A Retrieval-Augmented Generation (RAG) Service for document-based Q&A",
    version="1.0.0"
    )

# Регистрация маршрутов
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(query.router, prefix="/api", tags=["Query"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Точка входа для проверки статуса
@app.get("/api/")
async def root():
    return {"message": "RAG Service is running"}
