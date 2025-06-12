from model import *

class RiskAssessor:
    model: Model

    def __init__(self, model: Model):
        self.model = model

    def assess(self, description: str, context: str) -> str:
        raise Exception("Invalid class: assess() not implemented")

class SimpleRiskAssessor(RiskAssessor):
    system_prompt = """
        You are an expert in cybersecurity risk assessment. From the description of a system and some context, you perform a cybersecurity risk assessment of the system.
        First, generate a high-level risk table that contains for each risk: Who/What causes the risk? How? What is the incident? What does it harm (asset)? What makes it possible (vulnerabilities)? During your analysis, examine different attack surfaces and various possible threats (human accidental, human deliberate, non-human threat, etc.). Think of at least 2 risks.
        Then, from this high-level analysis, specify for each risk the following items: the threat, the threat scenario, the unwanted incident, the impacted assets, and the associated vulnerabilities.
        """

    def assess(self, description: str, context: str) -> str:
        risk_assessment = self.model.complete(
            messages=[{
                "role": "system",
                "content": self.system_prompt
            }, {
                "role": "user",
                "content": f"Description of the system: {description}\n\nContext: {context}"
            }]
        )

        return risk_assessment
