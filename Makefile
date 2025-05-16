PYTHON=python3

SRC_DIR=src
TEST_DIR=tests
SCRIPT_DIR=script

.PHONY: all run test download-rag-documents

all: run

run:
	@$(PYTHON) $(SRC_DIR)/main.py

test:
	@export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) $(TEST_DIR)/test.py

download-rag-documents:
$(PYTHON) $(SCRIPT_DIR)/download-rag-docs.py

