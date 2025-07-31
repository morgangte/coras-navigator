import React, { createRef } from 'react';

// Render Markdown
import ReactMarkdown from 'react-markdown';
// Markdown tables
import remarkGfm from 'remark-gfm';

import joint from 'jointjs';

import './navigator.css';

import Editor from '../Editor/Editor';
import FileUpload from './FileUpload';
import CorasReport from './Report';

import { svgStringToImage } from './Report.js';
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
        this.onIncludeGeneratedModelCheckboxChange = this.onIncludeGeneratedModelCheckboxChange.bind(this);
        this.generatePdfReport = this.generatePdfReport.bind(this);

        this.state = {
            // User input
            files: [],
            corasModelFilename: "",
            contextDescription: "",

            // Generated
            corasModelTranscription: "",
            summary: "",
            analysis: "",
            retrievedContext: "",
            generatedModel: null,
            
            // Controls
            checked: true,
            loading: false,
            includeGeneratedModelInSummary: false,

            displaySummary: false,
            displaySummaryStatusMessage: false,
            summaryStatusMessage: "Generating summary...",
            
            displayAnalysis: false,
            displayAnalysisStatusMessage: false,
            analysisStatusMessage: "Generating analysis...",
          
            displayContext: false,

            displayModel: false,
            displayModelStatusMessage: false,
            modelStatusMessage: "Generating CORAS Threat Model...",
        };
    }

    onCorasModelSelect(file) {
        if (this.state.loading) return;
        if (!file)              return;
        
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (event) => {
            try {
                const text = naturalLanguageFromThreatModel(JSON.parse(event.target.result));
                console.log(text);
                this.setState({ 
                    corasModelTranscription: text,
                    corasModelFilename: file.name,
                    checked: false
                });
            } catch (error) {
                console.error("Failed to load file: " + error);
            }
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
        this.setState({ contextDescription: event.target.value });
    }

    onGenerateSummaryButtonClick() {
        this.setState({
            summaryStatusMessage: "Generating a structured description of the system...",
            displaySummaryStatusMessage: true,
            loading: true
        });

        let modelTranscription = this.state.corasModelTranscription;

        if (this.state.checked && this.state.generatedModel != null) {
            this.setState({
                files: [],
            });
            modelTranscription = naturalLanguageFromThreatModel(this.state.generatedModel);
        }

        let contextDescription = this.state.contextDescription;
        if (modelTranscription !== "") {
            contextDescription += "\nExisting threat model:\n" + modelTranscription;
        }
        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/generate_summary", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                'context-description': contextDescription
            })
        }).then((response) => {
            if (response.ok) {
                response.json().then((response_json) => {
                    this.setState({
                        summary: response_json['summary'], 
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
                    displayAnalysis: true,
                    displayContext: false,
                    displayAnalysisStatusMessage: false
                });
                this.fetchThreatModel();
                // console.log("Retrieved context from the description of target of analysis: \n" + this.state.retrievedContext);
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false,
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
                console.log("Received JSON:", response_json['coras_model']); 
                const generatedModel = this.editorRef.current.changeGraphFromDAG(response_json['coras_model']);
                this.setState({
                    loading: false,
                    displayModel: true,
                    displayModelStatusMessage: false,
                    generatedModel: generatedModel,
                    checked: true
                });
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false,
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
            analysisStatusMessage: "Please edit the context description of your system.",    
            displayModel: false,
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

    onIncludeGeneratedModelCheckboxChange() {
        const checked = this.state.checked;
        this.setState({
            checked: !checked,
        });
    }

    generatePdfReport() {
        let svg = this.editorRef.current.getSvg();
        const report = new CorasReport();

        report.addSubTitle("Input description of the target of analysis: ")
              .addParagraph(this.state.contextDescription)
              .addSubTitle("Structured description of the target of analysis: ")
              .addParagraph(this.state.summary)
              .addSubTitle("Retrieved context for the risk analysis: ")
              .addParagraph(this.state.retrievedContext)
              .addSubTitle("Risk analysis: ")
              .addParagraph(this.state.analysis)
              .addSubTitle("CORAS Threat model: ");

        svgStringToImage(svg.source, 2000, 2000).then(pngSrc => {
            report.addPNG(pngSrc, svg.width, svg.height, "threat_model")
                  .generate("report.pdf");
        });
    }

    render() {
        return (<div id="coras-navigator">
            <div className="one-line">
                <p>Please provide a context description of your system:</p>
                <div className="file-uploads">
                    {this.state.generatedModel != null ? <label>
                        <input type="checkbox" checked={this.state.checked} onChange={() => { 
                            this.onIncludeGeneratedModelCheckboxChange(); 
                        }}/>
                        Include generated CORAS Threat Model
                    </label> : null }    
                    <FileUpload title="Upload a CORAS Threat Model" onFileSelect={this.onCorasModelSelect} disabled={this.state.loading}/>
                </div>
            </div>
            {this.loadedFilesElementsToRender()}
            <textarea placeholder="We are developing..." onChange={this.onContextDescriptionInputValueChange}></textarea>
            <div className="action-buttons">
                <button onClick={this.onGenerateSummaryButtonClick} disabled={this.state.loading}>
                    Send
                </button>
            </div>
            {this.statusMessage(this.state.displaySummaryStatusMessage, this.state.summaryStatusMessage)}
            {this.state.displaySummary ? <>
                <p>Here is a structured description of the system: </p>
                <div className="generated-text">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{this.state.summary}</ReactMarkdown>
                </div>
                <p>Does this description accurately reflect your system?</p>
                <div className="action-buttons">
                    <button onClick={this.onSummaryAccurateYesButtonClick}>Yes, proceed to the risk analysis</button>
                    <button onClick={this.onSummaryAccurateNoButtonClick}>No</button>
                </div>
            </> : null}
            {this.statusMessage(this.state.displayAnalysisStatusMessage, this.state.analysisStatusMessage)}
            {this.state.displayAnalysis ? <>
                <p>Risk assessment:</p> 
                <div className="generated-text">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{this.state.analysis}</ReactMarkdown>
                </div>
                <div className="action-buttons">
                    <button onClick={this.onDisplayContextButtonClick}>{this.state.displayContext ? "- Hide retrieved context" : "+ Show retrieved context"}</button>
                </div>
                <pre className="generated-text">{this.state.displayContext ? this.state.retrievedContext : ""}</pre>
            </> : null}
            {this.statusMessage(this.state.displayModelStatusMessage, this.state.modelStatusMessage)}
            <div className={this.state.displayModel ? "coras-model-container" : "coras-model-container hidden"}>
                <Editor ref={this.editorRef}/>
            </div>
            {this.state.displayModel ? <>
                <div className="action-buttons">
                    <button onClick={this.generatePdfReport}>Download report of analysis</button>
                </div>
            </> : null}
        </div>);
    }
}

export default Navigator;

