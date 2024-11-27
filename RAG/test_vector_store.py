import faiss
import numpy as np

# Путь к вашему файлу индекса
index_path = r"data\vector_store.index"

# Загрузка индекса
index = faiss.read_index(index_path)

# Проверим, сколько векторов содержится в индексе
print(f"Number of vectors in the index: {index.ntotal}")

# Печать размерности векторов
print(f"Vector dimension: {index.d}")

# Чтение некоторых векторов (например, первых 5)
# Если индекс имеет векторы, они должны быть представлены как массивы numpy
if index.ntotal > 0:
    vectors = index.reconstruct_n(0, 5)  # Извлекаем первые 5 векторов
    print(f"First 5 vectors:\n{vectors}")

    # Печать размерности первых 5 векторов
    print(f"Shape of first vector: {vectors.shape}")
else:
    print("The index does not contain any vectors.")

# Например, если вы сохраняли метаданные в словарь `metadata`
metadata = {}  # Например, ваш словарь метаданных
metadata[0] = {'file_path': 'example.txt'}

# Выводим метаданные для первого вектора
chunk_id = 0  # Индекс вектора
print(f"Metadata for chunk {chunk_id}: {metadata.get(chunk_id)}")
