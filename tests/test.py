from test_extract_JSON import *

def run_test(test_function):
    if test_function():
        print('.', end="")
    else:
        print(f"\nTest failed: {test_function.__name__}")
        exit(1)

def run_test_suites():
    test_suite_extract_JSON()
    print("All tests have been passed.")

if __name__ == "__main__":
    run_test_suites()

