# GUARDIAN Prototype

This is the GUARDIAN Risk Assistant for Cybersecurity Risk Assessment.

## Quick Start

### Virtual environment

Working from the server at SINTEF, set up a Conda virtual environment if not already done:

```
$ conda create -n <env-name>
```

### Usage

```
$ conda activate <env-name>
(<env-name>) $ python3 main.py
```

### After use

Deactivate the virtual environment with:

```
(<env-name>) $ conda deactivate 
``` 

## Dependencies

- Ollama Python, the Python client for Ollama:

```
$ conda install --name <env-name> conda-forge::ollama-python
```

