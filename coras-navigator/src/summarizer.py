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
    llm = None
    
    def __init__(self, model: str):
        self.llm = OllamaLLM( 
            model=model,
            temperature=0.05
        )

    def summarize(self, text: str) -> str:
        raise Exception("Invalid class: summarize() not implemented")

    def summarize_files(self, filepaths: list[(str, DocumentExtension)]) -> str:
        raise Exception("Invalid class: summarize_files() not implemented")

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

class PDFSummarizer(Summarizer):
    question_template = """
        Provide a detailed summary of the following text.
        Text: {text}
        Summary: 
        """
    refine_template = """
        Provide a summary of the following text. Your response must consist of bullet points and cover key points of the text.
        Text: {text}
        Bullet point summary:
        """

    def summarize_files(self, filepaths: list[(str, DocumentExtension)]) -> str:
        llm = OllamaLLM(
            model="llama3:8b",
            streaming=True,
            # callbacks=[StreamingStdOutCallbackHandler()],
            temperature=0
        )

        question_prompt = PromptTemplate(
            template=self.question_template,
            input_variables=["text"]
        )
        refine_prompt = PromptTemplate(
            template=self.question_template,
            input_variables=["text"]
        )

        chain = load_summarize_chain(
            llm=llm,
            chain_type="refine",
            question_prompt=question_prompt,
            refine_prompt=refine_prompt,
            # return_intermediate_steps=True
        )

        pages = self.load_files(filepaths)
        outputs = chain.invoke({"input_documents": pages})
        return outputs["output_text"]

    def load_files(self, filepaths):
        pages = []
        for filepath, extension in filepaths:
            if extension != DocumentExtension.PDF:
                print(f"Wrong document format ({filepath}): only PDFs are supported")
                continue

            pdf_loader = PyPDFLoader(filepath)
            pages = self.append_pages(pages, pdf_loader)
        
        return pages

    def append_pages(self, pages, pdf_loader):
        for page in pdf_loader.lazy_load():
            pages.append(page)
        return pages

