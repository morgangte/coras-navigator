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

        this.onCorasModelSelect = this.onCorasModelSelect.bind(this);
        this.onContextDescriptionInputValueChange = this.onContextDescriptionInputValueChange.bind(this);
        this.onGenerateSummaryButtonClick = this.onGenerateSummaryButtonClick.bind(this);
        this.onSummaryAccurateYesButtonClick = this.onSummaryAccurateYesButtonClick.bind(this);
        this.onSummaryAccurateNoButtonClick = this.onSummaryAccurateNoButtonClick.bind(this);
        this.onFileElementRemoveButtonClick = this.onFileElementRemoveButtonClick.bind(this);
        this.onDisplayContextButtonClick = this.onDisplayContextButtonClick.bind(this);

        this.state = {
            // User input
            files: [],
            corasModelTranscription: "",
            corasModelFilename: "",
            contextDescription: "",
            // Generated
            summary: "",
            analysis: "",
            retrievedContext: "",
            // Controls
            inputsDisabled: false,
            displaySummary: false,
            summaryStatusMessage: "Generating summary...",
            displaySummaryStatusMessage: false,
            displayAnalysis: false,
            analysisStatusMessage: "Generating analysis...",
            displayContext: false,
            displayAnalysisStatusMessage: false,
            displayModel: false,
            modelStatusMessage: "Generating CORAS Threat Model...",
            displayModelStatusMessage: false,
            loading: false
        };
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
                        displayAnalysis: false,
                        displayAnalysisStatusMessage: false,
                        displayModel: false,
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
            body: JSON.stringify({
                'summary': this.state.summary
            })
        }).then((response) => {
            if (!response.ok) {
                throw Error("Something went wrong");
            }
            
            response.json().then((response_json) => {
                this.setState({
                    loading: false,
                    analysis: response_json['analysis'], 
                    retrievedContext: response_json['retrieved-context'],
                    inputsDisabled: false,
                    displayAnalysis: true,
                    displayContext: false,
                    displayAnalysisStatusMessage: false
                });
                this.fetchThreatModel();
                console.log("Retrieved context from the description of target of analysis: \n" + this.state.retrievedContext);
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
            body: JSON.stringify({
                'risk-analysis': this.state.analysis
            })
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

    onDisplayContextButtonClick() {
        this.setState({
            displayContext: !this.state.displayContext,
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

    render() {
        return (<div id="coras-navigator">
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
                <div className="action-buttons">
                    <button onClick={this.onDisplayContextButtonClick}>{this.state.displayContext ? "- Hide retrieved context" : "+ Show retrieved context"}</button>
                </div>
                <pre className="generated-text">{this.state.displayContext ? this.state.retrievedContext : ""}</pre>
            </> : null}
            {this.statusMessage(this.state.displayModelStatusMessage, this.state.modelStatusMessage)}
            <div className={this.state.displayModel ? "coras-model-container" : "coras-model-container hidden"}>
                <Editor ref={this.editorRef}/>
            </div>
        </div>);
    }
}

export default Navigator;

