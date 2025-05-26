from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/generate_summary', methods=["GET", "POST"])
def generate_summary():
    if request.method != "POST":
        print("WARNING: Wrong request method")
        return
    
    json_data = request.get_json()
    print(f"Received JSON: {json_data}")
    return {
        'summary': 'This is the summary of the context description'
    }

@app.route('/perform_analysis', methods=["GET", "POST"])
def perform_analysis():
    if request.method != "POST":
        print("WARNING: Wrong request method")
        return

    json_data = request.get_json()
    print(f"Received JSON: {json_data}")
    return {
        'analysis': 'This is the generated analysis',
        'coras': 'This is the generated CORAS Threat Model is JSON'
    }

