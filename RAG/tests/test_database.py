from core.database import save_chunks_to_db, fetch_all_chunks, fetch_chunks_by_ids


def test_database_operations(tmp_path):
    db_path = tmp_path / "test.db"

    chunks = [
        {"id": "chunk1", "file_path": "file1.txt", "chunk_text": "Example text chunk 1"},
        {"id": "chunk2", "file_path": "file2.txt", "chunk_text": "Example text chunk 2"}
    ]

    save_chunks_to_db(chunks, db_path)
    retrieved_chunks = fetch_chunks_by_ids(["chunk1", "chunk2"], db_path)

    assert len(fetch_all_chunks()) ==2
    assert retrieved_chunks[0]["chunk_text"] == "Test chunk 1"
