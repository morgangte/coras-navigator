import os
from datetime import datetime
from ollama import chat

from message import *
from model import *
from chat import *

def test_cli(model):
    chat = CLIChat(model)
    chat.start()
    chat.save(directory="chats")

def test_guardian(model):
    chat = GuardianChat(model)
    chat.start()
    chat.save()

if __name__ == "__main__":
    model = OllamaModel("llama3:70b-instruct")
    test_guardian(model)

