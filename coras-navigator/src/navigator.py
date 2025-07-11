import os
from datetime import datetime
import json

from summarizer import *
from rag import *
from assessor import *
from formatter import *

class CorasNavigator:
    """
    The CORAS navigator: a facade of the different agents.

    Attributes:
    - summarizer: The summarizer agent
    - rag:        The RAG module
    - assessor:   The risk assessor agent
    - formatter:  The formatter agent
    """

    summarizer: Summarizer
    rag: RAG
    assessor: RiskAssessor
    formatter: Formatter

    def __init__(self, summarizer: Summarizer, rag: RAG, assessor: RiskAssessor, formatter: Formatter):
        self.summarizer = summarizer
        self.rag = rag
        self.assessor = assessor
        self.formatter = formatter
    
    def summarize(self, description: str) -> str:
        return self.summarizer.summarize(description)
    
    def retrieve(self, text: str) -> str:
        """
        Uses the RAG module to return context related to input text, as a unique string.

        Parameters:
        - text: The input text used for retreival

        Returns:
        - The retrieved context as a string
        """
        
        context = ""
        results = self.rag.search(text)

        for result in results:
            context += result + "\n"
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

def extract_JSON(text: str):
    try:
        start = text.index('{')
        end = text.rindex('}')
    except ValueError as error:
        raise ValueError("No JSON object found") from error
       
    try:
        json_object = json.loads(text[start:end+1])
    except ValueError as error:
        raise Exception("Invalid JSON") from error

    return json_object
