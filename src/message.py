import json

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

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
        return f"{Colors.OKBLUE}Assistant: {self.content}{Colors.ENDC}"

class GuardianMessage(Message):
    def __str__(self):
        return self.formattedString()

    def formattedString(self):
        return f"{Colors.OKGREEN}[GUARDIAN]: {self.content}{Colors.ENDC}"

class SystemMessage(Message):
    def __str__(self):
        return self.formattedString()

    def formattedString(self):
        return f"[system]: {self.content}"

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

