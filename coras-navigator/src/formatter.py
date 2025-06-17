from langchain_core.messages import AIMessage
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

class Formatter:
    llm = None
    template: str

    def __init__(self, model: str, template: str):
        self.llm = ChatOllama(
            model=model,
            temperature=0.05
        )
        self.template = template

    def format(self, text: str) -> str:
        raise Exception("Invalid class: format() not implemented")

class SimpleJSONFormatter(Formatter):
    system_prompt = "You are a helpul assistant that formats text input by the user into a structured JSON file following a pre-defined format. The JSON format you must follow is:\n{template}"
    
    def format(self, text: str) -> str:
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "Format the following text:\n{text}")
        ])

        chain = prompt | self.llm
        result = chain.invoke({
            "text": text,
            "template": self.template
        })

        return result.content

