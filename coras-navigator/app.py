from flask import Flask, request
from flask_cors import CORS
import os

from summarizer import *
from navigator import *

app = Flask(__name__)
CORS(app)

summarizer = SimpleSummarizer("llama3:70b-instruct")
assessor = SimpleRiskAssessor("llama3:70b-instruct")
rag = CapecRAG(
    embedding_model="nomic-embed-text:latest", 
    directory="./vector-stores/main/", 
    complete_capec=(
        "./rag-docs/capec-detailed.json",
        DocumentExtension.JSON    
    )
)
formatter = SimpleJSONFormatter("llama3:70b-instruct")

navigator = CorasNavigator(summarizer, rag, assessor, formatter)

@app.route('/coras_navigator_api/generate_summary', methods=["POST"])
def generate_summary():
    json_data = request.get_json()
    # print(f"Received JSON: {json_data}")

    summary = navigator.summarize(json_data['context-description'])
    return {
        'summary': summary
    }

@app.route('/coras_navigator_api/generate_risks', methods=["POST"])
def generate_risks():
    json_data = request.get_json()
    # print(f"Received JSON: {json_data}")

    print("Retrieve context...")
    context = navigator.retrieve(json_data['summary'])
    # print(f"Retrieved context: \n{context}")

    print("Identifying risks...")
    analysis = navigator.assess_risks(json_data['summary'], context)
 
    return {
        'analysis': analysis,
        'retrieved-context': context,
    }

@app.route('/coras_navigator_api/generate_coras_model', methods=["POST"])
def generate_coras_model():
    json_data = request.get_json()
    # print(f"Received JSON: {json_data}")

    print("Formatting...")
    model = navigator.extract_json(navigator.format(json_data['risk-analysis']))
    # print(f"Generated CORAS Model: \n{model}")
    
    return {
        'coras_model': model
    }

if __name__ == '__main__': 
    rag.load_files([(
        "./rag-docs/capec-abstract.txt",
        DocumentExtension.TXT
    )])
   
    app.run(debug=True, port=5242)
    
