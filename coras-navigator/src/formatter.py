from model import *

class Formatter:
    model: Model
    system_prompt: str    

    def __init__(self, model: Model, template: str):
        self.model = model

    def format(self, text: str) -> str:
        raise Exception("Invalid class: format() not implemented")

class SimpleJSONFormatter(Formatter):
    def __init__(self, model: Model, template: str):
        self.model = model
        self.system_prompt = f"""
            You are a helpul assistant whose goal is to format text input by the user into a structured JSON file that follows a pre-defined format. The JSON format you must follow is this one:\n{template}
            """
    
    def format(self, text: str) -> str:
        answer = self.model.complete(
            messages=[{
                "role": "system",
                "content": self.system_prompt
            }, {
                "role": "user",
                "content": f"Text to format: {text}"
            }]
        )

        return answer.get()
