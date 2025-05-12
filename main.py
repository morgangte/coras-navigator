import os
from datetime import datetime
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
    messages: list
    system_prompt: str

    def __init__(self, client, system_prompt=""):
        self.client = client
        self.messages = [{
            "role": "system",
            "content": system_prompt
        }]
        self.system_prompt = system_prompt
    
    def __str__(self):
        chat = ""
        if self.system_prompt != "":
            chat += f">>> System: {self.system_prompt}\n"

        for message in self.messages:
            if message["role"] == "user":
                chat += str(Prompt(message["content"])) + '\n'
            elif message["role"] == "assistant":
                chat += str(Answer(message["content"])) + '\n'
            else:
                continue
        
        return chat[:-1]

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
        return answer
    
    def save(self, directory="chats") -> None:
        if directory.strip() == "":
            directory = "."
        elif not os.path.exists(directory):
            os.makedirs(directory)
        
        current_time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        filename = f"{directory}/chat_{current_time}.txt"

        with open(filename, 'w') as file:
            file.write(str(self))

def main(client):
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

    chat.save(directory="chats")

if __name__ == "__main__":
    load_dotenv()
    api_key = os.getenv('MISTRAL_API_KEY')
    client = Mistral(api_key=api_key)

    main(client)
