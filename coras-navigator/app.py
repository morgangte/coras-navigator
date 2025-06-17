from flask import Flask, request
from flask_cors import CORS
import os

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

summarizer = SimpleSummarizer("llama3:70b-instruct")
assessor = SimpleRiskAssessor("llama3:70b-instruct")
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
- Vertices type can be "human_threat_non_malicious" (a human threat with no malicious intent), "human_threat_malicious" (a human threat with malicious intent), "non_human_threat" (a threat that is not a human), "threat_scenario", "unwanted_incident", or "asset"
- Every vertices must have a type, an id and a text
- Every edges must have a source and a target
- A threat can initiate a threat scenario
- A threat scenario can lead to an other threat scenario or an unwanted incident
- An unwanted incident can impact an asset
- If the text describes multiple threat scenarios, break them down into as many vertices.

EXAMPLE: 
**Risk 1: Insider Attack on Tester Computer**

* **Threat:** Insider with access to tester computer
* **Consecutive Threat Scenarios:**
	1. The insider gains unauthorized access to the tester computer.
	2. The insider programs malicious firmware or credentials into the tester computer.
	3. The compromised tester computer injects the wearable sensor-patch with malicious firmware or credentials.
* **Unwanted Incident:** Injection of wearable sensor-patch with malicious firmware or credentials
* **Impacted Assets:** Health data, Wearable sensor-patch
* **Associated Vulnerabilities:** CWE-1073: Non-SQL Invokable Control Element with Excessive Number of Data Resource Accesses, CWE-140: Improper Neutralization of Delimiters.
Given the text qbove, you should answer with the following JSON:
{
    "edges": [
        {
            "source": "R1-T1",
            "target": "R1-TS1",
            "vulnerabilities": []
        },
        {
            "source": "R1-TS1",
            "target": "R1-TS2",
            "vulnerabilities": []
        },
        {
            "source": "R1-TS2",
            "target": "R1-TS3",
            "vulnerabilities": [
                "CWE-1073",
                "CWE-140"
            ]
        },
        {
            "source": "R1-TS3",
            "target": "R1-UI",
            "vulnerabilities": []
        },
        {
            "source": "R1-UI",
            "target": "health_data",
            "vulnerabilities": []
        },
        {
            "source": "R1-UI",
            "target": "wearable_sensor_patch",
            "vulnerabilities": []
        }
    ],
    "vertices": [
        {
            "id": "R1-T1",
            "text": "Insider with access to tester computer",
            "type": "human_threat_malicious"
        },
        {
            "id": "R1-TS1",
            "text": "The insider gains unauthorized access to the tester computer.",
            "type": "threat_scenario"
        },
        {
            "id": "R1-TS2",
            "text": "The insider programs malicious firmware or credentials into the tester computer.",
            "type": "threat_scenario"
        },
        {
            "id": "R1-TS3",
            "text": "The compromised tester computer injects the wearable sensor-patch with malicious firmware or credentials.",
            "type": "threat_scenario"
        },
        {
            "id": "R1-UI",
            "text": "Injection of wearable sensor-patch with malicious firmware or credentials",
            "type": "unwanted_incident"
        },
        {
            "id": "health_data",
            "text": "Health data",
            "type": "asset"
        },
        {
            "id": "wearable_sensor_patch",
            "text": "Wearable sensor-patch",
            "type": "asset"
        }
    ]
}
"""
formatter = SimpleJSONFormatter("llama3:70b-instruct", template)

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

