def run_test(test_function):
    if test_function():
        print('.', end="")
    else:
        print(f"\nTest failed: {test_function.__name__}")
        exit(1)

