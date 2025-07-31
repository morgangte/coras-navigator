import React from 'react';
import joint from 'jointjs';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    ElementRightClicked,
    ElementDoubleClicked,
    ElementEditorCancel,
    ElementEditorSave,
    ElementEditorDelete,
    ElementLabelEdit,
    ElementValueEdit,
    ElementChangeX,
    ElementChangeY,
    ElementChangeHeight,
    ElementChangeWidth,
    ElementChangeSize,
    ElementChangePerspective,
    ElementChangeIndicatorType,
    ToolElementRelease,
    MenuClearClicked,
    MenuClearConfirmed,
    CellClicked,
    CellHandleClicked,
    CellHandleRelased,
    CellHandleMoved,
    SetGraph,
    SetCurrGraph,
    SetCellResizing,
    SetElementPosition,
    SetMovingLinks,
    ToggleInfoBox, SetEditorPosition, SetModalPosition, ChangeInnerSize
} from '../../../store/Actions';

import ElementEditor from './ElementEditor';
import EditorTool from './EditorTool';
import DiagramSelector from './DiagramSelector';
import EditorMenu from './EditorMenu';
//import CellTool from './CellTool';

import "../../../../../node_modules/jointjs/dist/joint.css";
import './editor.css';

import AddCorasShapes from './CORASShapes.js';
import ToolDefinitions from './ToolDefinitions';
import InfoBox from '../../atoms/InfoBox/InfoBox';

import { createGraphFromDAG } from './DAG.js';

AddCorasShapes(joint);

