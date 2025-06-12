PYTHON=python3
OLLAMA_HOST=localhost:11435

CORAS_DIR=coras-navigator
UI_DIR=ui

SRC_DIR=src
TEST_DIR=tests
SCRIPT_DIR=script
UPLOADS_DIR=uploaded-files

.PHONY: all navigator ui test download-rag-documents rm-files-uploaded-by-user clean

all: 
	@echo "Select a target between: \n\
        navigator: Runs the CORAS Navigator API server \n\
        ui: Runs the React app UI server \n\
        test: Runs unit tests \n\
        download-rag-documents: Downloads documents for RAG"

navigator: rm-files-uploaded-by-user
	cd $(CORAS_DIR) && export OLLAMA_HOST=$(OLLAMA_HOST) && export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) app.py

ui: rm-files-uploaded-by-user
	cd $(UI_DIR) && npm start

test:
	cd $(CORAS_DIR) && export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) $(TEST_DIR)/test.py

download-rag-documents:
	$(PYTHON) $(SCRIPT_DIR)/download-rag-docs.py

rm-files-uploaded-by-user:
	rm -rf $(CORAS_DIR)/$(UPLOADS_DIR)

clean: rm-files-uploaded-by-user
	rm -rf $(UI_DIR)/dist
	rm -rf $(UI_DIR)/.parcel-cache
	rm -rf $(CORAS_DIR)/$(SRC_DIR)/__pycache__
	rm -rf $(CORAS_DIR)/$(TEST_DIR)/__pycache__

