import os
from datetime import datetime
from ollama import chat

from message import *
from model import *
from chat import *
from rag import *
from router import *

DOCUMENTS = [(
        "./rag-docs/capec-mechanisms-of-attack.csv",
        DocumentExtension.CSV
    ), (
        "./rag-docs/capec-att_ck-related-patterns.csv",
        DocumentExtension.CSV
    ), (
        "./rag-docs/capec-domains-of-attack.csv",
        DocumentExtension.CSV
    )]

DOCUMENTS_TXT = [(
        "./rag-docs/capec-mechanisms-of-attack.txt",
        DocumentExtension.TXT
    )]

def test_cli(model):
    chat = CLIChat(model)
    chat.start()
    chat.save(directory="chats")

def test_guardian(model):
    chat = GuardianChat(model)
    chat.start()
    chat.save()

def test_first_rag():
    rag_module = NaiveRAG(
        embedding_model="llama3:8b"
    )
    documents_count = rag_module.load_documents(DOCUMENTS)
    print(f"The vector store now contains {documents_count} entries.")    
    
    chat_model = OllamaModel("llama3:70b-instruct")
    chat = FirstRAGChat(
        model=chat_model,
        rag_module=rag_module
    )
    chat.start()
    chat.save()

def test_guardian_rag():
    rag_module = NaiveRAG(
        embedding_model="llama3:8b"
    )
    documents_count = rag_module.load_documents(DOCUMENTS)
    print(f"The vector store now contains {documents_count} entries.")    
    
    chat_model = OllamaModel("llama3:70b-instruct")
    chat = GuardianRAGChat(
        model=chat_model,
        rag_module=rag_module
    )
    chat.start()
    chat.save() 

def test_guardian_conditional_rag():
    rag_module = NaiveRAG(
        embedding_model="llama3:8b"
    )
    documents_count = rag_module.load_documents(DOCUMENTS_TXT)
    print(f"The vector store now contains {documents_count} entries.")    
    
    chat_model = OllamaModel("llama3:70b-instruct")
    chat = GuardianConditionalRAGChat(
        model=chat_model,
        rag_module=rag_module
    )
    chat.start()
    chat.save() 

if __name__ == "__main__":
    # test_first_rag(chat_model, embedding_model)
    # test_guardian_rag(chat_model, embedding_model)    
    test_guardian_conditional_rag()   
 
    if False:
        model = OllamaModel("llama3:8b")
        router = SimpleRouter(model)
        message = "Generate a high-level risk table from the context description"
        print(f"Received: {router.should_retrieve(message)}")





