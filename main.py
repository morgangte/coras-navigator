import os
from datetime import datetime
from mistralai import Mistral
from dotenv import load_dotenv

from message import *
from model import *

class Chat:
    model: Model = None
    messages: list = None

    def __init__(self, model):
        self.model = model
        self.messages = []
    
    def __str__(self):
        chat = ""

        for message in self.messages:
            if message["role"] == "system":
                chat += str(SystemMessage(message["content"])) + '\n'
            elif message["role"] == "user":
                chat += str(Prompt(message["content"])) + '\n'
            elif message["role"] == "assistant":
                chat += str(Answer(message["content"])) + '\n'
            else:
                continue
        
        return chat[:-1]

    def complete(self, message: str, role="user") -> Answer:
        self.messages.append({
            "role": role,
            "content": message
        })

        answer = self.model.complete(self.messages)

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

    def start(self):
        raise Exception("Invalid class: start() not implemented")

    def loop(self):
        raise Exception("Invalid class: loop() not implemented")

class CLIChat(Chat):
    def start(self) -> None:
        self.loop()
    
    def loop(self) -> None:
        again = True
        while(again):
            text = input(">>> User: ")
            if (text == "exit"):
                again = False
            else:
                answer = self.complete(text, "user")
                print(answer)

class GuardianChat(CLIChat):
    def start(self) -> None:
        answer = self.complete(
            """
            You are an expert cybersecurity risk assessment assistant. 
            Given a context description of a system, you provide cybersecurity risk assessments.
            This is how a conversation with the user should be conducted: 
            1. Ask for a context description to analyze.
            2. Generate a summary of the target of analysis and ask the user if that corresponds to what he tried to describe. If that corresponds, proceed to step 3, otherwise ask for more details/what should be corrected.
            3. Generate a high-level risk table that contains for each risk: Who/What causes the risk? How? What is the incident? What does it harm (asset)? What makes it possible (vulnerabilities)?
            4. From this high-level risk table, specify each of the following item: the threat, the threat scenario, the unwanted incident, the impacted assets, and the associated vulnerabilities.
            5. From this detailed description of each risk, extract the information to format it into a JSON file following this format: {    "vertices": [        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string,            "likelihood": string        }    ],    "edges": [        {            "type": string,            "source": string,            "target": string        }    ]}. The vertices type can be "threat", "threat_scenario", "asset", "vulnerability", or "unwanted incident". The edges type can be "initiates" or "impacts" if the target is an asset. The likelihoods can be empty, or equal to "possible", "unlikely", "frequent". At this step and at step 5 only, generate only the JSON object without any explanation.
            You may now proceed to start at step 1.
            """,
            role="system")
        print(answer)

        self.loop()

def test_cli(model):
    chat = CLIChat(model)
    chat.start()
    chat.save(directory="chats")

def test_guardian(model):
    chat = GuardianChat(model)
    chat.start()
    chat.save()

if __name__ == "__main__":
    load_dotenv()
    api_key = os.getenv('MISTRAL_API_KEY')
    client = Mistral(api_key=api_key)
    model = MistralModel(client, "mistral-large-latest")

    test_guardian(model)
