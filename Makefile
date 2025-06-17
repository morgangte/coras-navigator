PYTHON=python3
OLLAMA_HOST=localhost:11435

CORAS_DIR=coras-navigator
UI_DIR=ui

SRC_DIR=src
TEST_DIR=tests
SCRIPT_DIR=script
UPLOADS_DIR=uploaded-files

.PHONY: all navigator ui test download-rag-documents rm-files-uploaded-by-user clean distclean

all: 
	@echo "Available targets: \n\
        navigator: Run the CORAS Navigator API server \n\
        ui: Run the React app UI server \n\
        test: Run unit tests \n\
        download-rag-documents: Download documents for RAG\n\
        clean: Clean cache and build files\n\
        distclean: Clean everything except sources"

navigator: rm-files-uploaded-by-user
	cd $(CORAS_DIR) && export OLLAMA_HOST=$(OLLAMA_HOST) && export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) app.py

ui: rm-files-uploaded-by-user
	cd $(UI_DIR) && npm start

test:
	cd $(CORAS_DIR) && export PYTHONPATH=./$(SRC_DIR) && $(PYTHON) $(TEST_DIR)/test.py

download-rag-documents:
	$(PYTHON) $(CORAS_DIR)/$(SCRIPT_DIR)/download-rag-docs.py && $(PYTHON) $(CORAS_DIR)/$(SCRIPT_DIR)/format-rag-docs.py

rm-files-uploaded-by-user:
	rm -rf $(CORAS_DIR)/$(UPLOADS_DIR)

clean: rm-files-uploaded-by-user
	rm -rf $(UI_DIR)/dist
	rm -rf $(UI_DIR)/.parcel-cache
	rm -rf $(CORAS_DIR)/$(SRC_DIR)/__pycache__
	rm -rf $(CORAS_DIR)/$(TEST_DIR)/__pycache__

distclean: clean
	rm -rf $(CORAS_DIR)/rag-docs/*
	rm -rf $(CORAS_DIR)/vector-stores/*

