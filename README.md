# GUARDIAN Prototype

This is the GUARDIAN Risk Assistant implementation for Cybersecurity Risk Assessment.

## Quick Start

### Virtual environment

Working from the server at SINTEF, set up a Conda virtual environment if not already done:

```
$ conda create -n <env-name>
```

### Usage

```
$ conda activate <env-name>
$ make run
```

Once in the chat, use `exit` to quit.

### After use

Deactivate the virtual environment with:

```
(<env-name>) $ conda deactivate 
``` 

## Tests

Run unit tests with:

```
$ make test
```

## Dependencies

### CORAS Navigator (back-end)

- Ollama Python, the Python client for Ollama:

```
$ conda install --name <env-name> conda-forge::ollama-python
```

- Langchain, Langchain-community, FAISS and langchain-ollama for RAG:

```
$ conda install --name <env-name> langchain langchain-community faiss
```

Since langchain-ollama is not available on Conda, use pip instead:

```
$ conda activate <env-name>
$ pip install -U langchain-ollama
$ conda deactivate
```

- To make the CORAS Navigator accessible from the User Interface, we use Flask and Flask CORS:

```
$ conda install --name <env-name> anaconda::flask anaconda::flask-cors
```

### User Interace (front-end)

See `ui/README.md`.

