from flask import Flask, request
from flask_cors import CORS
import os

from model import *
from summarizer import *
from navigator import *

app = Flask(__name__)
CORS(app)

UPLOADS_DIR = "uploaded-files"

DOCUMENTS_TXT = [(
        "./rag-docs/capec-mechanisms-of-attack.txt",
        DocumentExtension.TXT
    )]

DOCUMENTS_CWE = [(
        "./rag-docs/cwe-records.txt",
        DocumentExtension.TXT
    )]

summarizer = SimpleSummarizer(OllamaModel("llama3:70b-instruct"))
assessor = SimpleRiskAssessor(OllamaModel("llama3:70b-instruct"))
rag = ContextualRAG(embedding_model="llama3.2:3b", directory="./vector-stores/main/")
rag_cwe = NaiveRAG(embedding_model="llama3.2:3b", directory="./vector-stores/cwe/")

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
    - Vertices type can be "human_threat_non_malicious", "human_threat_malicious", "non_human_threat", "threat_scenario", "unwanted_incident", or "asset"
    - Every vertices must have a type, an id and a text
    - Every edges must have a source and a target
    - A threat can initiate a threat scenario or an unwanted incident
    - A threat scenario can lead to an unwanted incident
    - An unwanted incident can impact an asset
    """
formatter = SimpleJSONFormatter(OllamaModel("llama3:70b-instruct"), template)
    
navigator = CorasNavigatorUI(summarizer, rag, rag_cwe, assessor, formatter)

@app.route('/coras_navigator_api/upload_file', methods=["POST"])
def upload_file():
    if not os.path.exists(UPLOADS_DIR):
        os.makedirs(UPLOADS_DIR)

    if 'file' not in request.files:
        return {
            'error': 'No file'
        }, 400

    file = request.files['file']
    if file.filename == '':
        return {
            'error': 'No file selected'
        }, 400
    
    if file:
        filepath = os.path.join(UPLOADS_DIR, file.filename)
        file.save(filepath)
        return {
            'message': 'File uploaded successfully'
        }, 200

@app.route('/coras_navigator_api/remove_file', methods=["POST"])
def remove_file():
    json_data = request.get_json()
    filename = json_data['filename-to-remove']
    filepath = os.path.join(UPLOADS_DIR, filename)
    if not os.path.exists(filepath):
        return {
            'error': 'No such file'
        }, 400
    
    os.remove(filepath)
    return {
        'message': 'File removed successfully'
    }, 200

@app.route('/coras_navigator_api/generate_summary', methods=["POST"])
def generate_summary():
    # summary = navigator.summarize_files(UPLOADS_DIR)
    # print(f"Generated summary: {summary}")

    json_data = request.get_json()
    summary = navigator.summarize(json_data['context-description'])
    return {
        'summary': summary
    }

@app.route('/coras_navigator_api/perform_analysis', methods=["POST"])
def perform_analysis():
    json_data = request.get_json()
    print(f"Received JSON: {json_data}")

    analysis, coras_json = navigator.perform_analysis(navigator.get_summary())
    print(f"Generated CORAS Threat Model: {coras_json}")
    
    return {
        'analysis': analysis,
        'coras': coras_json
    }

if __name__ == '__main__': 
    documents_count = rag.load_documents(DOCUMENTS_TXT)
    print(f"The main vector store now contains {documents_count} entries.")    
    
    documents_count = rag_cwe.load_documents(DOCUMENTS_CWE)
    print(f"The CWE vector store now contains {documents_count} entries.")    

    app.run(debug=True, port=5050)

