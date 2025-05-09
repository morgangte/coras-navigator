# Mistral API access

A simple program to test the access to Mistral AI API.

## Virtual environment

If you don't have set up a virtual environment, this is how to proceed:

```
python -m venv guardian_prototype
source guardian_prototype/bin/activate
```

In a `.env` file, put your API key:

```
MISTRAL_API_KEY=<key>
```

## Quick start

```
source guardian_prototype/bin/activate
python main.py
```

### Dependencies

Python's virtual environment package

```
apt install python3.10-venv
```

Mistral AI module

```
pip install mistralai
```

`dotenv` module

```
pip install python-dotenv
```

