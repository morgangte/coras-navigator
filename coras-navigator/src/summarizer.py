from model import *

class Summarizer:
    model: Model
    
    def __init__(self, model: Model):
        self.model = model

    def summarize(self, text: str) -> str:
        raise Exception("Invalid class: summarize() not implemented")

class SimpleSummarizer(Summarizer):
    system_prompt = """
        You are an assistant that summarizes text input by the user. Your goal is to return a summary from the user input and nothing else.
        In your answer, write directly your summary of the text. Do not write any introductory sentence such as 'Here is a summary...'.
        """

    def summarize(self, text: str) -> str:
        answer = self.model.complete(
            messages=[{
                "role": "system",
                "content": self.system_prompt
            }, {
                "role": "user",
                "content": f"Write a summary of this text: {text}"
            }]
        )

        return answer.get()

