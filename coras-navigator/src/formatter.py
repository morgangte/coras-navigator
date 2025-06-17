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
You are a helpul assistant that formats text input by the user into a structured JSON file following a pre-defined format. The JSON format you must follow is this one:
{template}
"""
    
    def format(self, text: str) -> str:
        formatted = self.model.complete(
            messages=[{
                "role": "system",
                "content": self.system_prompt
            }, {
                "role": "user",
                "content": f"""
Format the following text: 
{text}
"""
            }]
        )

        return formatted

