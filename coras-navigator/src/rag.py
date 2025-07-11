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
    """
    A RAG module.

    Attributes:
    - VECTOR_STORE_DOCUMENTS_RECORD: The file containing the list of files used to populate the vector store
    - VECTOR_STORE_FOLDER:           The folder where the vector store is saved
    - vector_store:                  The vector store
    """

    VECTOR_STORE_DOCUMENTS_RECORD = "vector-store-documents.json"
    VECTOR_STORE_FOLDER = "faiss-vector-store/"

    def __init__(self, embedding_model: str, directory: str):
        raise Exception("Invalid class: __init__() not implemented")

    def search(self, query: str, k: int=3) -> list[str]:
        """
        Search and retrieves context from the vector store based on user query.

        Parameters:
        - query: The user query used for retrieval
        - k:     The number of records to retrieve

        Returns:
        - List of retrieved records from the vector store
        """

        raise Exception("Invalid class: search() not implemented")
    
    def load_files(self, files: list[(str, DocumentExtension)]) -> None:
        """
        Loads files to be used as sources for retrieval. If the saved vector store contained the same files, it is simply loaded from local storage. Otherwise, the vector store is created.

        Parameters:
        - files: List of files to load
        """

        filepaths = [path for (path, _) in files]
        
        if is_list_equal_to_json_file_content(filepaths, f"{self.directory}{self.VECTOR_STORE_DOCUMENTS_RECORD}"):
            self.__load_vector_store()
        else:
            self.__create_vector_store(files)
            self.__save_vector_store(filepaths)        

    def __create_vector_store(self, files: list[(str, DocumentExtension)]) -> None:
        """
        Creates a vector store from files.

        Parameters:
        - files: List of files to use
        """

        documents = []
        for path, extension in files:
            documents.extend(self.__get_documents_from_file(path, extension))

        self.vector_store = FAISS.from_documents(
            documents,
            self.embeddings
        )
        print(f"Successfully created the Vector Store with {len(documents)} documents")

    def __get_documents_from_file(self, path: str, extension: DocumentExtension) -> None:
        """
        Splits a file into Documents. The file should be pre-processed to list Documents between ";\n".

        Parameters:
        - path:      The path of the file to split
        - extension: The extension of the file
        """

        if extension not in [DocumentExtension.TXT]:
            raise Exception("Document extension not supported")
        
        print(f"Loading file '{path}'...")

        documents = []
        with open(path, "r") as file:
            documents = [Document(page_content=content) for content in file.read().split(";\n")]
            
        print(f"File '{path}' loaded ({len(documents)} documents).")
        return documents
 
    def __save_vector_store(self, filepaths: list[str]) -> None:
        """
        Saves the current vector store to local storage.

        Parameters:
        - filepaths: List of paths of the files used to populate the vector store
        """

        self.vector_store.save_local(
            folder_path=f"{self.directory}{self.VECTOR_STORE_FOLDER}"
        )
        with open(f"{self.directory}{self.VECTOR_STORE_DOCUMENTS_RECORD}", "w") as file:
            json.dump(filepaths, file)
        print(f"Saved Vector Store to {self.VECTOR_STORE_FOLDER}")   

    def __load_vector_store(self) -> None:
        """
        Loads a vector store from local storage.
        """

        self.vector_store = FAISS.load_local(
            folder_path=f"{self.directory}{self.VECTOR_STORE_FOLDER}",
            embeddings=self.embeddings,
            allow_dangerous_deserialization=True # WARNING: Load only self-created files (trusted)
        )
        print(f"Loaded Vector Store from '{self.directory}{self.VECTOR_STORE_FOLDER}' (same files)")   

class CapecRAG(RAG):
    """
    RAG module with re-ranking
    """

    def __init__(self, embedding_model: str, directory: str, complete_capec: (str, DocumentExtension)):
        self.embeddings = OllamaEmbeddings(model=embedding_model)
        self.directory = directory
        self.llm = ChatOllama(model="llama3:8b", temperature=0)
        
        complete_capec_file, extension = complete_capec
        if extension != DocumentExtension.JSON:
            raise Exception("Only JSON file are supported")

        self.complete_capec = self.__get_complete_capec(complete_capec_file)
 
    def __get_complete_capec(self, filename):
        capec_dict = {}
            
        with open(filename, "r") as json_file:
            capec_dict = json.load(json_file)

        return capec_dict   

    def search(self, query, k=6):
        results = self.vector_store.similarity_search(query=query, k=k)
        complete_results = ""
        for result in results:
            capec_id = get_capec_id_from_text(result.page_content)
            complete_results += self.complete_capec[capec_id]

        system_prompt = "You are a helpful assistant that determines whether given information items (delimited by '###') relates to a certain context (delimited by <context></context>) or not. You return the top 3 detailed capec entries that relate best to the context. For each capec entry you decide to return, copy all the details including the description, vulnerabilities (if there are any), and mitigations"
        human_prompt = """You will be given a context and information items. Return the top 3 detailed (just copy the description, vulnerabilities and mitigations) capec entries that relate best to the context.
Context:
<context>
{context}
</context>

Capec entries: 
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