class EditorView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div></div>);
    }
}

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.graph = new joint.dia.Graph();

        this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
        this.getFromLocalStorage = this.getFromLocalStorage.bind(this);

        this.handleScroll = this.handleScroll.bind(this);
        this.handleScrollBlank = this.handleScrollBlank.bind(this);
        this.beginMovePaper = this.beginMovePaper.bind(this);
        this.movePaper = this.movePaper.bind(this);
        this.endMovePaper = this.endMovePaper.bind(this);
        this.updatePaperSize = this.updatePaperSize.bind(this);
        this.removeLink = this.removeLink.bind(this);
        this.cellToolHandleMoved = this.cellToolHandleMoved.bind(this);
        this.unembedElement = this.unembedElement.bind(this);
        this.embedElement = this.embedElement.bind(this);
        this.resizeElement = this.resizeElement.bind(this);

        this.paperOnMouseUp = this.paperOnMouseUp.bind(this);

        this.saveGraphToFile = this.saveGraphToFile.bind(this);
        this.loadGraphFromFile = this.loadGraphFromFile.bind(this);
        this.loadGraphFromJSON = this.loadGraphFromJSON.bind(this);
        this.clearGraph = this.clearGraph.bind(this);
        this.getSvg = this.getSvg.bind(this);
        this.downloadSvg = this.downloadSvg.bind(this);
        this.changeGraph = this.changeGraph.bind(this);
        this.attachTools = this.attachTools.bind(this);
        this.initGraph =  this.initGraph.bind(this);
        this.visualizeRelation = this.visualizeRelation.bind(this);

        this.paperId = this.props.paperId || 'paper-holder';
        this.paperWrapperId = `${this.paperId}-wrapper`;

        this.loadRef = React.createRef();
        this.paperRef = React.createRef();

        this.testEvent = this.testEvent.bind(this);
        this.beginElementResize = this.beginElementResize.bind(this);
        this.onHover = this.onHover.bind(this);
        this.exitHover = this.exitHover.bind(this);
        this.toggleInfo = this.toggleInfo.bind(this);
    }

    saveToLocalStorage() {
        // might want to update redux state here, or update store more frequently
        console.log(this.props.currGraph.label)
        window.localStorage.setItem(this.paperId + "graph_" + this.props.currGraph.label, JSON.stringify(this.graph.toJSON()));
        //console.log(this.props.currGraph.label);
        window.localStorage.setItem('currTab', this.props.currGraph.label);
    }

    getFromLocalStorage() {
        //console.log(this.props.currGraph.label);
        var currTab = 'asset'; //default choice
        //check if current tab is kept track of, if not set to the default; asset.
        if (window.localStorage.getItem('currTab') !== null) {
            currTab = window.localStorage.getItem('currTab');
        }
        var storedGraph = null;
        this.props.diagramTypes.map((type, i) => {
            storedGraph = window.localStorage.getItem(this.paperId + "graph_" + type);
            if (storedGraph) {
                //console.log(`Editor scale `, this.paper.scale())
                this.props.setGraph(type, JSON.parse(storedGraph), this.paper.scale(), this.paper.translate());
            } else {
                //var placeHolder = new joint.dia.Graph();
                //this.props.setGraph(type, placeHolder, this.paper.scale(), this.paper.translate());
            }
        });
        //window.localStorage.removeItem(this.paperId + "graph_" + currTab); // use if graph contains critical bug.
        this.props.setCurrGraph(currTab, this.graph.toJSON()); //TODO
        return window.localStorage.getItem(this.paperId + "graph_" + currTab);
    }

    toggleInfo() {
        //console.log('????'); //check for editor underneath cursor here. set flag if true.
        if (this.props.infoBox.visible) {
            this.props.toggleInfoBox({x:0,y:0}, false, "", "");
        }
    }

    componentDidMount() {
        const arrowheadShape = 'M 10 0 L 0 5 L 10 10 z';

        var graph = new joint.dia.Graph();

        //this allows the addition of vertices on link dbl click.
        var customLinkView = joint.dia.LinkView.extend({
            pointerdown: function(evt, x, y) {
                if (evt.which === 3 || evt.button === 2) {
                    evt.preventDefault();
                    return;
                }
                this.addVertex(x,y);
            }
        });

        //console.log(`Linkview: `, customLinkView)
        //console.log(`joint.dia.linkview `, joint.dia.LinkView), 
        //customLinkView.addTools(customToolsView)


        this.paper = new joint.dia.Paper({
            el: document.getElementById(this.paperId),
            model: this.graph, // change
            width: document.getElementById(this.paperWrapperId).offsetWidth - 10,
            height: document.getElementById(this.paperWrapperId).offsetHeight - 10,
            gridSize: 1,
            background: {
                color: 'rgba(255, 255, 255, 1)',
            },
            interactive: this.props.interactive === undefined ? true : this.props.interactive,
            //defaultLink: new joint.shapes.devs.Link({
            defaultLink: new joint.shapes.coras.defaultLink({
                attrs: {
                    '.marker-target': {
                        d: arrowheadShape
                    }
                }
            }),
            linkView: customLinkView,
            interactive: {vertexAdd: false},
        });

        // Load graph from localStorage if it exists,  upgrade efficiency
        if (this.getFromLocalStorage()) {
            this.graph.fromJSON(JSON.parse(this.getFromLocalStorage()));
            this.initGraph();
        }
        // Save in localStorage on change (or rather, every second currently)
        this.periodicalSave = setInterval(this.saveToLocalStorage, 1000);

        window.addEventListener('resize', this.updatePaperSize);
        window.addEventListener("mousedown", this.toggleInfo);
        window.addEventListener("pointermove", this.moveItem);

        if (this.props.interactive === undefined ? true : this.props.interactive) {
            this.paper.on('cell:contextmenu', (elementView, e, x, y) => this.props.elementDoubleClicked(elementView.model, e));
            //this.paper.on('cell:pointerdblclick', (elementView, e, x, y) => this.props.elementDoubleClicked(elementView.model, e));
            this.paper.on('element:pointerdblclick', (elementView, e, x, y) => this.props.elementDoubleClicked(elementView.model, e));
            this.paper.on('cell:pointerup', this.embedElement);
            this.paper.on('cell:pointerdown', this.unembedElement);
            this.paper.on('element:pointermove', this.resizeElement);
            this.paper.on('element:mouseenter', this.onHover);
            this.paper.on('element:mouseleave', this.exitHover);

            this.paper.on('link:mouseenter', function(linkView) {
                //console.log(`Showtools `,linkView.showTools())
                linkView.showTools();
            });
        
            this.paper.on('link:mouseleave', function(linkView) {
                linkView.hideTools();
            });

            this.paper.on('cell:mousewheel', this.handleScroll);
            this.paper.on('blank:mousewheel', this.handleScrollBlank);

            this.paper.on('blank:pointerdown', this.beginMovePaper);
            this.paper.on('blank:pointermove', this.movePaper);
            this.paper.on('blank:pointerup', this.endMovePaper);
            this.paper.on('element:sizeSelector:pointerdown', this.beginElementResize);
        }
    }
    //TODO, understand this better.
    //This function attaches the toolView containing linkTools to the link provided.
    attachTools(link) {
        //Create tools for link
        var linkView = link.findView(this.paper);
       // console.log(`AttachTools Linkview `, linkView);

        //combine tools in a view
        var verticesTool = new joint.linkTools.Vertices({
            vertexAdding:false
        });
        var segmentsTool = new joint.linkTools.Segments();
        var boundaryTool = new joint.linkTools.Boundary();
        var removeButton = new joint.linkTools.Remove();

        var customToolsView = new joint.dia.ToolsView({
            tools: [
                verticesTool,
                segmentsTool, 
                boundaryTool,
                removeButton
            ]
        });

        //add toolview to the linkview that is attached to link
        linkView.addTools(customToolsView);
        linkView.hideTools();
    }

    //Unsure if this is required, or just a sideeffect of my hacky implementation... probably the latter.
    //this attached the toolview to all links in the graph. Called on when graph is loaded from storage.
    initGraph() {
        this.graph.attributes.cells.models.map((model) => {
            if (model.attributes.type === 'coras.defaultLink') {
                this.attachTools(model);
            }
        })
    }

    testEvent(cellView, e, x, y) {
        //console.log("Event triggered");
        //console.log(cellView);
        //console.log(e);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updatePaperSize);
        window.removeEventListener('mousedown', this.toggleInfo);
        clearInterval(this.periodicalSave);
    }

    visualizeRelation(link, relation) {
        //console.log('visualize ', relation)
        var arrowheadShape = 'M 10 -5 L -2 0 L 10 5 z';
        var fill = 'black';
        var strokeWidth = 10;

        switch (relation) {
            case 'initiates':
                arrowheadShape = 'M 10 -5 L -2 0 L 10 5';
                fill = 'none';
                strokeWidth = 6;
                //TODO
                break;
            case 'leads_to': 
                //default settings
                break;
            case 'impacts': 
                arrowheadShape = 'M 8 -5 L -2 0 L 8 5 M -2 0 L 18 0 M 18 -5 L 8 0 L 18 5';
                fill = 'none';
                break;
            case 'treats': 
                link.attr('line/strokeDasharray', '10 5');
                arrowheadShape = "M 0 0 a 5 5 0 1 1 10 0 a 5 5 0 1 1 -10 0 ";
                fill = 'white';
                break;
            case 'indicates':
                link.attr('line/strokeDasharray', '4 2');
        }
        link.attr('line/targetMarker', { 
            d: arrowheadShape,
            stroke: 'black',
            fill: fill,
            strokeWidth: 10
        });
        return link;
    }

    handleScroll(cellView, e, x, y, delta) {
        e.preventDefault();
        const scaleFactor = 1.03;
        const currentScale = this.paper.scale();

        if (delta > 0) {
            const newX = currentScale.sx * scaleFactor > 5 ? currentScale.sx : currentScale.sx * scaleFactor;
            const newY = currentScale.sy * scaleFactor > 5 ? currentScale.sy : currentScale.sy * scaleFactor;
            this.paper.scale(newX, newY);
        } else if (delta < 0) {
            const newX = currentScale.sx / scaleFactor < 0.52 ? currentScale.sx : currentScale.sx / scaleFactor;
            const newY = currentScale.sy / scaleFactor < 0.52 ? currentScale.sy : currentScale.sy / scaleFactor;
            this.paper.scale(newX, newY);
        }
    }

    handleScrollBlank(e, x, y, delta) {
        this.handleScroll(null, e, x, y, delta);
    }

    unembedElement(cellView, evt, x, y) {
        var cell = cellView.model;
        //if link return, no need to prepare for embedding
        if (cell.attributes.type === 'coras.defaultLink') {
            return;
        }
        
        //console.log('unembedElement')

        //if link exit
        this.setState({ elementPosition: cell.attributes.position });

        if (!cell.get('embeds') || cell.get('embeds').length === 0) {
            cell.toFront();
        } else {
            // is a parent cell,  store related links
            if (!this.state.movingLinks) {
                var arr = [];
                _.each(cellView.model.getEmbeddedCells(), child => {
                    // find connected links and add them to array
                    var temp = this.graph.getConnectedLinks(child);

                    for (let i = 0; i < temp.length; i++) {
                        if (arr.findIndex(element => element.cid === temp[i].cid) === -1) {
                            arr.push(temp[i]);
                        }
                    }
                });

                this.setState({ movingLinks: arr });
            }
        }

        if (cell.get('parent')) {
            this.graph.getCell(cell.get('parent')).unembed(cell);
        }
    }

    embedElement(cellView, evt, x, y) {
        var cell = cellView.model;
        if (cell.attributes.type === 'coras.defaultLink') {
            //removes selftargeting
            if (cell.getTargetElement() === null || cell.getSourceElement().cid === cell.getTargetElement().cid) {
                cell.remove();
                return;
            }
            console.log('Check for list of relations ', cell);
            var source = cell.getSourceElement().attributes.role;
            var target;
            if (cell.getTargetElement()) {
                target = cell.getTargetElement().attributes.role;
            }
            var result = 'no_relation';
            var valType = 'NA';
            var reversed =  false;

            switch (source) {
                case "threat_source":
                    switch (target) {
                        case "threat_scenario":
                        case "unwanted_incident":
                        case "risk":
                            result = "initiates";
                            valType = "Likelihood";
                            break;
                        default:
                            cell.remove();
                    }
                    break;
                case "threat_scenario":
                    switch (target) {
                        case "threat_scenario":
                        case "unwanted_incident":
                        case "risk":
                            result = "leads_to";
                            valType = "Conditional probability";
                            break;
                        case "threat_source":
                            result = "initiates";
                            valType = "Likelihood";
                            reversed = true;
                            break;
                        default:
                            cell.remove();
                            break;
                    }
                    break;
                case "unwanted_incident":
                    switch (target) {
                        case "threat_scenario":
                        case "unwanted_incident":
                            result = "leads_to";
                            valType = "Conditional probability";
                            break;
                        case "direct_asset":
                            result = "impacts";
                            valType = "Consequence";
                            break;
                        case "threat_source":
                            result = "initiates";
                            valType = "Likelihood";
                            reversed = true;
                            break;
                        default:
                            cell.remove();
                            break;
                    }
                    break;
                case "direct_asset":
                    switch (target) {
                        case 'unwanted_incident':
                        case 'risk':    
                            result = "impacts";
                            valType = "Consequence";
                            reversed = true;
                            break;
                        case "direct_asset":
                        case "indirect_asset":
                            result = "impacts";
                            valType = "Consequence";
                            break;
                        default:
                            cell.remove();
                       
                    }
                    break;
                case "indirect_asset": 
                    switch (target) {
                        case 'risk':    
                            result = "impacts";
                            valType = "Consequence";
                            reversed = true;
                            break;
                        case "direct_asset":
                        case "indirect_asset":
                            result = "impacts";
                            valType = "Consequence";
                            break;
                        default:
                            cell.remove();
                       
                    }
                    break;
                case "treatment":
                    switch (target) {
                        case "vulnerability":
                        case "threat_source":
                        case "risk":
                        case "threat_scenario":
                        case "direct_asset":
                        case "indirect_asset":
                        case "unwanted_incident":
                            result = "treats";
                            break;
                        default:
                            cell.remove();
                       
                    }
                    break;
                case "risk":
                    switch (target) {
                        case "direct_asset":
                        case "indirect_asset":
                        case "risk":
                            result = "impacts";
                            valType = "Consequence";
                            break;
                        default:
                            cell.remove();
                    }
                    break;
                case "indicator":
                    switch(target) {
                        case "vulnerability":
                        case "threat_scenario":
                        case "unwanted_incident":
                        case "risk":
                            result = 'indicates';
                            break;
                        default:
                            cell.remove();
                    }
                    break;
                default:
                    cell.remove();
            }

            //switch target and source
            if (reversed) {
                let temp = cell.source();
                cell.source(cell.target());
                cell.target(temp);
            }

            if (result !== "no_relation") {
                this.visualizeRelation(cell, result);
                this.attachTools(cell); //attach a toolview to the cell.
                cell.attributes.relation = result;
            }
            
            //Pad label array if necessary
            if (!cell.label(0))  {
                cell.label(0, {
                    attrs: {
                        text: {
                            text: ''
                        }
                    },
                    position: {
                        offset: -10
                    }
                });
            }
            //console.log("breakpoint")
            //console.log("Valtype ", valType)
            if (valType != "NA" && !cell.label(1)) {
                cell.label(1, {
                    attrs: {
                        text: {
                            text: ''
                        }
                    },
                    position: {
                        offset: 10
                    }
                });
                cell.attributes.valueType = valType;
            } else if (!cell.label(1)) { // first attempt
                cell.label(1, {
                    attrs: {
                        text: {
                            text: ''  
                        }
                    },
                    position: {
                        offset: 10
                    }
                });
            }
            cell.attributes.relation = result;
            return;
        }

        this.setState({ movingLinks: null });

        // May need more guards, but for now just check for non falsy selectedCellView
        if (this.props.cellResizing) {
            cellView.options.interactive = true;
            this.props.setCellResizing(false);
            cellView.unhighlight();
            return;
        }

        var cellViewsBelow = this.paper.findViewsFromPoint(cell.getBBox().center());

        //console.log(cellViewsBelow);

        if (cellViewsBelow.length) {
            var cellViewBelow = _.find(cellViewsBelow, function (c) { return c.model.id !== cell.id });
            if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id && cellViewBelow.model.attributes.role == "stakeholder") {
                cellViewBelow.model.embed(cell);
            }
        }
    }

    beginElementResize(cellView, e, x, y) {
        cellView.options.interactive = false;
        this.props.setCellResizing(true);

        // store minimum values of X and Y in state
        // to avoid parent visually excluding child.
        // get pos and size of all children
        var currPos = cellView.model.attributes.position;
        var currSize = cellView.model.attributes.size;

        //var minWidth = 100 + currPos.x;
        //var minHeight = 100 + currPos.y;

        //maybe init as null or 0 or falsy instead
        var maxULX = currPos.x + currSize.width; //max Upper Left X
        var maxULY = currPos.y + currSize.height; //max Upper Left Y

        var minLRX = currPos.x; //min Lower Right X
        var minLRY = currPos.y; //min Lower Right Y

        _.each(cellView.model.getEmbeddedCells(), child => {
            //console.log(child);
            let childPosX = child.attributes.position.x;
            let childPosY = child.attributes.position.y;

            if (childPosX < maxULX) {
                maxULX = childPosX;
            }
            if (childPosY < maxULY) {
                maxULY = childPosY;
            }

            let cX = child.attributes.position.x + child.attributes.size.width;
            let cY = child.attributes.position.y + child.attributes.size.height;

            if (cX > minLRX) {
                minLRX = cX;
            }
            if (cY > minLRY) {
                minLRY = cY;
            }
        });

        let marginOfError = 20;
 
        this.setState({
            maxULX: maxULX,
            maxULY: maxULY,
            minLRX: minLRX,
            minLRY: minLRY,
            changeXPos: x < cellView.model.attributes.position.x + marginOfError,
            changeYPos: y < cellView.model.attributes.position.y + marginOfError
        });
    }

    resizeElement(cellView, e, x, y) {
        if (!this.props.cellResizing) {

            // if not parent return. 
            if (!cellView.model.get('embeds') || !cellView.model.get('embeds').length) {
                return;
            }

            // If no links or vertices return
            if (!this.state.movingLinks) {
                //console.log('test');
                return;
            }

            var currPos = cellView.model.attributes.position;

            var prevPos = this.state.elementPosition;

            this.setState({ elementPosition: currPos });
            var dx = currPos.x - prevPos.x;
            var dy = currPos.y - prevPos.y;

            var arr = this.state.movingLinks;

            for (let i = 0; i < arr.length; i++) {
                var vertices = arr[i].get('vertices');
                if (vertices && vertices.length) {
                    var newVertices = [];

                    for (let j = 0; j < vertices.length; j++) {
                        newVertices.push({ x: vertices[j].x + dx, y: vertices[j].y + dy });
                    }
                    arr[i].set('vertices', newVertices);
                }
            }
            return;
        }
        //resize cell

        var pos = cellView.model.attributes.position;
        var size = cellView.model.attributes.size;

        let newPosX = pos.x;
        let newPosY = pos.y;

        let minSize = 100; 

        let newWidth = x - pos.x;
        let newHeight = y - pos.y;

        //console.log(this.state.maxULX + "  " + pos.x);
        
        if (this.state.changeXPos) {
            // needs fix
            if (x > this.state.maxULX) {
                newPosX = this.state.maxULX;
                newWidth = size.width - (this.state.maxULX -pos.x);
            } else {
                newPosX = x;
                newWidth = size.width - (x - pos.x);
            }
        } else {
            if (x < this.state.minLRX) {
                newWidth = this.state.minLRX - pos.x;
            }   
        }
        if (this.state.changeYPos) {
            if (y > this.state.maxULY) {
                newPosY = this.state.maxULY
                newHeight = size.height + (pos.y - this.state.maxULY);
            } else {
                newPosY = y;
                newHeight = size.height + (pos.y - y);
            }
        } else {
            if (y < this.state.minLRY) {
                newHeight = this.state.minLRY - pos.y;

            } 
        }

        newWidth = (newWidth < minSize) ? minSize : newWidth;
        newHeight = (newHeight < minSize) ? minSize : newHeight;

        //console.log(newWidth + "  " + newHeight);
        //console.log('cellview.model: ', cellView.model);
        //set this as part of state?
        cellView.model.set({
            position: { x: newPosX, y: newPosY },
            size: { width: newWidth, height: newHeight }
        });
        //cellView.model.attr({
        //    cornerBox: {d: 'M 0 120 H 120 120 V 120 0'}
        //})

        // To make the highlight follow the actual border
        cellView.unhighlight();
        cellView.highlight();
    }

    beginMovePaper(e, x, y) {
        // console.log('HELLO');
        this.setState({ paperMove: { moving: true, x, y } });
    }
    
    movePaper(e, x, y) {
        if (this.state.paperMove.moving) {
            const { tx, ty } = this.paper.translate();
            this.paper.translate(tx + (x - this.state.paperMove.x), ty + (y - this.state.paperMove.y));
        }
    }

    endMovePaper(e, x, y) {
        if (this.state.paperMove.moving) {
            this.setState({ paperMove: { moving: false } })
        }
    }

    onHover(cellView, evt) {
        //console.log(cellView);
        if (cellView.model.attributes.type === 'coras.roundRectElement' || cellView.model.attributes.type === 'coras.riskElement') { //WIP    
            var cell = cellView.model;

            cellView.highlight();
            // show subelement of rect
            //cell.attr('corners/visibility', 'visible');
            //groupselector not working for some reason
            cell.attr({
                sizeSelectorUL: { visibility: 'visible' },
                sizeSelectorUR: { visibility: 'visible' },
                sizeSelectorLL: { visibility: 'visible' },
                sizeSelectorLR: { visibility: 'visible' }
            });
        } else {
            cellView.showTools();
        }
    }

    exitHover(cellView, evt) {
        //var cell = cellView.model;
        if (cellView.model.attributes.type === 'coras.roundRectElement' || cellView.model.attributes.type === 'coras.riskElement') { //WIP    
            var cell = cellView.model;

            cellView.unhighlight();
            //cell.attr('corners/visibility', 'hidden');
            cell.attr({
                sizeSelectorUL: { visibility: 'hidden' },
                sizeSelectorUR: { visibility: 'hidden' },
                sizeSelectorLL: { visibility: 'hidden' },
                sizeSelectorLR: { visibility: 'hidden' }
            });
        }
    }

    updatePaperSize() {
        this.paper.setDimensions(
            document.getElementById(this.paperWrapperId).offsetWidth - 10,
            document.getElementById(this.paperWrapperId).offsetHeight - 10);
    }

    removeLink(elementView, e, x, y) {
        if (!this.state.linkToRemove) this.setState({ linkToRemove: elementView });
        else if (this.state.linkToRemove === elementView) {
            this.setState({ linkToRemove: null });
            elementView.model.remove();
        } else this.setState({ linkToRemove: null });
    }

    paperOnMouseUp(e) {
        e.preventDefault();
        const localPoint = this.paper.pageToLocalPoint(e.pageX, e.pageY);
        this.props.elementDropped(this.paper.model, localPoint.x, localPoint.y);
        var cellView = this.paper.findViewByModel(this.props.newElement);
        //console.log(cellView);
        this.embedElement(cellView);
    }

    saveGraphToFile(fileName) {
        const a = document.createElement('a');
        const graphContent = new Blob([JSON.stringify(this.graph.toJSON(), null, 2)], { type: 'text/plain' });
        a.href = URL.createObjectURL(graphContent);
        //a.download = "CORASDiagram.json";
        a.download = fileName + ".json";
        a.click();
        a.remove();
    }

    loadGraphFromFile(e) {
        console.log("Loading CORAS model from file...");
        const filePath = e.target;
        const reader = new FileReader();
        if (filePath.files && filePath.files[0]) {
            reader.addEventListener('load', (e) => this.loadGraphFromJSON(JSON.parse(e.target.result)), { once: true });
            reader.readAsText(filePath.files[0]);
            filePath.value = "";
        }
    }

    loadGraphFromJSON(json) {
        // console.log(json);
        this.graph.fromJSON(json);
    }

    clearGraph(e) {
        this.graph.clear();
        window.localStorage.removeItem(this.paperId + "graph_" + this.props.currGraph.label);
        if (this.props.initialDiagram) this.graph.fromJSON(this.props.initialDiagram);
        this.props.clearConfirmed();
    }

    getSvg() {
        let svgElement = this.paper.svg;
        const toolElems = svgElement.getElementsByClassName("link-tools");
        const arrowElems = svgElement.getElementsByClassName("marker-arrowhead");

        const toolArray = Array.from(toolElems);
        const arrowArray = Array.from(arrowElems);

        toolArray.forEach((elem) => elem.remove());
        arrowArray.forEach((elem) => elem.remove());

        // Add other standard font
        // svgElement.style.fontFamily = "Oswald, sans-serif";

        // Get svg source.
        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);

        // Add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        const width = this.paperRef.current.offsetWidth;
        const height = this.paperRef.current.offsetHeight;

        // Fix svg size
        let search = /(<svg xmlns="\S*" xmlns:xlink="\S*" version="\S*" id="\S*" width=)\S*( height=)\S*(>)/gm;
        let replace = `$1"${width}px"$2"${height}px"$3`
        source = source.replace(search, replace);

        // Add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        return {
            source: source,
            width: width,
            height: height
        };
    }

    downloadSvg(fileName) {
        let source = this.getSvg().source;
        // Convert svg source to URI data scheme.
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        let a = document.createElement('a');
        a.href = url;
        a.download = fileName + ".svg";
        a.click();
        a.remove();
    }

    cellToolHandleMoved(e) {
        // console.log('Celltoolhandlemoved');
        const { pageX, pageY } = e;

        const newHeight = pageY - (this.props.cellTool.position.y + this.props.cellToolHeight) + this.props.cellToolHeight;

        if (this.props.cellTool.handleHeld) this.props.cellHandleMoved(this.props.cellToolWidth, newHeight);
    }

    // not sure how to do through redux
    changeGraph(label) {
        console.log("Change graph to '" + label + "'");
        var graph = new joint.dia.Graph(); //stupid hack
        if (this.props.graphs[label].graph === null) {
            this.props.setGraph(label, graph.toJSON(), this.paper.scale(), this.paper.translate());
        } else {
            graph.fromJSON(this.props.graphs[label].graph);
        }

        // assume that graph is JSONgraph
        this.props.setGraph(this.props.currGraph.label, this.graph.toJSON(), this.paper.scale(), this.paper.translate());
        this.props.setCurrGraph(label, graph.toJSON());
        // this.paper.model = graph; 
        this.graph.fromJSON(graph.toJSON());
        let {sx, sy } = this.props.graphs[label].scale;
        let {tx, ty} = this.props.graphs[label].position;
        this.paper.scale(sx, sy);
        this.paper.translate(tx, ty);
        this.initGraph();
    }
    
    changeGraphFromDAG(content) {
        const graphs = createGraphFromDAG(content);
        this.changeGraph('treatment');
        this.loadGraphFromJSON(graphs.treatment.toJSON());        
    
        const threat_model = graphs.threat.toJSON();
        this.changeGraph('threat');
        this.loadGraphFromJSON(threat_model);
        return threat_model;        
    }

    render() {
        return (
            <div className="editor-wrapper">
                <EditorMenu
                    loadStartFn={() => this.loadRef.current.click()}
                    loadFn={this.loadGraphFromFile}
                    loadRef={this.loadRef}
                    saveFn={this.saveGraphToFile}
                    clearFn={this.clearGraph}
                    showClearModal={this.props.showClearModal}
                    clearPosition={this.props.clearPosition}
                    clearClicked={this.props.clearClicked}
                    downloadFn={this.downloadSvg}
                    currDiagram={this.props.currGraph.label}
                    setModalPosition={this.props.setModalPosition}
                />
                <DiagramSelector
                    isInteractive={this.props.interactive}
                    handleScroll={this.handleScroll}
                    handleScrollBlank={this.handleScrollBlank}
                    beginMovePaper={this.beginMovePaper}
                    movePaper={this.movePaper}
                    endMovePaper={this.endMovePaper}
                    updatePaperSize={this.updatePaperSize}
                    changeGraph={this.changeGraph}
                />
                {this.props.elementEditor.visible ? <ElementEditor
                    {...this.props.elementEditor.data}
                    cancel={this.props.elementEditorCancel}
                    save={this.props.elementEditorSave}
                    delete={this.props.elementEditorDelete}
                    labelOnChange={this.props.elementEditorLabelEdit}
                    valueOnChange={this.props.elementEditorValueEdit}
                    xOnChange={this.props.elementEditorChangeX}
                    yOnChange={this.props.elementEditorChangeY}
                    heightChange={this.props.elementEditorChangeHeight}
                    widthChange={this.props.elementEditorChangeWidth}
                    sizeChange={this.props.elementEditorChangeSize}
                    showClearModalElement={this.props.showClearModalElement}//
                    clearPosition={this.props.clearPosition}//
                    clearClicked={this.props.clearClicked}//
                    elementChangeIndicatorType={this.props.elementChangeIndicatorType}
                    perspectiveOnChange={this.props.elementEditorChangePerspective} /> : null}
                {this.props.infoBox.visible  ? 
                    <InfoBox />
                : null}
                <div
                    id={this.paperWrapperId}
                    className="editor-paper"
                    onDragEnter={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={this.paperOnMouseUp}
                    style={{ width: `${this.props.width}px`, height: `${this.props.height}px` }}
                    ref={this.paperRef} >
                    <div id={this.paperId}></div>
                </div>
                {this.props.interactive || this.props.interactive === undefined ?
                    <EditorTool toolDefinitions={ToolDefinitions} paper={this.paper} /> : null}
            </div>);
    }
}

