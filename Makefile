PYTHON=python3

SRC_DIR=src
TEST_DIR=tests

.PHONY: all run test

all: run

run:
	@$(PYTHON) $(SRC_DIR)/main.py

test:
	@export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) $(TEST_DIR)/test.py
