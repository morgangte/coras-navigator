# Load documents
from langchain_core.documents import Document
from langchain_community.document_loaders import CSVLoader
# Split documents
from langchain.text_splitter import RecursiveCharacterTextSplitter
# Vector Store
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
# Models
from langchain_ollama import ChatOllama, OllamaEmbeddings
# Retrievers
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

from langchain_core.prompts import ChatPromptTemplate

import os
from uuid import uuid4
import json

class DocumentExtension:
    CSV = "CSV"
    TXT = "TXT"
    PDF = "PDF"
    JSON = "JSON"

class RAG:
    VECTOR_STORE_DOCUMENTS_RECORD = "vector-store-documents.json"
    VECTOR_STORE_FOLDER = "faiss-vector-store/"
    directory: str
    vector_store = None
    embeddings = None
    documents: list[(str, DocumentExtension)]    

    def __init__(self, embedding_model: str, directory: str):
        raise Exception("Invalid class: __init__() not implemented")

    def search(self, query: str, k: int=3) -> list[str]:
        raise Exception("Invalid class: search() not implemented")

    def load_documents(self, documents: list[(str, DocumentExtension)]) -> int:
        documents_paths = [path for (path, _) in documents]
        
        if is_list_equal_to_json_file_content(documents_paths, f"{self.directory}{self.VECTOR_STORE_DOCUMENTS_RECORD}"):
            self.load_vector_store()
        else:
            self.create_vector_store()
            for path, extension in documents:
                self.load_document(path, extension)
            self.save_vector_store(documents_paths)        

        return self.vector_store.index.ntotal

    def create_vector_store(self) -> None:
        index = faiss.IndexFlatL2(len(self.embeddings.embed_query("hello world")))

        self.vector_store = FAISS(
            embedding_function=self.embeddings,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

    def save_vector_store(self, documents_paths) -> None:
        self.vector_store.save_local(
            folder_path=f"{self.directory}{self.VECTOR_STORE_FOLDER}"
        )
        with open(f"{self.directory}{self.VECTOR_STORE_DOCUMENTS_RECORD}", "w") as file:
            json.dump(documents_paths, file)
        print(f"Saved Vector Store to {self.VECTOR_STORE_FOLDER}")   

    def load_vector_store(self) -> None:
        self.vector_store = FAISS.load_local(
            folder_path=f"{self.directory}{self.VECTOR_STORE_FOLDER}",
            embeddings=self.embeddings,
            allow_dangerous_deserialization=True # WARNING: Load only self-created files (trusted)
        )
        print(f"Loaded Vector Store from '{self.directory}{self.VECTOR_STORE_FOLDER}' (same documents)")   

    def load_document(self, path: str, extension: DocumentExtension) -> None:
        if extension not in [DocumentExtension.CSV, DocumentExtension.TXT]:
            raise Exception("Document extension not supported")
        
        print(f"Loading document '{path}'...")

        if extension == DocumentExtension.CSV:
            loader = CSVLoader(file_path=path)
            documents = loader.load()
        elif extension == DocumentExtension.TXT:
            with open(path, "r") as file:
                documents = [Document(page_content=content) for content in file.read().split(";\n")]
            
        # text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        # documents = text_splitter.split_documents(documents)
        
        uuids = [str(uuid4()) for _ in range(len(documents))]
        self.vector_store.add_documents(
            documents=documents,
            ids=uuids
        )
        
        print(f"Document {path} loaded ({len(documents)} entries).")
 
class NaiveRAG(RAG):
    def __init__(self, embedding_model: str, directory: str):
        self.embeddings = OllamaEmbeddings(model=embedding_model)
        self.directory = directory
        
        if not os.path.exists(directory):
            os.makedirs(directory)

    def search(self, query: str, k: int=3) -> list[str]:
        results = self.vector_store.similarity_search(
            query=query,
            k=k
        )
        return [result.page_content for result in results]

class ContextualRAG(RAG):
    llm = None
    compressor = None
    compression_retriever = None

    def __init__(self, embedding_model: str, directory: str):
        self.embeddings = OllamaEmbeddings(model=embedding_model)
        self.directory = directory
        
        if not os.path.exists(directory):
            os.makedirs(directory)

    def initialize_retriever(self):
        self.llm = ChatOllama(
            model="llama3.2:3b",
            temperature=0
        )
        self.compressor = LLMChainExtractor.from_llm(self.llm)    
        self.compression_retriever = ContextualCompressionRetriever(
            base_compressor=self.compressor,
            base_retriever=self.vector_store.as_retriever()
        )

    def search(self, query: str, k: int=3) -> list[str]:
        if self.compression_retriever is None: 
            self.initialize_retriever()

        results = self.compression_retriever.invoke(query)
        return [result.page_content for result in results]

class CapecRAG(RAG):
    complete_capec = None
    llm = None

    def __init__(self, embedding_model: str, directory: str, complete_capec: (str, DocumentExtension)):
        self.embeddings = OllamaEmbeddings(model=embedding_model)
        self.directory = directory

        complete_capec_file, extension = complete_capec
        if extension != DocumentExtension.JSON:
            raise Exception("Only JSON file are supported")

        self.complete_capec = self.get_complete_capec(complete_capec_file)
 
    def initialize(self):
        self.llm = ChatOllama(
            model="llama3:8b",
            temperature=0
        )

    def get_complete_capec(self, filename):
        capec_dict = {}
            
        with open(filename, "r") as json_file:
            capec_dict = json.load(json_file)

        return capec_dict              

    def search(self, query, k=6):
        if self.llm is None:
            self.initialize()

        results = self.vector_store.similarity_search(query=query, k=k)
        complete_results = ""
        for result in results:
            capec_id = get_capec_id_from_text(result.page_content)
            complete_results += self.complete_capec[capec_id]

        system_prompt = "You are a helpful assistant that determines whether given information items (delimited by '###') relates to a certain context (delimited by <context></context>) or not. You return the top 3 information items that relate best to the context. For each information item you decide to return, copy all the details including the description, vulnerabilities (if there are any), and mitigations"
        human_prompt = """You will be given a context and information items. Return the top 3 detailed (just copy the description, vulnerabilities and mitigations) information items that relate best to the context.
Context:
<context>
{context}
</context>

Information items: 
###
{items}
###"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", human_prompt)
        ])
        chain = prompt | self.llm
        result = chain.invoke({
            "context": query,
            "items": complete_results
        })

        return [result.content]

def get_capec_id_from_text(text: str) -> str:
    return text.split('-')[1].split(']')[0]

def is_list_equal_to_json_file_content(data: list, file_path: str) -> bool:
    if not os.path.exists(file_path):
        return False

    with open(file_path, "r") as file:
        file_data = json.load(file)
        if sorted(file_data) == sorted(data):
            return True

    return False

