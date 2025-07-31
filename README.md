# CORAS Navigator

This is the CORAS Navigator. An LLM-Based Assistant for Cybersecurity Risk Assessment.

## Quick Start

Make sure to check `INSTALL.md` to download required dependencies and create your Conda virtual environment (`<env-name>`).

### In a first terminal

```
$ conda activate <env-name>

# On the first time, you would need to download necessary documents for RAG
(<env-name>) $ make download-rag-documents

(<env-name>) $ make navigator
```

### In a second terminal

```
$ conda activate <env-name>
(<env-name>) $ make ui
```

You will now be able to access the CORAS Navigator at `http://localhost:1235/`.

If you want to exit, you can deactivate the virtual environment with:

```
(<env-name>) $ conda deactivate 
``` 

## Help

You can list available actions from the root of the project directory with:

```
$ make
```

## Tests

Run unit tests from the root of the project directory with:

```
$ conda activate <env-name>
(<env-name>) $ make test
```

## Dependencies

See `INSTALL.md`.

