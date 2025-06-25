from navigator import extract_JSON
from run_test import run_test

def test_extract_JSON_no_JSON():
    text = "This is some text without JSON."

    try:
        extract_JSON(text)
    except ValueError:
        return True
    except Exception:
        return False
    
    return False

def test_extract_JSON_invalid_JSON():
    # Invalid JSON because the items are not seperated with commas
    text = """
        {
            "item": 42
            "other": 69
        }
        """

    try:
        extract_JSON(text)
    except ValueError:
        return False
    except Exception:
        return True

    return False

def test_extract_JSON_valid_JSON():
    text = """
        {
            "item": 42,
            "other": 69
        }
        """

    try:
        extract_JSON(text)
    except ValueError:
        return False
    except Exception:
        return False

    return True

def test_suite_extract_JSON():
    print("test_suite_extract_JSON: ", end="")
    run_test(test_extract_JSON_no_JSON)
    run_test(test_extract_JSON_invalid_JSON)
    run_test(test_extract_JSON_valid_JSON)
    print("")
