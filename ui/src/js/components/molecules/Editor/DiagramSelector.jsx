import React from 'react';
import joint from 'jointjs';
import { connect } from 'react-redux';
import {
    ElementDoubleClicked,
    SetGraph,
    SetCurrGraph,
    ToggleInfoBox
} from '../../../store/Actions';
import "../../../../../node_modules/jointjs/dist/joint.css";
import './editor.css';
import './diagramselector.css';
import AddCorasShapes from './CORASShapes.js';

AddCorasShapes(joint);


const DiagramSelector = ({ currGraph, changeGraph, selectedTab, diagramOptions, toggleInfoBox }) => {

    const switchDiagram = diagramLabel => {
        //check if diagram exists
        // save current diagram
        if (diagramLabel === currGraph.label) {
            return;
        }

        changeGraph(diagramLabel);
    };

    //Present the diagram type in a more human manner.
    // currently introduces some glitches?
    const parseDName = (currElem) => {
        var dName = currElem.charAt(0).toUpperCase() + currElem.slice(1);
        dName = dName.replace('_', ' '); 
        return dName;
    }

    const displayInfo = (e, currElem) => {
        e.preventDefault();
        toggleInfoBox({
            x: e.clientX,
            y: e.clientY
        }, true, "diagrams", currElem);
    }

    return (
        <div className="diagram-tabrow">
            {diagramOptions.map((currElem, i) =>
                <a
                    onClick={() => switchDiagram(currElem)}
                    key={i}
                    onContextMenu={(e) => displayInfo(e, currElem)}
                    className="diagram-tabrow__tablink">
                    <div
                        className={`diagram-tabrow__tab${currElem === selectedTab ? " diagram-tabrow__tab--selected" : ""}`}>{parseDName(currElem)}
                    </div>
                </a>
            )}
        </div>
    );
};

export default connect((state) => ({
    graphs: state.editor.graphs,
    currGraph: state.editor.currGraph,
    selectedTab: state.editor.currGraph.label,
    diagramOptions: state.editor.diagramTypes,
}), (dispatch) => ({
    elementDoubleClicked: (element, event) => dispatch(ElementDoubleClicked(element, event)),
    clearGraph: (label) => dispatch(ClearGraph(label)),
    setGraph: (label, graph, scale, position) => dispatch(SetGraph(label, graph, scale, position)),
    setCurrGraph: (label, graph) => dispatch(SetCurrGraph(label, graph)),
    toggleInfoBox: (pos, bool, category, id) => dispatch(ToggleInfoBox(pos, bool, category, id))
}))(DiagramSelector);
