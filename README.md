# CORAS Navigator

This is the CORAS Navigator. An LLM-Based Assistant for Cybersecurity Risk Assessment.

## Quick Start

### Virtual environment

Set up a Conda virtual environment:

```
$ conda create -n <env-name>
```

### Usage

Connect to the SINTEF server with port forwarding:
- Port 1234: UI React App
- Port 5050: CORAS Navigator API

```
$ ssh -L 1234:localhost:1234 -L 5050:localhost:5050 <username>@mainframe.sintef.no
```

Then,

```
$ cd <project-directory>
$ conda activate <env-name>
$ make ui
$ make navigator
```

You will now be able to access the CORAS Navigator at `http://localhost:1234/`.

### After use

Deactivate the virtual environment with:

```
(<env-name>) $ conda deactivate 
``` 

## Tests

Once the virtual environment activated, run unit tests from the root of the project directory with:

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
(<env-name>) $ pip install -U langchain-ollama
$ conda deactivate
```

- PyPDF for handling pdf files:

```
$ conda install --name <env-name> conda-forge::pypdf
```

- To make the CORAS Navigator accessible from the User Interface, we use Flask and Flask CORS:

```
$ conda install --name <env-name> anaconda::flask anaconda::flask-cors
```

### User Interace (front-end)

See `ui/README.md`.

