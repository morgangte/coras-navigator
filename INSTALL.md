# Installation 

Step by step instructions to setup the development environment and install dependencies.

First, make sure to be in the project directory:

```
$ cd <project-directory>
```

## Conda virtual environment

Create a Conda virtual environment (with Python 3.12.10):

```
$ conda create -n <env-name> python=3.12.10
```

The environment name can be anything, e.g. `navigator.env`.

## Dependencies

- You should have Ollama installed on your machine.

- Install dependencies with:

```
$ conda activate <env-name>

# Using Ollama in Python
(<env-name>) $ conda install conda-forge::ollama-python

# Langchain and FAISS for the RAG module
(<env-name>) $ conda install langchain langchain-community faiss
(<env-name>) $ pip install -U langchain-ollama

# Make the CORAS Navigator accessible to the User Interface
(<env-name>) $ conda install anaconda::flask anaconda::flask-cors

# User Interface
(<env-name>) $ conda install conda-forge::nodejs
(<env-name>) $ cd ui
(<env-name>) $ npm i parcel react react-markdown remark-gfm@3.0.1 jspdf

(<env-name>) $ conda deactivate
```

## Run

See `README.md`.