export default connect((state) => ({
    elementEditor: state.editor.elementEditor,
    showClearModal: state.editor.editorMenu.showClearModal,
    showClearModalElement: state.editor.editorMenu.showClearModalElement,
    clearPosition: state.editor.editorMenu.clearPosition,
    cellTool: state.editor.cellTool,
    cellToolWidth: state.editor.cellTool.size.width,
    cellToolHeight: state.editor.cellTool.size.height,
    graphs: state.editor.graphs,
    currGraph: state.editor.currGraph,
    diagramTypes: state.editor.diagramTypes,
    cellResizing: state.editor.cellResizing,
    elementPosition: state.editor.elementPosition,
    movingLinks: state.editor.movingLinks,
    newElement: state.editor.movement.element,
    infoBox: state.editor.infoBox

}), (dispatch) => ({
    elementRightClicked: (element, graph) => dispatch(ElementRightClicked(element, graph)),
    elementDoubleClicked: (element, event) => dispatch(ElementDoubleClicked(element, event)),
    elementEditorCancel: () => dispatch(ElementEditorCancel()),
    elementEditorSave: () => dispatch(ElementEditorSave()),
    elementEditorDelete: () => dispatch(ElementEditorDelete()),
    elementEditorLabelEdit: (label) => dispatch(ElementLabelEdit(label)),
    elementEditorValueEdit: (value) => dispatch(ElementValueEdit(value)),
    elementEditorChangeX: (x) => dispatch(ElementChangeX(x)),
    elementEditorChangeY: (y) => dispatch(ElementChangeY(y)),
    elementEditorChangeHeight: (height) => dispatch(ElementChangeHeight(height)),
    elementEditorChangeWidth: (width) => dispatch(ElementChangeWidth(width)),
    elementEditorChangeSize: (size) => dispatch(ElementChangeSize(size)),
    elementEditorChangePerspective: (perspective) => dispatch(ElementChangePerspective(perspective)),
    elementDropped: (graph, pageX, pageY) => dispatch(ToolElementRelease(graph, pageX, pageY)),
    clearClicked: (e) => dispatch(MenuClearClicked(e)),
    clearConfirmed: () => dispatch(MenuClearConfirmed()),
    cellClicked: (x, y, width, height) => dispatch(CellClicked(x, y, width, height)),
    cellHandleClicked: (handle) => dispatch(CellHandleClicked(handle)),
    cellHandleReleased: () => dispatch(CellHandleRelased()),
    cellHandleMoved: (width, height) => dispatch(CellHandleMoved(width, height)),
    clearGraph: (label) => dispatch(ClearGraph(label)),
    setGraph: (label, graph, scale, position) => dispatch(SetGraph(label, graph, scale, position)),
    setCurrGraph: (label, graph) => dispatch(SetCurrGraph(label, graph)),
    setCellResizing: (boolean) => dispatch(SetCellResizing(boolean)),
    setElementPosition: (pos) => dispatch(SetElementPosition(pos)),
    setMovingLinks: (arr) => dispatch(SetMovingLinks(arr)),
    toggleInfoBox: (pos, bool, category, id) => dispatch(ToggleInfoBox(pos, bool, category, id)),
    setEditorPosition: (pos) => dispatch(SetEditorPosition(pos)),
    setModalPosition: (pos) => dispatch(SetModalPosition(pos)),
    elementChangeIndicatorType: (indicatorType) => dispatch(ElementChangeIndicatorType(indicatorType))
}),
null,
{ forwardRef: true }
)(Editor);
