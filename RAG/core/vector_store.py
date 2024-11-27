from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table, insert, select
from sqlalchemy.orm import sessionmaker
from typing import List, Tuple
import numpy as np

# Подключение к PostgreSQL
DATABASE_URL = "postgresql://user:password@postgres:5432/rag"

# SQLAlchemy Engine и Metadata
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Определение таблицы метаданных
metadata_table = Table(
    "metadata", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("file_path", String, nullable=False)
)

# Создаем таблицы, если их нет
metadata.create_all(engine)

# SQLAlchemy Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Milvus конфигурация
MILVUS_HOST = "milvus"
MILVUS_PORT = "19530"
VECTOR_COLLECTION_NAME = "text_vectors"

# Подключение к Milvus
connections.connect(alias="default", host=MILVUS_HOST, port=MILVUS_PORT)

# Определение коллекции в Milvus
fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=768)  # Задайте правильную размерность
]
schema = CollectionSchema(fields=fields, description="Collection for text embeddings")

# Создание коллекции, если она еще не создана
if not utility.has_collection(VECTOR_COLLECTION_NAME):
    collection = Collection(name=VECTOR_COLLECTION_NAME, schema=schema)
else:
    collection = Collection(name=VECTOR_COLLECTION_NAME)


class VectorStore:
    def __init__(self):
        """
        Инициализация VectorStore для работы с Milvus и PostgreSQL.
        """
        self.collection = collection

    def add_vectors(self, vectors: List[List[float]], metadata: List[str]) -> None:
        """
        Добавление векторов и метаданных в Milvus и PostgreSQL.
        :param vectors: Список векторов.
        :param metadata: Список метаданных (пути к файлам).
        """
        # Сохраняем метаданные в PostgreSQL
        session = SessionLocal()
        try:
            insert_stmt = insert(metadata_table).values([{"file_path": m} for m in metadata])
            session.execute(insert_stmt)
            session.commit()
        except Exception as e:
            session.rollback()
            print(f"Error saving metadata to Postgres: {e}")
        finally:
            session.close()

        # Сохраняем векторы в Milvus
        embeddings = np.array(vectors, dtype="float32")
        self.collection.insert([embeddings])
        self.collection.load()

    def search(self, query_vector: List[float], top_k: int = 10) -> List[Tuple[int, float, str]]:
        """
        Поиск ближайших соседей по вектору в Milvus и извлечение метаданных из PostgreSQL.
        :param query_vector: Вектор запроса.
        :param top_k: Количество ближайших соседей.
        :return: Список кортежей (id, расстояние, file_path).
        """
        query_np = np.array([query_vector], dtype="float32")

        # Выполняем поиск в Milvus
        results = self.collection.search(
            data=query_np,
            anns_field="embedding",
            param={"metric_type": "L2", "params": {"nprobe": 10}},
            limit=top_k
        )

        # Извлекаем идентификаторы найденных векторов
        ids = [hit.id for hit in results[0]]

        # Получаем метаданные из PostgreSQL
        session = SessionLocal()
        try:
            query = select(metadata_table).where(metadata_table.c.id.in_(ids))
            rows = session.execute(query).fetchall()
            metadata = {row.id: row.file_path for row in rows}
        except Exception as e:
            print(f"Error fetching metadata: {e}")
            metadata = {}
        finally:
            session.close()

        # Сопоставляем результаты поиска с метаданными
        return [
            (hit.id, hit.distance, metadata.get(hit.id, "Unknown"))
            for hit in results[0]
        ]

    def get_vector_count(self) -> int:
        """
        Получить количество векторов в коллекции Milvus.
        """
        return self.collection.num_entities
