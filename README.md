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

- Ollama Python, the Python client for Ollama:

```
$ conda install --name <env-name> conda-forge::ollama-python
```

