import json

class Message:
    content: str

    def __init__(self, content=""):
        self.content = content

    def __str__(self):
        return f">>> {self.formattedString()}"

    def formattedString(self) -> str:
        raise Exception("Invalid class: formattedString() not implemented")
    
    def set(self, content: str) -> None:
        self.content = content
    
    def get(self) -> str:
        return self.content

class Prompt(Message):
    def formattedString(self) -> str:
        return f"User: {self.content}"
    
class Answer(Message):
    def formattedString(self) -> str:
        return f"Assistant: {self.content}"

class GuardianMessage(Message):
    def formattedString(self):
        return f"GUARDIAN: {self.content}"

class SystemMessage(Message):
    def __str__(self):
        return self.formattedString()

    def formattedString(self):
        return f"[system]: {self.content}"

def extract_JSON(text: str):
    try:
        start = text.index('{')
    except ValueError as error:
        raise Exception("No JSON object found") from error
    
    try:
        end = text.rindex('}')
    except ValueError as error:
        raise Exception("Could not end the JSON object") from error

    return text[start:end+1]

