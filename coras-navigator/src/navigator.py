import os
from datetime import datetime

from message import *
from summarizer import *
from rag import *
from assessor import *
from formatter import *

class CorasNavigator:
    summarizer: Summarizer
    rag: RAG
    rag_cwe: RAG
    assessor: RiskAssessor
    formatter: Formatter

    def __init__(self, summarizer: Summarizer, rag: RAG, rag_cwe: RAG, assessor: RiskAssessor, formatter: Formatter):
        self.summarizer = summarizer
        self.rag = rag
        self.rag_cwe = rag_cwe
        self.assessor = assessor
        self.formatter = formatter
    
        self.summary = ""

    def summarize(self, description: str) -> str:
        self.summary = self.summarizer.summarize(description)
        return self.summary
    
    def summarize_files(self, directory: str) -> str:
        files_summarizer = PDFSummarizer("llama3.2:3b")
        
        files = []
        for filename in os.listdir(directory):  
            if not os.path.isfile(os.path.join(directory, filename)):
                continue
            if '.' not in filename:
                continue
            if filename.rsplit('.', 1)[-1].lower() != "pdf":
                continue
            
            files.append((
                os.path.join(directory, filename),
                DocumentExtension.PDF
            ))
        print(files)
        self.summary = files_summarizer.summarize_files(files)
        return self.summary

    def get_summary(self):
        return self.summary

    def retrieve(self, text: str) -> str:
        context = ""
        results = self.rag.search(text, k=3)
        for result in results:
            context += result + "\nVulnerabilities: \n"
            vulnerabilities = self.rag_cwe.search(result, k=2)
            for vulnerability in vulnerabilities:
                context += f"- {vulnerability}\n"
        return context

    def assess_risks(self, description: str, context: str) -> str:
        return self.assessor.assess(description, context)

    def format(self, text: str) -> str:
        return self.formatter.format(text)

    def extract_json(self, text: str) -> str:
        try:
            json = extract_JSON(text)
            return json
        except ValueError as error:
            # No JSON found
            return ""
        except Exception as exception:
            # Invalid JSON
            return ""

class CorasNavigatorUI(CorasNavigator):
    def perform_analysis(self, text: str) -> (str, str):
        if text == "":
            return None
        
        # print(f"Retrieve context for text: {text}")
        context = self.retrieve(text)
        print(f"Retrieved context: {context}")
        print("Risk assessment...")
        analysis = self.assess_risks(text, context)
        print("Formatting...")
        formatted = self.format(analysis)
        return (analysis, self.extract_json(formatted))        

