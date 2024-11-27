import sqlite3

# Путь к базе данных
db_path = "data/chunks.db"

# Подключение к базе данных
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Вывод таблиц
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", tables)

# Если таблица metadata существует, выводим содержимое
cursor.execute("SELECT * FROM metadata;")
rows = cursor.fetchall()

for row in rows:
    print(row)
    break

cursor.execute("SELECT m.id, tc.id, tc.file_path, tc.chunk_text FROM text_chunks tc LEFT JOIN metadata m ON tc.id==m.file_path WHERE m.id in (12, 886, 51479, 51478, 41455, 40257, 41458, 50514, 40256, 51625);")
rows = cursor.fetchall()

for row in rows:
    print(row)

# Закрываем соединение
conn.close()