from model import *

class Router:
    model: Model    

    def __init__(self, model: Model):
        self.model = model
    
    def should_retrieve(self, query: str) -> bool:
        raise Exception("Invalid class: should_retrieve() not implemented")

class SimpleRouter(Router):
    system_prompt = """
        You are a router AI agent in a bigger system. Your role is to tell, from a user query, whether additional context or information is needed to answer the user query. The questions the user will ask are going to be related to cybersecurity risk assessment.
        For example, if the user query looks like: 'From the context description I provided, identify the associated risks.', you should answer 'Yes' because risk assessment must be conducted from trusted documents and sources. If the user query looks like: 'What can you tell me about ransomwares?', answer 'Yes'. If the user query looks like 'Generate a high-level risk table from the provided context', answer 'Yes'.
        However, if the user query looks like: 'Can you generate a JSON file based on your risk assessment and following a given JSON template?', you should answer 'No'. If the user query seems out of context, i.e. the query is simply a statement or something like 'Yes' or 'No', you should answer 'No'. 
        Important: you can think of your decision in your answer but you must end your message with 'Yes' or 'No'!
        """

    def should_retrieve(self, query: str) -> str:
        answer = self.model.complete(
            messages=[{
                "role": "system",
                "content": self.system_prompt
            },
            {
                "role": "user",
                "content": f"Decide for this user query: '{query}'."
            }]
        )

        return get_answer(answer.get())
        
def get_answer(message: str) -> str:
    message = message.lower()[-7:].replace('\n', ' ').replace('\r', '')

    if "yes" in message:
        return "Yes"
    elif "no" in message:
        return "No"
    
    return None

