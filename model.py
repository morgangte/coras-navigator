from message import Answer

class Model:
    client = None 
    model = ""

    def __init__(self):
        raise Exception("Invalid class: __init__() not implemented")

    def complete(self, messages) -> Answer:
        raise Exception("Invalid class: complete() not implemented")

class MistralModel(Model):
    def __init__(self, client, model):
        self.client = client
        self.model = model

    def complete(self, messages) -> Answer:
        chat_response = self.client.chat.complete(
            model=self.model,
            messages=messages
        )
        return Answer(chat_response.choices[0].message.content)
