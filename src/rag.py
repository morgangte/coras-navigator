# Load documents
from langchain_community.document_loaders import CSVLoader
# Split documents
from langchain.text_splitter import RecursiveCharacterTextSplitter
# Vector Store
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
# Embeddings
from langchain_ollama import OllamaEmbeddings
# Save documents
from uuid import uuid4

from model import *
from message import *

class DocumentExtension:
    CSV = 1

class RAG:
    vector_store = None
    documents: list[(str, DocumentExtension)]    
    
    def __init__(self, embedding_model: str):
        raise Exception("Invalid class: __init__() not implemented")

class NaiveRAG(RAG):
    def __init__(self, embedding_model: str):
        embeddings = OllamaEmbeddings(model=embedding_model)
        index = faiss.IndexFlatL2(len(embeddings.embed_query("hello world")))
        
        self.vector_store = FAISS(
            embedding_function=embeddings,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

    def load_document(self, path: str, extension: DocumentExtension) -> None:
        if extension != DocumentExtension.CSV:
            raise Exception("Document extension not supported")
        
        print("Loading CSV document...")

        loader = CSVLoader(file_path=path)
        documents = loader.load()
         
        # text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        # documents = text_splitter.split_documents(documents)
        
        uuids = [str(uuid4()) for _ in range(len(documents))]

        self.vector_store.add_documents(
            documents=documents,
            ids=uuids
        )
        
        print(f"Documents loaded ({len(documents)} documents).")

    def search(self, query: str):
        print(f"Searching in the vector store for query: '{query}'")
        
        results = self.vector_store.similarity_search(
            query=query,
            k=3
        )
        results = '\n'.join([document.page_content for document in results])

        print(f"{Colors.WARNING}{results}{Colors.ENDC}")        

        return results



