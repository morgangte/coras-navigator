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

    def __init__(self, client):
        self.client = client
        self.queries = []
    
    def __str__(self):
        string = ""
        for prompt, answer in self.queries:
            string += str(prompt) + '\n' + str(answer) + '\n'
        return string[:-1]

    def query(self, prompt: Prompt) -> Answer:
        query_content = prompt.get()
        if len(self.queries) > 0:
            query_content += f"\n\nPrevious messages in the conversation are: {str(self)}"

        chat_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "user",
                    "content": query_content,
                },
            ]
        )
        answer = Answer(chat_response.choices[0].message.content)
        self.queries.append((prompt, answer))
        return answer

if __name__ == "__main__":
    load_dotenv()
    api_key = os.getenv('MISTRAL_API_KEY')
    client = Mistral(api_key=api_key)

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