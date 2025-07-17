from rag import DocumentExtension

# LLM
from langchain_ollama import ChatOllama, OllamaLLM
from langchain_core.messages import AIMessage
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
# Prompt template
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
# Import documents
from langchain_community.document_loaders import PyPDFLoader
# Summarize
from langchain.chains.summarize import load_summarize_chain

class Summarizer:
    """
    Agent responsible for generating a structured and comprehensive description of the target of analysis from the unstructured user-provided description.

    Attributes:
    - llm: The LLM used for generation
    """

    llm = None
    
    def __init__(self, model: str):
        self.llm = OllamaLLM( 
            model=model,
            temperature=0
        )

    def summarize(self, text: str) -> str:
        """
        Structures the input text.

        Parameters:
        - text: The text to summarize/structure
        
        Returns:    
        - A structured and comprehensive description of the input text
        """

        raise Exception("Invalid class: Summarizer::summarize() not implemented")

class SimpleSummarizer(Summarizer):
    system_prompt = """
        You are a helpful assistant that organizes a provided system description into a structured, clear and comprehensive description.
        In your answer, do not write any introductory sentence such as 'Here is a description...'.
        """

    def summarize(self, text: str) -> str:
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "Reformulate this text following the instructions you were given: {text}")
        ])

        prompt = ChatPromptTemplate.from_template("""System description: {text}

Do not write any introductory sentence such as 'Here is a description...'. Provide a structured, clear and comprehensive description of the system: """)

        chain = prompt | self.llm
        result = chain.invoke({
            "text": text
        })

        return result

