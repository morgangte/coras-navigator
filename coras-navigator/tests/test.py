from test_extract_JSON import test_suite_extract_JSON
from test_is_list_equal_to_json_file_content import test_suite_is_list_equal_to_json_file_content
from test_router_get_answer import test_suite_get_answer

def run_test_suites():
    test_suite_extract_JSON()
    test_suite_is_list_equal_to_json_file_content()
    test_suite_get_answer()
    print("All tests have been passed.")

if __name__ == "__main__":
    run_test_suites()

