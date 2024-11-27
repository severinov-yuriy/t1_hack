from core.rag import RAGPipeline
from core.api_clients import OpenAIAPIClient, CustomAPIClient, OpenRouterAPIClient

if __name__ == "__main__":
    VECTOR_STORE_PATH = "data/vector_store.index"
    DB_PATH = "data/chunks.db"
    QUERY = "How can I write an abstract class and what module or library I need to use"

    # Инициализация RAG-пайплайна
    rag = RAGPipeline(VECTOR_STORE_PATH, DB_PATH)

    # Использование OpenAI API
    openrouter_client = OpenRouterAPIClient(api_key="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")
    response_openrouter_client = rag.get_response(QUERY, openrouter_client, top_k=10, model="meta-llama/llama-3.1-70b-instruct:free")
    print("OpenRouter Response:", response_openrouter_client)

    # # Использование OpenAI API
    # openai_client = OpenAIAPIClient(api_key="your-openai-api-key")
    # response_openai = rag.get_response(QUERY, openai_client, top_k=10, model="gpt-4")
    # print("OpenAI Response:", response_openai)

    # # Использование кастомного API
    # custom_client = CustomAPIClient(base_url="https://custom-llm-api.com", api_key="your-custom-api-key")
    # response_custom = rag.get_response(QUERY, custom_client, top_k=10)
    # print("Custom API Response:", response_custom)
    
    
{
"query": "Hello! I need to implement abstract class, with method generate. How can I get it?",
"api_type": "openrouter",
"api_key": "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",
"api_url": "None",
"model_name": "meta-llama/llama-3.1-70b-instruct:free",
"top_k": 10
}