import json

from rag import is_list_equal_to_json_file_content
from run_test import run_test

def test_is_list_equal_to_json_file_content_true():
    l = ["json", "test", "sintef"]
    return is_list_equal_to_json_file_content(
        l, 
        "./tests/resource/test_is_list_equal_to_json_file_content.json"
    )

def test_is_list_equal_to_json_file_content_false():
    l = ["test", "test2"]
    return not is_list_equal_to_json_file_content(
        l, 
        "./tests/resource/test_is_list_equal_to_json_file_content.json"
    )

def test_suite_is_list_equal_to_json_file_content():
    print("test_suite_is_list_equal_to_json_file_content: ", end="")
    run_test(test_is_list_equal_to_json_file_content_true)
    run_test(test_is_list_equal_to_json_file_content_false)
    print("")

