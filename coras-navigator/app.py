from flask import Flask, render_template, request
from flask_cors import CORS

from model import *
from summarizer import *
from navigator import *

app = Flask(__name__)
CORS(app)

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

summarizer = SimpleSummarizer(OllamaModel("llama3:70b-instruct"))
    
rag = ContextualRAG(embedding_model="llama3:8b", directory="./vector-stores/main/")
rag_cwe = NaiveRAG(embedding_model="llama3:8b", directory="./vector-stores/cwe/")
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
    
navigator = CorasNavigatorUI(summarizer, rag, rag_cwe, assessor, formatter)

@app.route('/coras_navigator_api/generate_summary', methods=["GET", "POST"])
def generate_summary():
    if request.method != "POST":
        print("WARNING: Wrong request method")
        return
    
    json_data = request.get_json()
    print(f"Received JSON: {json_data}")
    
    summary = navigator.summarize(json_data['context-description'])

    return {
        'summary': summary
    }

@app.route('/coras_navigator_api/perform_analysis', methods=["GET", "POST"])
def perform_analysis():
    if request.method != "POST":
        print("WARNING: Wrong request method")
        return

    json_data = request.get_json()
    print(f"Received JSON: {json_data}")

    analysis, coras_json = navigator.perform_analysis(navigator.get_summary())
    
    return {
        'analysis': analysis,
        'coras': coras_json
    }

if __name__ == '__main__': 
    documents_count = rag.load_documents(DOCUMENTS_TXT)
    print(f"The main vector store now contains {documents_count} entries.")    
    
    documents_count = rag_cwe.load_documents(DOCUMENTS_CWE)
    print(f"The CWE vector store now contains {documents_count} entries.")    

    app.run(debug=True, port=5000)
