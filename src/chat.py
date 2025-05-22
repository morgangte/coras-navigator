import os
from datetime import datetime

from message import *
from model import *
from rag import *
from router import *

class Chat:
    model: Model
    rag_module: RAG
    messages: list
    
    def __init__(self, model: Model, rag_module: RAG=None):
        self.model = model
        self.rag_module = rag_module
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

    def complete(self, message: str, role: str="user") -> Answer:
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

    def handle_answer(self, answer: Answer) -> None:
        raise Exception("Invalid class: handle_answer() not implemented")

    def start(self) -> None:
        self.initialize()
        self.loop()   
 
    def initialize(self) -> None:
        return
 
    def loop(self) -> None:
        raise Exception("Invalid class: loop() not implemented")

class CLIChat(Chat):
    def handle_answer(self, answer: Answer) -> None:
        print(answer)
    
    def loop(self) -> None:
        again = True
        while(again):
            text = input(">>> User: ")
            if (text == "exit"):
                again = False
            else:
                answer = self.complete(text, "user")
                self.handle_answer(answer)

class GuardianChat(CLIChat):
    json_template = """
        {    "vertices": [        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string,            "likelihood": string        }    ],    "edges": [        {            "type": string,            "source": string,            "target": string        }]}
        """
    system_prompt = f"""
        You are an expert cybersecurity risk assessment assistant. 
        Given a context description of a system, you provide cybersecurity risk assessments.
        This is how a conversation with the user should be conducted: 
        1. Ask for a context description to analyze.
        2. Generate a summary of the target of analysis and ask the user if that corresponds to what he tried to describe. If that corresponds, proceed to step 3, otherwise ask for more details/what should be corrected.
        3. Generate a high-level risk table that contains for each risk: Who/What causes the risk? How? What is the incident? What does it harm (asset)? What makes it possible (vulnerabilities)?
        4. From this high-level risk table, specify each of the following item: the threat, the threat scenario, the unwanted incident, the impacted assets, and the associated vulnerabilities.
        5. From this detailed description of each risk, extract the information to format it into a JSON file following this format: {json_template} The vertices type can be "threat", "threat_scenario", "asset", "vulnerability", or "unwanted incident". The edges type can be "initiates" or "impacts" if the target is an asset. The likelihoods can be empty, or equal to "possible", "unlikely", "frequent". At this step and at step 5 only, generate only the JSON object without any explanation.
        You may now proceed to start at step 1. 
        """

    def handle_answer(self, answer: Answer) -> None:
        print(answer)        
        try:
            json = extract_JSON(answer.get())
        except ValueError as error:
            # No JSON found
            return
        except Exception as exception:
            print(GuardianMessage("Invalid JSON detected"))
            return

        print(GuardianMessage("Valid JSON found"))

    def initialize(self) -> None:
        answer = self.complete(
            message=self.system_prompt,
            role="system"
        )
        self.handle_answer(answer)

class FirstRAGChat(CLIChat):
    system_promt = """
        You are a cybersecurity expert assistant. Provided a context, you answer the user query.
        """

    def loop(self) -> None:
        while True:
            text = input(">>> User: ")
            if (text == "exit"):
                return
            
            context = self.rag_module.search(text)
            print(f"{Colors.WARNING}{context}{Colors.ENDC}")    
        
            prompt = f"Query: {text}\nContext: {context}"
            answer = self.complete(prompt, "user")
            self.handle_answer(answer)

class GuardianRAGChat(GuardianChat):
    json_template = """
        {    "vertices": [        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string,            "likelihood": string        }    ],    "edges": [        {            "type": string,            "source": string,            "target": string        }]}
        """
    system_prompt = f"""
        You are an expert cybersecurity risk assessment assistant. 
        Given a context description of a system (the 'Query'), you provide cybersecurity risk assessments, based on the trusted sources given in the 'Context'
        This is how a conversation with the user should be conducted: 
        1. Ask for a context description to analyze.
        2. Generate a summary of the target of analysis and ask the user if that corresponds to what he tried to describe. If that corresponds, proceed to step 3, otherwise ask for more details/what should be corrected.
        3. Generate a high-level risk table that contains for each risk: Who/What causes the risk? How? What is the incident? What does it harm (asset)? What makes it possible (vulnerabilities)?
        4. From this high-level risk table, specify each of the following item: the threat, the threat scenario, the unwanted incident, the impacted assets, and the associated vulnerabilities.
        5. From this detailed description of each risk, extract the information to format it into a JSON file following this format: {json_template} The vertices type can be "threat", "threat_scenario", "asset", "vulnerability", or "unwanted incident". The edges type can be "initiates" or "impacts" if the target is an asset. The likelihoods can be empty, or equal to "possible", "unlikely", "frequent". At this step and at step 5 only, generate only the JSON object without any explanation.
        You may now proceed to start at step 1. 
        """
    
    def loop(self) -> None:
        while True:
            text = input(">>> User: ")
            if (text == "exit"):
                return
            
            context = self.rag_module.search(text, k=5)
            print(f"{Colors.WARNING}{context}{Colors.ENDC}")    
        
            prompt = f"Query: {text}\nContext: {context}"
            answer = self.complete(prompt, "user")
            self.handle_answer(answer)

class GuardianConditionalRAGChat(GuardianRAGChat):
    json_template = """
        {    "vertices": [        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string        },        {            "type": string,            "id": string,            "text": string,            "likelihood": string        }    ],    "edges": [        {            "type": string,            "source": string,            "target": string        }]}
        """
    system_prompt = f"""
        You are an expert cybersecurity risk assessment assistant. 
        You can answer any cybersecurity-related question but the user can also ask for the analysis of a system. When the user asks for the analysis of a system, act as follows:
        1. Generate a summary of the target of analysis and ask the user if that corresponds to what was first described. If that corresponds, proceed to step 2. Otherwise, ask for more details/what should be corrected.
        2. Generate a high-level risk table that contains for each risk: Who/What causes the risk? How? What is the incident? What does it harm (asset)? What makes it possible (vulnerabilities)? Think of at least 2 risks. Then, from this high-level risk table, specify each of the following item: the threat, the threat scenario, the unwanted incident, the impacted assets, and the associated vulnerabilities. Finally, from this detailed description of each risk, extract the information to format it into a JSON file following this format: {json_template}. The vertices type can be "threat", "threat_scenario", "asset", "vulnerability", or "unwanted_incident". The edges type can be "initiates" or "impacts" if the target is an asset. The likelihoods can be empty, or equal to "possible", "unlikely", "frequent". 
        """
    router = SimpleRouter(OllamaModel("llama3:8b"))    

    def loop(self) -> None:
        while True:
            text = input(">>> User: ")
            if (text == "exit"):
                return
           
            prompt = "" 
            decided = self.router.should_retrieve(text)
            if decided == "Yes":
                context = self.rag_module.search(text, k=5)
                print(f"{Colors.WARNING}{context}{Colors.ENDC}")
                prompt = f"Query: {text}\nContext: {context}"
            else:
                print(GuardianMessage("No retrieval."))
                prompt = text

            answer = self.complete(prompt, "user")
            self.handle_answer(answer)

        
    
