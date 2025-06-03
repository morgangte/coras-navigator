from message import Answer
from ollama import chat

class Model:
    client = None 
    model = ""

    def __init__(self):
        raise Exception("Invalid class: __init__() not implemented")

    def complete(self, messages) -> Answer:
        raise Exception("Invalid class: complete() not implemented")

class OllamaModel(Model):
    def __init__(self, model):
        self.model = model

    def complete(self, messages):
        response = chat(self.model, messages=messages)
        return Answer(response['message']['content'])
