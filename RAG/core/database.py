from sqlalchemy import create_engine, Column, String, Text, Table, MetaData, select
from sqlalchemy.orm import sessionmaker
from typing import List, Dict

# Подключение к базе данных PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost:5432/rag"

# Создаем движок SQLAlchemy и метаданные
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Определение таблицы text_chunks
text_chunks = Table(
    "text_chunks", metadata,
    Column("id", String, primary_key=True),
    Column("file_path", String, nullable=False),
    Column("chunk_text", Text, nullable=False)
)

# Создаем таблицу в базе данных, если она еще не существует
metadata.create_all(engine)

# Создаем сессии для работы с базой данных
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def save_chunks_to_db(chunks: List[Dict[str, str]]) -> None:
    """
    Сохранение кусочков текста в базу данных.

    :param chunks: Список словарей с кусочками текста.
    """
    session = SessionLocal()
    try:
        for chunk in chunks:
            insert_stmt = text_chunks.insert().values(
                id=chunk["id"],
                file_path=chunk["file_path"],
                chunk_text=chunk["chunk_text"]
            ).on_conflict_do_nothing(index_elements=['id'])  # PostgreSQL upsert
            session.execute(insert_stmt)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error saving chunks: {e}")
    finally:
        session.close()


def fetch_all_chunks() -> List[Dict[str, str]]:
    """
    Извлечение всех кусочков текста из базы данных.

    :return: Список словарей с кусочками текста.
    """
    session = SessionLocal()
    try:
        query = select(text_chunks)
        rows = session.execute(query).fetchall()
        return [{"id": row.id, "file_path": row.file_path, "chunk_text": row.chunk_text} for row in rows]
    except Exception as e:
        print(f"Error fetching all chunks: {e}")
        return []
    finally:
        session.close()


def fetch_chunks_by_ids(ids: List[str]) -> List[Dict[str, str]]:
    """
    Извлечение кусочков текста по их идентификаторам.

    :param ids: Список идентификаторов.
    :return: Список словарей с кусочками текста.
    """
    session = SessionLocal()
    try:
        query = select(text_chunks).where(text_chunks.c.id.in_(ids))
        rows = session.execute(query).fetchall()
        return [{"id": row.id, "file_path": row.file_path, "chunk_text": row.chunk_text} for row in rows]
    except Exception as e:
        print(f"Error fetching chunks by IDs: {e}")
        return []
    finally:
        session.close()
