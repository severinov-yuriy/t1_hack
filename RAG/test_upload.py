from core.document_processing import process_archive
from core.database import init_database, save_chunks_to_db, fetch_all_chunks
from core.vectorization import TextVectorizer
from core.vector_store import VectorStore

if __name__ == "__main__":
    archive_path = "data/documents.zip"
    output_dir = "data/extracted"
    vector_dim = 384  # Размерность модели "all-MiniLM-L6-v2"

    # Инициализация базы данных
    init_database()

    # Обработка архива
    chunks = process_archive(archive_path, output_dir)
    save_chunks_to_db(chunks)

    # Векторизация текста
    vectorizer = TextVectorizer()
    texts = [chunk["chunk_text"] for chunk in chunks]
    vectors = vectorizer.vectorize(texts)

    # Сохранение векторов в векторное хранилище
    vector_store = VectorStore(vector_dim)
    vector_store.add_vectors(vectors, [chunk["id"] for chunk in chunks])
    vector_store.save_index()

    print(f"Processed and vectorized {len(chunks)} chunks.")
