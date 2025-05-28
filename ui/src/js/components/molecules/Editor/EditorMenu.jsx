import { flip } from 'lodash';
import React, {useState} from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
//import { connect } from 'react-redux';
import Modal from '../../atoms/Modal/Modal';

const EditorMenu = ({ loadStartFn, loadRef, loadFn, saveFn, clearFn, showClearModal, clearClicked, clearPosition, downloadFn, currDiagram, setModalPosition }) => {
    
    const [fileModalBool, setFileModalBool] = useState(false);
    const [svgModalBool, setSvgModalBool] = useState(false);
    const [fileName, setFileName] = useState('My diagram');
    const [svgName, setSvgName] = useState('My diagram svg');

    const onFileNameChange = (e) => {
        setFileName(e.target.value);
    }

    const onSvgNameChange = (e) => {
        setSvgName(e.target.value);
    }

    const saveFile = (e) => {
        e.preventDefault();
        saveFn(fileName);
        //flipFileBool();
        setFileModalBool(false);
    }

    const saveSVG = (e) => {
        e.preventDefault();
        downloadFn(svgName);
        //flipSvgModalBool();
        setSvgModalBool(false); //force
    }

    const flipFileBool = (e) => {
        setPosition(e);
        setFileModalBool(!fileModalBool);
    }

    const flipSvgModalBool = (e) => {
        setPosition(e);
        setSvgModalBool(!svgModalBool);
    }

    const setPosition = (e) => {
        setModalPosition({top: `${e.pageY}px`, left: `${e.pageX}px`});
    }

    return(
        <div className="editor-menu">
            <button className="editor-menu__button" onClick={loadStartFn}>Load</button>
            <input type="file" name="loadFile" label="Load" className="editor-menu__hidden" onChange={loadFn} ref={loadRef} />
            <button className="editor-menu__button" onClick={flipFileBool}>Save</button>
            <Modal isOpen={fileModalBool} noBackground={true} position={clearPosition}>
                <div className="editor-clear-modal">
                    <div className="editor-clear-modal__description">Download the {currDiagram} diagram?</div>
                    <input id="fileName-input" className="element-menu-input" type="string" value={fileName} onChange={onFileNameChange} />
                    <button className="editor-clear-modal__button editor-clear-modal__button--danger" onClick={saveFile}>Save</button>
                    <button className="editor-clear-modal__button editor-clear-modal__button" onClick={flipFileBool}>No, cancel</button>
                </div>
            </Modal>
            <button className="editor-menu__button" onClick={clearClicked}>Clear</button>
            <Modal isOpen={showClearModal} noBackground={true} position={clearPosition}>
                <div className="editor-clear-modal">
                    <div className="editor-clear-modal__description">Are you sure you want to clear the {currDiagram} diagram?</div>
                    <button className="editor-clear-modal__button editor-clear-modal__button--danger" onClick={clearFn}>Yes, clear</button>
                    <button className="editor-clear-modal__button editor-clear-modal__button" onClick={clearClicked}>No, cancel</button>
                </div>
            </Modal>
            <button className="editor-menu__button" onClick={flipSvgModalBool}>Download (SVG)</button>
            <Modal isOpen={svgModalBool} noBackground={true} position={clearPosition}>
                <div className="editor-clear-modal">
                    <div className="editor-clear-modal__description">Download the {currDiagram} diagram?</div>
                    <input id="fileName-input" className="element-menu-input" type="string" value={svgName} onChange={onSvgNameChange} />
                    <button className="editor-clear-modal__button editor-clear-modal__button--danger" onClick={saveSVG}>Save</button>
                    <button className="editor-clear-modal__button editor-clear-modal__button" onClick={flipSvgModalBool}>No, cancel</button>
                </div>
            </Modal>
        </div>
    );
}

export default EditorMenu;
/*export default connect((state) => ({
    showClearModal: state.editor.editorMenu.showClearModal,
}), (dispatch) => ({
    clearClicked: (e) => dispatch(MenuClearClicked(e)),
}))(EditorMenu); */