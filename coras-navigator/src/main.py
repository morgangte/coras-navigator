import os
from datetime import datetime
from ollama import chat

from message import *
from model import *
from chat import *
from rag import *
from router import *
from formatter import *
from assessor import *
from navigator import *
from summarizer import *

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

DOCUMENTS_CWE = [(
        "./rag-docs/cwe-software-development.txt",
        DocumentExtension.TXT    
    ), (
        "./rag-docs/cwe-hardware-design.txt",
        DocumentExtension.TXT   
    ), (
        "./rag-docs/cwe-research-concepts.txt",
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

def test_coras_navigator():
    summarizer = SimpleSummarizer(OllamaModel("llama3:70b-instruct"))
    
    rag = ContextualRAG(embedding_model="llama3:8b", directory="./vector-stores/main/")
    documents_count = rag.load_documents(DOCUMENTS_TXT)
    print(f"The main vector store now contains {documents_count} entries.")    
    
    rag_cwe = NaiveRAG(embedding_model="llama3:8b", directory="./vector-stores/cwe/")
    documents_count = rag_cwe.load_documents(DOCUMENTS_CWE)
    print(f"The CWE vector store now contains {documents_count} entries.")    

    assessor = SimpleRiskAssessor(OllamaModel("llama3:70b-instruct"))

    template = """
        { 
            "vertices": [{ 
                "type": string,  
                "id": string,   
                "text": string     
            }],
            "edges": [{
                "source": string,
                "target": string,
                "vulnerabilities": [string]
            }]
        } 
        The rules you must follow to generate the JSON file are:
        - Vertices type can be "human_threat_accidental", "human_threat_deliberate", "non_human_threat", "threat_scenario", "unwanted_incident", or "asset"
        - Every vertices must have a type, an id and a text
        - Every edges must have a source and a target
        - A threat can initiate a threat scenario or an unwanted incident
        - A threat scenario can lead to an unwanted incident
        - An unwanted incident can impact an asset
        """
    formatter = SimpleJSONFormatter(OllamaModel("llama3:70b-instruct"), template)
    
    navigator = CorasNavigator(summarizer, rag, rag_cwe, assessor, formatter)
    navigator.start()    

if __name__ == "__main__":
    # test_first_rag(chat_model, embedding_model)
    # test_guardian_rag(chat_model, embedding_model)    
    # test_guardian_conditional_rag()   
    test_coras_navigator()
 
