# CORAS Navigator

This is the CORAS Navigator. An LLM-Based Assistant for Cybersecurity Risk Assessment.

## Quick Start

### Virtual environment

Working from the server at SINTEF, set up a Conda virtual environment if not already done:

```
$ conda create -n <env-name>
```

### Usage

#### In a first terminal

Run the CORAS Navigator API server:

```
$ ssh -L 5000:localhost:5000 <username>@mainframe.sintef.no
$ cd <project-directory>/coras-navigator
$ conda activate <env-name>
$ python3 app.py
```

#### In a second terminal

Run the User Interface server:

```
$ ssh -L 1234:localhost:1234 <username>@mainframe.sintef.no
$ cd <project-directory>/ui
$ npm start
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
$ pip install -U langchain-ollama
$ conda deactivate
```

- To make the CORAS Navigator accessible from the User Interface, we use Flask and Flask CORS:

```
$ conda install --name <env-name> anaconda::flask anaconda::flask-cors
```

### User Interace (front-end)

See `ui/README.md`.

