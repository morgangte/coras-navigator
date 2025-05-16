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

import os
from uuid import uuid4
import json

from model import *
from message import *

class DocumentExtension:
    CSV = "CSV"

class RAG:
    VECTOR_STORE_DOCUMENTS_RECORD = "./resource/vector-store/vector-store-documents.json"
    VECTOR_STORE_FOLDER = "./resource/vector-store/faiss-vector-store/"    

    vector_store = None
    embeddings = None
    documents: list[(str, DocumentExtension)]    

    def __init__(self, embedding_model: str):
        raise Exception("Invalid class: __init__() not implemented")

class NaiveRAG(RAG):
    def __init__(self, embedding_model: str):
        self.embeddings = OllamaEmbeddings(model=embedding_model)

    def load_documents(self, documents: list[(str, DocumentExtension)]) -> int:
        documents_paths = [path for (path, _) in documents]
        
        if is_list_equal_to_json_file_content(documents_paths, self.VECTOR_STORE_DOCUMENTS_RECORD):
            self.load_vector_store()
        else:
            self.create_vector_store()
            for path, extension in documents:
                self.load_document(path, extension)
            self.save_vector_store(documents_paths)        

        return self.vector_store.index.ntotal

    def create_vector_store(self):
        index = faiss.IndexFlatL2(len(self.embeddings.embed_query("hello world")))

        self.vector_store = FAISS(
            embedding_function=self.embeddings,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

    def save_vector_store(self, documents_paths):
        self.vector_store.save_local(
            folder_path=self.VECTOR_STORE_FOLDER
        )
        with open(self.VECTOR_STORE_DOCUMENTS_RECORD, "w") as file:
            json.dump(documents_paths, file)
        print(f"Saved Vector Store to {self.VECTOR_STORE_FOLDER}")   

    def load_vector_store(self):
        self.vector_store = FAISS.load_local(
            folder_path=self.VECTOR_STORE_FOLDER,
            embeddings=self.embeddings,
            allow_dangerous_deserialization=True # Load only self-created files
        )
        print(f"Loaded Vector Store from '{self.VECTOR_STORE_FOLDER}' (same documents)")   

    def load_document(self, path: str, extension: DocumentExtension) -> None:
        if extension != DocumentExtension.CSV:
            raise Exception("Document extension not supported")
        
        print(f"Loading document '{path}'...")

        loader = CSVLoader(file_path=path)
        documents = loader.load()
        
        # text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        # documents = text_splitter.split_documents(documents)
        
        uuids = [str(uuid4()) for _ in range(len(documents))]
        self.vector_store.add_documents(
            documents=documents,
            ids=uuids
        )
        
        print(f"Document {path} loaded ({len(documents)} entries).")
        
    def search(self, query: str, k: int=3):
        results = self.vector_store.similarity_search(
            query=query,
            k=3
        )
        results = '\n'.join([result.page_content for result in results])

        return results

def is_list_equal_to_json_file_content(data: list, file_path: str) -> bool:
    if not os.path.exists(file_path):
        return False

    with open(file_path, "r") as file:
        file_data = json.load(file)
        if sorted(file_data) == sorted(data):
            return True

    return False

