import os
from datetime import datetime
from ollama import chat

from message import *
from model import *
from chat import *
from rag import *

def test_cli(model):
    chat = CLIChat(model)
    chat.start()
    chat.save(directory="chats")

def test_guardian(model):
    chat = GuardianChat(model)
    chat.start()
    chat.save()

def test_first_rag(chat_model, embedding_model):
    chat = FirstRAGChat(chat_model)
    if chat == None:
        print("Chat is None")
    chat.set_embedding_model(embedding_model)   
 
    DOCUMENT = "./rag-docs/capec-mechanisms-of-attack.csv"
    chat.load_documents(DOCUMENT, DocumentExtension.CSV)
    
    chat.start()
    chat.save()

if __name__ == "__main__":
    chat_model = OllamaModel("llama3:70b-instruct")
    embedding_model = "llama3:8b"
    test_first_rag(chat_model, embedding_model)

