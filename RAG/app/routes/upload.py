import os
from fastapi import APIRouter, UploadFile, HTTPException
from core.document_processing import process_archive
from core.vectorization import TextVectorizer
from core.database import save_chunks_to_db
from core.vector_store import VectorStore

router = APIRouter()

# Путь для сохранения временных файлов
TEMP_FOLDER = "data/uploads"
DB_URL = "postgresql://postgres:password@database:5432/chunks_db"
MILVUS_HOST = "milvus"
MILVUS_PORT = "19530"
VECTOR_DIM = 384


@router.post("/upload/")
async def upload_archive(file: UploadFile):
    """
    Эндпоинт для загрузки архива документов.
    """
    # Создаем временную папку, если она не существует
    os.makedirs(TEMP_FOLDER, exist_ok=True)

    # Сохраняем загруженный файл
    archive_path = os.path.join(TEMP_FOLDER, file.filename)
    with open(archive_path, "wb") as f:
        f.write(await file.read())

    try:
        # Обрабатываем архив и получаем текстовые кусочки
        chunks = process_archive(archive_path, output_dir="data/extracted")

        # Инициализируем базу данных и сохраняем кусочки
        init_database(DB_URL)
        save_chunks_to_db(chunks, DB_URL)

        # Векторизация текста
        vectorizer = TextVectorizer()
        texts = [chunk["chunk_text"] for chunk in chunks]
        vectors = vectorizer.vectorize(texts)

        # Инициализируем векторное хранилище и индексируем кусочки
        vector_store = VectorStore(VECTOR_DIM, MILVUS_HOST, MILVUS_PORT, DB_URL)
        vector_store.add_vectors(vectors, [chunk["id"] for chunk in chunks])

        return {"message": "Archive processed successfully", "total_chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing archive: {str(e)}")
    finally:
        # Удаляем временный файл
        os.remove(archive_path)
