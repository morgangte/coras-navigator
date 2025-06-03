PYTHON=python3

CORAS_DIR=coras-navigator
UI_DIR=ui

SRC_DIR=src
TEST_DIR=tests
SCRIPT_DIR=script

.PHONY: all navigator ui test download-rag-documents

all: 
	@echo "Select a target between: \n\
        navigator: Runs the CORAS Navigator API server \n\
        ui: Runs the React app UI server \n\
        test: Runs unit tests \n\
        download-rag-documents: Downloads documents for RAG"

navigator: 
	cd $(CORAS_DIR) && export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) app.py

ui:
	cd $(UI_DIR) && npm start

#run:
#	@$(PYTHON) $(SRC_DIR)/main.py

test:
	cd $(CORAS_DIR) && export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) $(TEST_DIR)/test.py

download-rag-documents:
	$(PYTHON) $(SCRIPT_DIR)/download-rag-docs.py

