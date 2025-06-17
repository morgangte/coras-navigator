import requests
import zipfile
import os
import json

TEMP_DIR = "./coras-navigator/.temp/"
RAG_DOCS_DIR = "./coras-navigator/rag-docs/"

def create_temp_directory():
    if not os.path.exists(TEMP_DIR):
        os.mkdir(TEMP_DIR)
        print(f"Created directory '{TEMP_DIR}'")

def get_json_from_file(filepath: str):
    with open(filepath, 'r') as file:
        data = json.load(file)
    return data

def download(url: str, save_path: str, chunk_size=128):
    print(f"Downloading {save_path} from {url}...")
    r = requests.get(url, stream=True)
    with open(save_path, 'wb') as fd:
        for chunk in r.iter_content(chunk_size=chunk_size):
            fd.write(chunk)

def extract(filepath: str, extract_directory: str):
    print(f"Extracting  {filepath} to {extract_directory}...")
    with zipfile.ZipFile(filepath, "r") as zip_file:
        zip_file.extractall(extract_directory)

def delete(filepath: str):
    print(f"Deleting    {filepath}...")
    os.remove(filepath)

def rename(filename: str, new_filename: str):
    print(f"Renaming    {filename} to {new_filename}...")
    os.rename(filename, new_filename)

def download_rag_docs():
    json = get_json_from_file("./coras-navigator/resource/rag-sources.json")
    
    for source in json["zip_sources"]: 
        if os.path.exists(f"{RAG_DOCS_DIR}{source['final_filename']}"):
            print(f"File {RAG_DOCS_DIR}{source['final_filename']} already exists.\n***") 
            continue       
 
        download(source['url'], f"{TEMP_DIR}{source['zip_filename']}")
        extract(f"{TEMP_DIR}{source['zip_filename']}", RAG_DOCS_DIR)
        delete(f"{TEMP_DIR}{source['zip_filename']}")
        rename(f"{RAG_DOCS_DIR}{source['original_filename']}", f"{RAG_DOCS_DIR}{source['final_filename']}")
        print("***")

if __name__ == "__main__":
    create_temp_directory()
    download_rag_docs()

