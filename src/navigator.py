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
    assessor: RiskAssessor
    formatter: Formatter

    def __init__(self, summarizer: Summarizer, rag: RAG, assessor: RiskAssessor, formatter: Formatter):
        self.summarizer = summarizer
        self.rag = rag
        self.assessor = assessor
        self.formatter = formatter
    
    def start(self) -> None:
        description, summary = self.summarization()
        context = self.retrieval(summary)
        print(f"Retrieved documents: \n{Colors.WARNING}{context}{Colors.ENDC}")
        analysis = self.risk_assessment(summary, context)
        print(f"Analysis: \n{Colors.OKBLUE}{analysis}{Colors.ENDC}")
        formatted = self.formatting(analysis)
        print(f"JSON: \n{Colors.OKBLUE}{formatted}{Colors.ENDC}")
        self.JSON_extraction(formatted)

    def summarization(self) -> (str, str):
        description = input("Please provide a context description of a system: \n>>> ")
        if description == "exit":
            exit(0)
        summary = self.summarizer.summarize(description)
        
        user_agrees = input(f"Here is a summary of the context description you provided: \n{Colors.OKBLUE}{summary}{Colors.ENDC}\n\nDoes this summary accurately reflect your system? ('yes' or 'no'): \n>>> ")
        while user_agrees != "yes" and user_agrees != "no" and user_agrees != "exit":
            user_agrees = input("Invalid input. Please type 'yes' or 'no': \n>>> ")            
        
        if user_agrees == "exit":
            exit(0);
        if user_agrees == "yes":
            return description, summary
        else:
            return self.summarization()

    def retrieval(self, text: str) -> str:
        return self.rag.search(text, k=5)
        
    def risk_assessment(self, description: str, context: str) -> str:
        return self.assessor.assess(description, context)

    def formatting(self, text: str) -> str:
        return self.formatter.format(text)

    def JSON_extraction(self, text: str) -> None:
        try:
            json = extract_JSON(text)
        except ValueError as error:
            # No JSON found
            return
        except Exception as exception:
            print(f"{Colors.FAIL}Invalid JSON{Colors.ENDC}")
            return

        print(f"{Colors.OKGREEN}Valid JSON{Colors.ENDC}")
