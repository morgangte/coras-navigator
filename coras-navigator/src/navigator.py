import os
from datetime import datetime

from message import *
from model import *
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
        files_summarizer = PDFSummarizer(OllamaModel("llama3.2:3b"))
        
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
        
        print(f"Retrieve context for text: {text}")
        context = self.retrieve(text)
        print("Risk assessment...")
        analysis = self.assess_risks(text, context)
        print("Formatting...")
        formatted = self.format(analysis)
        return (analysis, self.extract_json(formatted))        

class CorasNavigatorCLI(CorasNavigator): 
    def start(self) -> None:
        description, summary = self.summarization()
        context = self.retrieve(summary)
        print(f"Retrieved documents: \n{Colors.WARNING}{context}{Colors.ENDC}")
        analysis = self.assess_risks(summary, context)
        print(f"Analysis: \n{Colors.OKBLUE}{analysis}{Colors.ENDC}")
        formatted = self.format(analysis)
        print(f"JSON: \n{Colors.OKBLUE}{formatted}{Colors.ENDC}")
        self.JSON_extraction(formatted)

    def summarization(self) -> (str, str):
        description = input("Please provide a context description of a system: \n>>> ")
        if description == "exit":
            exit(0)
        summary = self.summarize(description)
        
        user_agrees = input(f"Here is a summary of the context description you provided: \n{Colors.OKBLUE}{summary}{Colors.ENDC}\n\nDoes this summary accurately reflect your system? ('yes' or 'no'): \n>>> ")
        while user_agrees != "yes" and user_agrees != "no" and user_agrees != "exit":
            user_agrees = input("Invalid input. Please type 'yes' or 'no': \n>>> ")            
        
        if user_agrees == "exit":
            exit(0);
        if user_agrees == "yes":
            return description, summary
        else:
            return self.summarization()

    def JSON_extraction(self, text: str) -> None:
        if self.extract_json(text) == "":      
            print(f"{Colors.FAIL}Absent ot Invalid JSON{Colors.ENDC}")
        else:
            print(f"{Colors.OKGREEN}Valid JSON{Colors.ENDC}")

