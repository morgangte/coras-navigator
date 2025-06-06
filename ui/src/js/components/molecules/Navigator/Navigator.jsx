import React, { createRef } from 'react';
import joint from 'jointjs';

import './navigator.css'
import Editor from '../Editor/Editor';
import FileUpload from './FileUpload';

// For selecting editor-tabrow "Before" 
import { ToolTabSelected } from '../../../store/Actions';
const BEFORE_TAB_NO = 0;

const CORAS_NAVIGATOR_IP = "localhost";
const CORAS_NAVIGATOR_PORT = 5000;

const TEST_CORAS_DIAGRAM = "{ \"cells\": [ { \"type\": \"coras.riskElement\", \"position\": { \"x\": 644.1328125, \"y\": 230.0703125 }, \"size\": { \"width\": 190, \"height\": 80 }, \"angle\": 0, \"id\": \"9625c751-0cad-4126-992f-96cb4c05cecd\", \"perspective\": 0, \"perspectives\": { \"0\": { \"icon/href\": \"data:image/svg+xml;utf8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!--%20Generator%3A%20Adobe%20Illustrator%2012.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%2051448)%20%20--%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%20%5B%09%3C!ENTITY%20ns_svg%20%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%09%3C!ENTITY%20ns_xlink%20%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%5D%3E%3Csvg%20%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22%26ns_svg%3B%22%20xmlns%3Axlink%3D%22%26ns_xlink%3B%22%20width%3D%2244.612%22%20height%3D%2236.083%22%09%20viewBox%3D%220%200%2044.612%2036.083%22%20overflow%3D%22visible%22%20enable-background%3D%22new%200%200%2044.612%2036.083%22%20xml%3Aspace%3D%22preserve%22%3E%3Cg%3E%09%3Cg%3E%09%09%3Cpolygon%20fill%3D%22%23C30009%22%20enable-background%3D%22new%20%20%20%20%22%20points%3D%220.725%2C35.66%2043.883%2C35.677%2022.186%2C0.77%20%09%09%22%2F%3E%09%09%3Cpath%20d%3D%22M21.84%2C0.558L0%2C36.064l44.612%2C0.019L22.184%2C0L21.84%2C0.558z%20M22.188%2C1.54c0.658%2C1.058%2C20.237%2C32.557%2C20.967%2C33.732%09%09%09c-1.386-0.001-40.33-0.017-41.706-0.017C2.169%2C34.083%2C21.535%2C2.601%2C22.188%2C1.54z%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M22.201%2C7.239c2.237%2C3.599%2C13.094%2C21.067%2C15.561%2C25.034c-4.693-0.002-26.288-0.01-30.952-0.012%09%09C9.242%2C28.306%2C19.981%2C10.847%2C22.201%2C7.239z%22%2F%3E%09%3Cg%3E%09%09%3Crect%20x%3D%2220.452%22%20y%3D%2213.433%22%20width%3D%223.402%22%20height%3D%2211.096%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20d%3D%22M24.145%2C28.582c0%2C1.115-0.906%2C2.021-2.029%2C2.021c-1.117%2C0-2.024-0.906-2.024-2.021c0-1.117%2C0.907-2.024%2C2.024-2.024%09%09C23.239%2C26.557%2C24.145%2C27.464%2C24.145%2C28.582z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\", \"icon/height\": 40 }, \"1\": { \"icon/href\": \"data:image/svg+xml;utf8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!--%20Generator%3A%20Adobe%20Illustrator%2012.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%2051448)%20%20--%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%20%5B%09%3C!ENTITY%20ns_svg%20%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%09%3C!ENTITY%20ns_xlink%20%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%5D%3E%3Csvg%20%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22%26ns_svg%3B%22%20xmlns%3Axlink%3D%22%26ns_xlink%3B%22%20width%3D%2244.612%22%20height%3D%2236.083%22%20%20%20%20%20viewBox%3D%220%200%2048%2040%22%20overflow%3D%22visible%22%20enable-background%3D%22new%200%200%2048%2040%22%20xml%3Aspace%3D%22preserve%22%3E%20%20%20%20%20%3Cdefs%3E%20%20%20%20%20%3Cg%20id%3D%22outline%22%3E%09%09%3Cpolygon%20fill%3D%22%23FFFFFF%22%20enable-background%3D%22new%20%20%20%20%22%20points%3D%220.725%2C35.66%2043.883%2C35.677%2022.186%2C0.77%20%09%09%22%2F%3E%09%09%3Cpath%20d%3D%22M21.84%2C0.558L0%2C36.064l44.612%2C0.019L22.184%2C0L21.84%2C0.558z%20M22.188%2C1.54c0.658%2C1.058%2C20.237%2C32.557%2C20.967%2C33.732%09%09%09c-1.386-0.001-40.33-0.017-41.706-0.017C2.169%2C34.083%2C21.535%2C2.601%2C22.188%2C1.54z%22%2F%3E%09%3C%2Fg%3E%3Cg%20id%3D%22colored%22%3E%09%3Cg%3E%09%09%3Cpolygon%20fill%3D%22%23C30009%22%20enable-background%3D%22new%20%20%20%20%22%20points%3D%220.725%2C35.66%2043.883%2C35.677%2022.186%2C0.77%20%09%09%22%2F%3E%09%09%3Cpath%20d%3D%22M21.84%2C0.558L0%2C36.064l44.612%2C0.019L22.184%2C0L21.84%2C0.558z%20M22.188%2C1.54c0.658%2C1.058%2C20.237%2C32.557%2C20.967%2C33.732%09%09%09c-1.386-0.001-40.33-0.017-41.706-0.017C2.169%2C34.083%2C21.535%2C2.601%2C22.188%2C1.54z%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M22.201%2C7.239c2.237%2C3.599%2C13.094%2C21.067%2C15.561%2C25.034c-4.693-0.002-26.288-0.01-30.952-0.012%09%09C9.242%2C28.306%2C19.981%2C10.847%2C22.201%2C7.239z%22%2F%3E%09%3Cg%3E%09%09%3Crect%20x%3D%2220.452%22%20y%3D%2213.433%22%20width%3D%223.402%22%20height%3D%2211.096%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20d%3D%22M24.145%2C28.582c0%2C1.115-0.906%2C2.021-2.029%2C2.021c-1.117%2C0-2.024-0.906-2.024-2.021c0-1.117%2C0.907-2.024%2C2.024-2.024%09%09C23.239%2C26.557%2C24.145%2C27.464%2C24.145%2C28.582z%22%2F%3E%3C%2Fg%3E%3C%2Fdefs%3E%3Cuse%20href%3D%22%23outline%22%20x%3D%220%22%20y%3D%222.5px%22%20%2F%3E%3Cuse%20href%3D%22%23colored%22%20x%3D%224px%22%20y%3D%220%22%20%2F%3E%3C%2Fsvg%3E\", \"icon/height\": 40 }, \"2\": { \"icon/href\": \"data:image/svg+xml;utf8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!--%20Generator%3A%20Adobe%20Illustrator%2012.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%2051448)%20%20--%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%20%5B%09%3C!ENTITY%20ns_svg%20%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%09%3C!ENTITY%20ns_xlink%20%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%5D%3E%3Csvg%20%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22%26ns_svg%3B%22%20xmlns%3Axlink%3D%22%26ns_xlink%3B%22%20width%3D%2244.612%22%20height%3D%2236.083%22%20%20%20%20%20viewBox%3D%220%200%2048%2040%22%20overflow%3D%22visible%22%20enable-background%3D%22new%200%200%2048%2040%22%20xml%3Aspace%3D%22preserve%22%3E%20%20%20%20%20%3Cdefs%3E%20%20%20%20%20%3Cg%20id%3D%22outline%22%3E%09%09%3Cpolygon%20fill%3D%22%23000000%22%20enable-background%3D%22new%20%20%20%20%22%20points%3D%220.725%2C35.66%2043.883%2C35.677%2022.186%2C0.77%20%09%09%22%2F%3E%09%09%3Cpath%20d%3D%22M21.84%2C0.558L0%2C36.064l44.612%2C0.019L22.184%2C0L21.84%2C0.558z%20M22.188%2C1.54c0.658%2C1.058%2C20.237%2C32.557%2C20.967%2C33.732%09%09%09c-1.386-0.001-40.33-0.017-41.706-0.017C2.169%2C34.083%2C21.535%2C2.601%2C22.188%2C1.54z%22%2F%3E%09%3C%2Fg%3E%3Cg%20id%3D%22colored%22%3E%09%3Cg%3E%09%09%3Cpolygon%20fill%3D%22%23C30009%22%20enable-background%3D%22new%20%20%20%20%22%20points%3D%220.725%2C35.66%2043.883%2C35.677%2022.186%2C0.77%20%09%09%22%2F%3E%09%09%3Cpath%20d%3D%22M21.84%2C0.558L0%2C36.064l44.612%2C0.019L22.184%2C0L21.84%2C0.558z%20M22.188%2C1.54c0.658%2C1.058%2C20.237%2C32.557%2C20.967%2C33.732%09%09%09c-1.386-0.001-40.33-0.017-41.706-0.017C2.169%2C34.083%2C21.535%2C2.601%2C22.188%2C1.54z%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M22.201%2C7.239c2.237%2C3.599%2C13.094%2C21.067%2C15.561%2C25.034c-4.693-0.002-26.288-0.01-30.952-0.012%09%09C9.242%2C28.306%2C19.981%2C10.847%2C22.201%2C7.239z%22%2F%3E%09%3Cg%3E%09%09%3Crect%20x%3D%2220.452%22%20y%3D%2213.433%22%20width%3D%223.402%22%20height%3D%2211.096%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20d%3D%22M24.145%2C28.582c0%2C1.115-0.906%2C2.021-2.029%2C2.021c-1.117%2C0-2.024-0.906-2.024-2.021c0-1.117%2C0.907-2.024%2C2.024-2.024%09%09C23.239%2C26.557%2C24.145%2C27.464%2C24.145%2C28.582z%22%2F%3E%3C%2Fg%3E%3C%2Fdefs%3E%3Cuse%20href%3D%22%23outline%22%20x%3D%220%22%20y%3D%222.5px%22%20%2F%3E%3Cuse%20href%3D%22%23colored%22%20x%3D%224px%22%20y%3D%220%22%20%2F%3E%3C%2Fsvg%3E\", \"icon/height\": 40 } }, \"role\": \"risk\", \"valueType\": \"Likelihood\", \"z\": 1, \"attrs\": { \"icon\": { \"href\": \"data:image/svg+xml;utf8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!--%20Generator%3A%20Adobe%20Illustrator%2012.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%2051448)%20%20--%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%20%5B%09%3C!ENTITY%20ns_svg%20%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%09%3C!ENTITY%20ns_xlink%20%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%5D%3E%3Csvg%20%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22%26ns_svg%3B%22%20xmlns%3Axlink%3D%22%26ns_xlink%3B%22%20width%3D%2244.612%22%20height%3D%2236.083%22%09%20viewBox%3D%220%200%2044.612%2036.083%22%20overflow%3D%22visible%22%20enable-background%3D%22new%200%200%2044.612%2036.083%22%20xml%3Aspace%3D%22preserve%22%3E%3Cg%3E%09%3Cg%3E%09%09%3Cpolygon%20fill%3D%22%23C30009%22%20enable-background%3D%22new%20%20%20%20%22%20points%3D%220.725%2C35.66%2043.883%2C35.677%2022.186%2C0.77%20%09%09%22%2F%3E%09%09%3Cpath%20d%3D%22M21.84%2C0.558L0%2C36.064l44.612%2C0.019L22.184%2C0L21.84%2C0.558z%20M22.188%2C1.54c0.658%2C1.058%2C20.237%2C32.557%2C20.967%2C33.732%09%09%09c-1.386-0.001-40.33-0.017-41.706-0.017C2.169%2C34.083%2C21.535%2C2.601%2C22.188%2C1.54z%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M22.201%2C7.239c2.237%2C3.599%2C13.094%2C21.067%2C15.561%2C25.034c-4.693-0.002-26.288-0.01-30.952-0.012%09%09C9.242%2C28.306%2C19.981%2C10.847%2C22.201%2C7.239z%22%2F%3E%09%3Cg%3E%09%09%3Crect%20x%3D%2220.452%22%20y%3D%2213.433%22%20width%3D%223.402%22%20height%3D%2211.096%22%2F%3E%09%3C%2Fg%3E%09%3Cpath%20d%3D%22M24.145%2C28.582c0%2C1.115-0.906%2C2.021-2.029%2C2.021c-1.117%2C0-2.024-0.906-2.024-2.021c0-1.117%2C0.907-2.024%2C2.024-2.024%09%09C23.239%2C26.557%2C24.145%2C27.464%2C24.145%2C28.582z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\", \"height\": 40 }, \"text\": { \"text\": \"Risk\" }, \"value\": { \"text\": \"\" } } } ] }";

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.editorRef = React.createRef();

        this.onFileSelect = this.onFileSelect.bind(this); 
        this.onContextDescriptionInputValueChange = this.onContextDescriptionInputValueChange.bind(this);
        this.onGenerateSummaryButtonClick = this.onGenerateSummaryButtonClick.bind(this);
        this.onSummaryAccurateYesButtonClick = this.onSummaryAccurateYesButtonClick.bind(this);
        this.onSummaryAccurateNoButtonClick = this.onSummaryAccurateNoButtonClick.bind(this);

        this.state = {
            files: [],
            contextDescription: "",
            summary: "",
            analysis: "",
            inputsDisabled: false,
            displaySummary: false,
            displayEditSummaryInstruction: false,
            displayAnalysis: false
        };
    }

    onFileSelect(file) {
        this.setState((previousState) => ({ 
            files: [...previousState.files, file.name]
        }));
        console.log("File: ", file.name);
    }

    onContextDescriptionInputValueChange(event) {
        this.setState({contextDescription: event.target.value});
    }

    onGenerateSummaryButtonClick() {
        console.log("Generating summary...");
        this.setState({inputsDisabled: true});

        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/generate_summary", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                'context-description': this.state.contextDescription
            })
        }).then((response) => {
            if (response.ok) {
                response.json().then((response_json) => {
                    this.setState({
                        summary: response_json['summary'], 
                        inputsDisabled: false,
                        displaySummary: true
                    });                
                });
            } else {
                throw Error("Something went wrong");
            }
        }).catch((error) => {
            console.log(error);
            this.setState({inputsDisabled: false});
        });
    }

    onSummaryAccurateYesButtonClick() {
        console.log("Performing Risk Assessment...");
        this.setState({
            displayEditSummaryInstruction: false
        });

        fetch("http://" + CORAS_NAVIGATOR_IP + ":" + CORAS_NAVIGATOR_PORT + "/coras_navigator_api/perform_analysis", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({})
        }).then((response) => {
            if (response.ok) {
                response.json().then((response_json) => {
                    this.editorRef.current.changeGraph('threat');
                    this.setState({
                        analysis: response_json['analysis'], 
                        inputsDisabled: false,
                        displayAnalysis: true
                    });
                    console.log("Received JSON:", response_json['coras']); 
                    // this.editorRef.current.loadGraphFromJSON(JSON.parse(response_json['coras']));
                    this.editorRef.current.loadGraphFromJSON(JSON.parse(TEST_CORAS_DIAGRAM));
                });
            } else {
                throw Error("Something went wrong");
            }
        }).catch((error) => {
            console.log(error);
            this.setState({inputsDisabled: false});
        });
    }

    onSummaryAccurateNoButtonClick() {
        this.setState({displayAnalysis: false, displayEditSummaryInstruction: true});
    }

    loadedFileElementToRender(filename, key) {
        return (<div className="file-square" key={key}>
                    <button className="remove-file">×</button>
                    <p className="file-name">{filename}</p>
                </div>);
    }

    loadedFilesElementsToRender() {
        let fileElements = [];
        for (let index in this.state.files) {
            let filename = this.state.files[index];
            fileElements.push(this.loadedFileElementToRender(filename, index));
        }
        return (<div className='files-list'>{fileElements}</div>);
    }

    render() {
        return (<div id="coras-navigator">
            <div className="one-line">
                <p>Please provide a context description of your system:</p>
                <FileUpload onFileSelect={this.onFileSelect}/>
            </div>
            {this.loadedFilesElementsToRender()}
            <textarea placeholder="We are developing..." onChange={this.onContextDescriptionInputValueChange}></textarea>
            <div className="action-buttons">
                <button onClick={this.onGenerateSummaryButtonClick} disabled={this.state.inputsDisabled}>
                    Generate summary
                </button>
            </div>
            {this.state.displaySummary ? <>
                <p>Here is a summay of the context description you provided: </p>
                <p className="generated-text">{this.state.summary}</p>
                <p>Does this summary accurately reflect your system?</p>
                <div className="action-buttons">
                    <button onClick={this.onSummaryAccurateYesButtonClick}>Yes, proceed to the risk analysis</button>
                    <button onClick={this.onSummaryAccurateNoButtonClick}>No</button>
                </div>
            </> : null}
            {this.state.displayEditSummaryInstruction ? <>
                <p>Please edit the context description of your system.</p>
            </> : null}
            {this.state.displayAnalysis ? <>
                <p>Risk assessment:</p> 
                <pre className="generated-text">{this.state.analysis}</pre>
            </> : null}
            <div className={this.state.displayAnalysis ? "coras-model-container" : "coras-model-container hidden"}>
                <Editor ref={this.editorRef}/>
            </div>
        </div>);
    }
}

export default Navigator;

