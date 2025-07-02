import React, { createRef } from 'react';
import joint from 'jointjs';

import './navigator.css'
import Editor from '../Editor/Editor';
import FileUpload from './FileUpload';

import { naturalLanguageFromThreatModel } from '../Editor/DAG.js';

const CORAS_NAVIGATOR_IP = "localhost";
const CORAS_NAVIGATOR_PORT = 5242;

const DEVELOPMENT_MODE = false;

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.editorRef = React.createRef();

        this.onFileSelect = this.onFileSelect.bind(this); 
        this.onCorasModelSelect = this.onCorasModelSelect.bind(this);
        this.onContextDescriptionInputValueChange = this.onContextDescriptionInputValueChange.bind(this);
        this.onGenerateSummaryButtonClick = this.onGenerateSummaryButtonClick.bind(this);
        this.onSummaryAccurateYesButtonClick = this.onSummaryAccurateYesButtonClick.bind(this);
        this.onSummaryAccurateNoButtonClick = this.onSummaryAccurateNoButtonClick.bind(this);
        this.onFileElementRemoveButtonClick = this.onFileElementRemoveButtonClick.bind(this);

        this.state = {
            files: [],
            corasModelTranscription: "",
            corasModelFilename: "",
            contextDescription: "",
            summary: "",
            analysis: "",
            inputsDisabled: false,
            displaySummary: false,
            summaryStatusMessage: "Generating summary...",
            displaySummaryStatusMessage: false,
            displayAnalysis: false,
            analysisStatusMessage: "Generating analysis...",
            displayAnalysisStatusMessage: false,
            displayModel: false,
            modelStatusMessage: "Generating CORAS Threat Model...",
            displayModelStatusMessage: false,
            loading: false
        };
        
        // DEVELOPMENT MODE ONLY
        this.displayDummyCorasModel = this.displayDummyCorasModel.bind(this);
    }

    onFileSelect(file) {
        if (this.state.inputsDisabled) return;
        if (!file) return;
        
        let extension = file.name.split(".").at(-1).toLowerCase();
        console.log(extension);
        if (extension != "pdf") {
            alert("Only PDF files are supported");
            return;
        }

        this.setState(prevState => ({ 
            files: [...prevState.files, file.name],
            inputsDisabled: true
        }));

        const form_data = new FormData();
        form_data.append('file', file);
        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/upload_file", {
            method: 'POST',
            body: form_data
        }).then((response) => {
            if (response.ok) {
                console.log(response);
                response.json().then((response_json) => {
                    console.log(response_json);
                });
                this.setState({
                    inputsDisabled: false
                });
            } else {
                throw Error("Something went wrong while uploading file");
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                inputsDisabled: false
            });
        });
    }

    onCorasModelSelect(file) {
        if (this.state.inputsDisabled) return;
        if (!file)                     return;
        
        
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (event) => {
            const text = naturalLanguageFromThreatModel(JSON.parse(event.target.result));
            console.log(text);
            this.setState({ 
                corasModelTranscription: text,
                corasModelFilename: file.name
            });
        }
        reader.onerror = (event) => {
            console.log("Error while reading CORAS Threat Model file");
            this.setState({
                corasModelTranscription: "",
                corasModelFilename: ""
            });
        }
    }

    onContextDescriptionInputValueChange(event) {
        this.setState({contextDescription: event.target.value});
    }

    onGenerateSummaryButtonClick() {
        this.setState({
            inputsDisabled: true,
            summaryStatusMessage: "Generating a structured description of the system...",
            displaySummaryStatusMessage: true,
            loading: true
        });

        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/generate_summary", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                'context-description': this.state.contextDescription + "\n" + this.state.corasModelTranscription
            })
        }).then((response) => {
            if (response.ok) {
                response.json().then((response_json) => {
                    this.setState({
                        summary: response_json['summary'], 
                        inputsDisabled: false,
                        displaySummary: true,
                        displaySummaryStatusMessage: false,
                        loading: false
                    });                
                });
            } else {
                throw Error("Something went wrong");
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                inputsDisabled: false,
                summaryStatusMessage: "Something went wrong.",
                displaySummaryStatusMessage: true,
                loading: false
            });
        });
    }

    onSummaryAccurateYesButtonClick() {
        this.setState({
            displayAnalysisStatusMessage: true,
            analysisStatusMessage: "Generating analysis...",
            loading: true,
            displayAnalysis: false,
            displayModel: false
        });

        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/generate_risks", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({})
        }).then((response) => {
            if (!response.ok) {
                throw Error("Something went wrong");
            }
            
            response.json().then((response_json) => {
                this.setState({
                    loading: false,
                    analysis: response_json['analysis'], 
                    inputsDisabled: false,
                    displayAnalysis: true,
                    displayAnalysisStatusMessage: false
                });
                this.fetchThreatModel();
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false,
                inputsDisabled: false,
                analysisStatusMessage: "Something went wrong.",
                displayAnalysisStatusMessage: true
            });
        });
    }

    fetchThreatModel() {
        this.setState({
            displayModelStatusMessage: true,
            modelStatusMessage: "Generating CORAS Threat Model...",
            loading: true,
            inputsDisabled: true,
            displayModel: false
        });

        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/generate_coras_model", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({})
        }).then((response) => {
            if (!response.ok) {
                throw Error("Something went wrong.");
            }

            response.json().then((response_json) => {
                this.editorRef.current.changeGraph('threat');
                this.setState({
                    loading: false,
                    inputsDisabled: false,
                    displayModel: true,
                    displayModelStatusMessage: false,
                });
                console.log("Received JSON:", response_json['coras_model']); 
                this.editorRef.current.changeGraphFromDAG(response_json['coras_model']);
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false,
                inputsDisabled: false,
                modelStatusMessage: "Something went wrong.",
                displayModelStatusMessage: true
            });
        });
    }

    onSummaryAccurateNoButtonClick() {
        this.setState({
            loading: false,
            displayAnalysis: false,
            displayAnalysisStatusMessage: true,
            analysisStatusMessage: "Please edit the context description of your system."    
        });
    }

    loadedFileElementToRender(filename, key) {
        let id = "remove-file-button-FILENAME-" + filename;
        return (<div className="file-square" key={key}>
                    <button className="remove-file" id={id} onClick={this.onFileElementRemoveButtonClick}>×</button>
                    <p className="file-name">{filename}</p>
                </div>);
    }

    loadedFilesElementsToRender() {
        let fileElements = [];
        let index = 0;
        for (let filename of this.state.files) {
            fileElements.push(this.loadedFileElementToRender(filename, index));
            index += 1;
        }
        
        if (this.state.corasModelFilename !== "") {
            fileElements.push(this.loadedFileElementToRender(this.state.corasModelFilename, index+1));
        }

        return (<div className='files-list'>{fileElements}</div>);
    }

    onFileElementRemoveButtonClick(event) {
        const filename = event.target.id.split("-FILENAME-").at(-1);
        
        // The file element corresponds to the uploaded CORAS Model
        if (filename === this.state.corasModelFilename) {
            this.setState({
                corasModelFilename: "",
                corasModelTranscription: ""
            });
            return;
        }

        this.setState(prevState => ({ 
            files: prevState.files.filter(f => f !== filename)
        }));

        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/remove_file", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                'filename-to-remove': filename
            })
        }).then((response) => {
            if (response.ok) {
                response.json().then((response_json) => {
                    console.log(response_json); 
                });
            } else {
                throw Error("Something went wrong");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    statusMessage(condition, message) {
        if (condition) {
            return (
                <div className="navigator-status-message-container">
                    {this.state.loading ? <div className="animated-loading-element"></div> : null}
                    <p>{message}</p>
                </div>
            );
        } else {
            return null;
        }
    }

    // DEVELOPMENT MODE ONLY
    displayDummyCorasModel() {
        const test_coras_model = "{\"edges\": [ { \"source\": \"Untrusted Seller\", \"target\": \"Threat Scenario 1\", \"vulnerabilities\": [ \"Weak identity verification process\", \"Lack of secure storage for sensitive documents\" ] }, { \"source\": \"Threat Scenario 1\", \"target\": \"Unwanted Incident 1\", \"vulnerabilities\": [] }, { \"source\": \"Unwanted Incident 1\", \"target\": \"Seller Accounts\", \"vulnerabilities\": [] }, { \"source\": \"Unwanted Incident 1\", \"target\": \"Customer Data\", \"vulnerabilities\": [] }, { \"source\": \"External Attacker\", \"target\": \"Threat Scenario 2\", \"vulnerabilities\": [ \"Unpatched vulnerabilities in AWS services\", \"Inadequate network segmentation\" ] }, { \"source\": \"Threat Scenario 2\", \"target\": \"Unwanted Incident 2\", \"vulnerabilities\": [] }, { \"source\": \"Unwanted Incident 2\", \"target\": \"Customer Payment Information\", \"vulnerabilities\": [] }, { \"source\": \"Unwanted Incident 2\", \"target\": \"Personal Identifiable Information\", \"vulnerabilities\": [] } ], \"vertices\": [ { \"id\": \"Untrusted Seller\", \"text\": \"Untrusted seller with malicious intent\", \"type\": \"human_threat_non_malicious\" }, { \"id\": \"Threat Scenario 1\", \"text\": \"A seller creates an account on the platform using fake identification documents to conceal their true identity.\", \"type\": \"threat_scenario\" }, { \"id\": \"Unwanted Incident 1\", \"text\": \"The untrusted seller gains unauthorized access to their account, allowing them to manipulate sales data, steal customer information, or commit fraud.\", \"type\": \"unwanted_incident\" }, { \"id\": \"Seller Accounts\", \"text\": \"Seller accounts\", \"type\": \"asset\" }, { \"id\": \"Customer Data\", \"text\": \"customer data (e.g., payment information, PII)\", \"type\": \"asset\" }, { \"id\": \"External Attacker\", \"text\": \"External attacker exploiting vulnerabilities in AWS infrastructure\", \"type\": \"non_human_threat\" }, { \"id\": \"Threat Scenario 2\", \"text\": \"An external attacker discovers an unpatched vulnerability in one of the AWS services used by the e-commerce platform, allowing them to gain unauthorized access to user data.\", \"type\": \"threat_scenario\" }, { \"id\": \"Unwanted Incident 2\", \"text\": \"The attacker breaches the system, gaining access to customer payment information and PII, which can be used for malicious purposes (e.g., identity theft, financial fraud).\", \"type\": \"unwanted_incident\" }, { \"id\": \"Customer Payment Information\", \"text\": \"Customer payment information\", \"type\": \"asset\" }, { \"id\": \"Personal Identifiable Information\", \"text\": \"personal identifiable information (PII)\", \"type\": \"asset\" } ] }";
        console.log("test model: ", JSON.parse(test_coras_model));
        this.editorRef.current.changeGraph('threat');
        this.editorRef.current.changeGraphFromDAG(JSON.parse(test_coras_model));
        this.setState({
            displayAnalysis: true,
            displayModel: true
        });
    }

    render() {
        return (<div id="coras-navigator">
            {DEVELOPMENT_MODE ? <>
                <div>
                    <button onClick={this.displayDummyCorasModel}>Test CORAS Model</button>
                </div>
            </> : null}
            <div className="one-line">
                <p>Please provide a context description of your system:</p>
                <div className="file-uploads">
                    <FileUpload title="Upload a file" onFileSelect={this.onFileSelect} disabled={this.state.inputsDisabled}/>
                    <FileUpload title="Upload a CORAS Threat Model" onFileSelect={this.onCorasModelSelect} disabled={this.state.inputsDisabled}/>
                </div>
            </div>
            {this.loadedFilesElementsToRender()}
            <textarea placeholder="We are developing..." onChange={this.onContextDescriptionInputValueChange}></textarea>
            <div className="action-buttons">
                <button onClick={this.onGenerateSummaryButtonClick} disabled={this.state.inputsDisabled}>
                    Send
                </button>
            </div>
            {this.statusMessage(this.state.displaySummaryStatusMessage, this.state.summaryStatusMessage)}
            {this.state.displaySummary ? <>
                <p>Here is a structured description of the system: </p>
                <pre className="generated-text">{this.state.summary}</pre>
                <p>Does this description accurately reflect your system?</p>
                <div className="action-buttons">
                    <button onClick={this.onSummaryAccurateYesButtonClick}>Yes, proceed to the risk analysis</button>
                    <button onClick={this.onSummaryAccurateNoButtonClick}>No</button>
                </div>
            </> : null}
            {this.statusMessage(this.state.displayAnalysisStatusMessage, this.state.analysisStatusMessage)}
            {this.state.displayAnalysis ? <>
                <p>Risk assessment:</p> 
                <pre className="generated-text">{this.state.analysis}</pre>
            </> : null}
            {this.statusMessage(this.state.displayModelStatusMessage, this.state.modelStatusMessage)}
            <div className={this.state.displayModel ? "coras-model-container" : "coras-model-container hidden"}>
                <Editor ref={this.editorRef}/>
            </div>
        </div>);
    }
}

export default Navigator;

