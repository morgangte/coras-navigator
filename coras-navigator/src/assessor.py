from langchain_ollama import ChatOllama
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate

class RiskAssessor:
    llm = None

    def __init__(self, model: str):
        self.llm = ChatOllama(
            model=model,
            temperature=0.05
        )

    def assess(self, description: str, context: str) -> str:
        raise Exception("Invalid class: assess() not implemented")

class SimpleRiskAssessor(RiskAssessor):
    system_prompt = """
You are an expert in cybersecurity risk assessment. From the description of a system (delimited by ###) and provided context (delimited by <context></context>), you perform a cybersecurity risk assessment of the system.
First, generate a high-level risk table that contains for each risk: Who/What causes the risk? How? What is the incident? What does it harm (asset)? What makes it possible (vulnerabilities)? During your analysis, examine different attack surfaces and various possible threats (human accidental, human deliberate or non-human threats). Think of at least 2 risks.
Then, from this high-level analysis, specify for each risk the following items: the threat, one or multiple consecutive threat scenarios with their associated vulnerabilities, the unwanted incident, and the impacted assets.
"""

    def assess(self, description: str, context: str) -> str:
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "Analyze the following system:\n###\n{description}\n###\n<context>\n{context}\n</context>")
        ])

        chain = prompt | self.llm
        result = chain.invoke({
            "description": description,
            "context": context
        })

        return result.content

