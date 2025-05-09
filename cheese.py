import os
from mistralai import Mistral
from dotenv import load_dotenv

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

class Chat:
    client = None
    queries: list[(Prompt, Answer)]
    messages: list
    system_prompt: str

    def __init__(self, client, system_prompt=""):
        self.client = client
        self.queries = []
        self.messages = [{
            "role": "system",
            "content": system_prompt
        }]
        self.system_prompt = system_prompt
    
    def __str__(self):
        string = ""
        if self.system_prompt != "":
            string += f">>> System: {self.system_prompt}\n"

        for prompt, answer in self.queries:
            string += str(prompt) + '\n' + str(answer) + '\n'
        return string[:-1]

    def query(self, prompt: Prompt) -> Answer:
        self.messages.append({
            "role": "user",
            "content": prompt.get()
        })

        chat_response = client.chat.complete(
            model="mistral-large-latest",
            messages=self.messages
        )
        answer = Answer(chat_response.choices[0].message.content)
        self.messages.append({
            "role": "assistant",
            "content": answer.get()
        })
        self.queries.append((prompt, answer))
        return answer

def example_fixed(client):
    chat = Chat(client)

    prompt = Prompt("What is the best French cheese?")
    chat.query(prompt)

    prompt = Prompt("Thank you! Can you list these cheese between commas?")
    chat.query(prompt)

    print(chat)

def example_live(client):
    chat = Chat(client)

    again = True
    while(again):
        text = input(">>> User: ")
        if (text == "exit"):
            again = False
        else:
            prompt = Prompt(text)
            answer = chat.query(prompt)
            print(answer)

if __name__ == "__main__":
    load_dotenv()
    api_key = os.getenv('MISTRAL_API_KEY')
    client = Mistral(api_key=api_key)

    example_fixed(client)
    # example_live(client)