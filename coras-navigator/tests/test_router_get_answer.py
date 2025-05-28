from router import *
from run_test import run_test

def test_get_answer_yes_0():
    return get_answer("This text ends with yes") == "Yes"

def test_get_answer_yes_1():
    return get_answer("At the end there is YES.") == "Yes"

def test_get_answer_yes_2():
    return get_answer("You should find yEs!") == "Yes"

def test_get_answer_no_0():
    return get_answer("This text ends with no") == "No"

def test_get_answer_no_1():
    return get_answer("At the end there is NO.") == "No"

def test_get_answer_no_2():
    return get_answer("You should find nO!") == "No"

def test_get_answer_None():
    return get_answer("Cannot answer") == None

def test_suite_get_answer():
    print("test_suite_get_answer: ", end="")
    run_test(test_get_answer_yes_0)
    run_test(test_get_answer_yes_1)
    run_test(test_get_answer_yes_2)
    run_test(test_get_answer_no_0)
    run_test(test_get_answer_no_1)
    run_test(test_get_answer_no_2)
    run_test(test_get_answer_None)
    print("")

