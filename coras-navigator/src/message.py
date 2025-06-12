import json

def extract_JSON(text: str):
    try:
        start = text.index('{')
        end = text.rindex('}')
    except ValueError as error:
        raise ValueError("No JSON object found") from error
       
    try:
        json_object = json.loads(text[start:end+1])
    except ValueError as error:
        raise Exception("Invalid JSON") from error

    return json_object

