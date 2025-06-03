PYTHON=python3

CORAS_DIR=coras-navigator
UI_DIR=ui

SRC_DIR=src
TEST_DIR=tests
SCRIPT_DIR=script

.PHONY: all run test download-rag-documents

all: run

run:
	@$(PYTHON) $(SRC_DIR)/main.py

test:
	cd $(CORAS_DIR) && export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) $(TEST_DIR)/test.py

download-rag-documents:
	$(PYTHON) $(SCRIPT_DIR)/download-rag-docs.py

