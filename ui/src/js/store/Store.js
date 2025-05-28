import { createStore, combineReducers } from 'redux';
import ActionTypes from './ActionTypes';
import joint from 'jointjs';
import _ from 'lodash';
import ToolDefinitions from '../components/molecules/Editor/ToolDefinitions';

const rootReducer = combineReducers({ editor: Editor });

function Editor(state, action) {
    if (state === undefined) return {
        editorToolSection: 0,
        link: null,
        previousElementRightClicked: null,
        elementEditor: {
            visible: false,
            data: {
                isLink: false,
                editorPosition: {
                    left: 0,
                    top: 0
                },
                element: null,
                originalLabel: "",
                originalValue: "",  //integer not a req. examples include 0.1, [minor], [rare]
                label: "",
                value: 0,
                originalPosition: {
                    x: 0,
                    y: 0
                },
                position: {
                    x: 0,
                    y: 0
                },
                originalSize: {
                    height: 0,
                    width: 0
                },
                size: {
                    height: 0,
                    width: 0
                },
                fontSize: 12,
                perspective: 0
            }
        },
        infoBox: {
            visible: false,
            category: "",
            id: "",
            position: {
                x: 0,
                y: 0
            }
        },
        movement: {
            element: null
        },
        editorMenu: {
            showClearModal: false,
            showClearModalElement: false, //misplaced
            clearPosition: {
                top: "",
                left: ""
            }
        },
        cellTool: {
            open: false,
            position: {
                x: 0,
                y: 0
            },
            size: {
                width: 0,
                height: 0
            },
            handleHeld: false,
            handle: ""
        },
        // Store references to different graphs and papers.
        currGraph: {
            label: "",
            graph: null
        },
        graphs: {
            asset: {
                graph: null,
                scale: null,
                position: null
            },
            threat: {
                graph: null,
                scale: null,
                position: null
            },
            risk: {
                graph: null,
                scale: null,
                position: null
            },
            treatment: {
                graph: null,
                scale: null,
                position: null
            },
            treatment_overview: {
                graph: null,
                scale: null,
                position: null
            }
        },
        // stores the list of icons to be displayed
        currentShapes: [],
        diagramTypes: [
            "asset",
            "threat",
            "risk",
            "treatment",
            "treatment_overview"
        ],
        perspectives: [
            "before",
            "before_after",
            "after"
        ],
        indicatorTypes: {
            businessConfiguration: "#8EA7C4",
            testResult: "#AFC499",
            networkMonitoring: "#FFFFD2",
            applicationMonitoring: "#E6A99A"

        },
        cellResizing: false,
        elementPosition: {
            x: 0,
            y: 0
        },
        movingLinks: [],
        indicatorsToggled: false
    };

    const newState = Object.assign({}, state);

    switch (action.type) {
        case ActionTypes.EDITOR.CREATE:
            console.log("EDITOR.CREATE");
            return Object.assign({}, state);

        case ActionTypes.EDITOR.DROP_NEW_MODEL:
            console.log("EDITOR.DROP_NEW_MODEL");
            return Object.assign({}, state);

        case ActionTypes.EDITOR.ADD_NEW_MODEL:
            console.log("EDITOR.ADD_NEW_MODEL");
            return Object.assign({}, state);

        //TODO    
        case ActionTypes.EDITOR.ELEMENT_RIGHT_CLICKED:
            if (!state.previousElementRightClicked) return Object.assign({}, state, { previousElementRightClicked: action.payload.element });
            else {
                console.log("LINKLINKLINK");
                const link = new joint.shapes.coras.link();
                link.set('corasType', 0);
                link.source(state.previousElementRightClicked);
                link.target(action.payload.element);
                link.addTo(action.payload.graph);
                return Object.assign({}, state, { previousElementRightClicked: null });
            }

        case ActionTypes.EDITOR.ELEMENT_DOUBLE_CLICKED:
            let {element, event} = action.payload; //TODO check on this

            return Object.assign({}, state, {
                elementEditor: {
                    visible: true,
                    //store original values.
                    originalLabel: element.isLink() ?
                        element.label(0).attrs.text.text :
                        element.attr('text/text'),
                    //TODO improve this, maybe parse to int, as well as fix element value.
                    originalValue: element.isLink() ? //TODO
                        element.label(1).attrs.text.text :
                        element.attr('value/text'), //TODO
                    originalPosition: element.isLink() ? { x: null, y: null } : element.position(),
                    originalSize: element.isLink() ? { height: null, width: null } : element.size(),
                    data: {
                        isLink: element.isLink(),
                        editorPosition: {
                            x: event.offsetX,
                            y: event.offsetY
                        },
                        element: element,
                        label: element.isLink() ?
                            element.label(0).attrs.text.text :
                            _.get(element, "0.attrs.text.text", ""),
                        value: element.isLink() ?
                            element.label(1).attrs.text.text :
                            _.get(element, "0.attrs.value.text", ""),
                        position: element.isLink() ? { x: null, y: null } : element.position(),
                        type: parseInt(element.get('corasType'))
                    }
                }
            });
        //TODO fix, add link functionality
        case ActionTypes.EDITOR.ELEMENT_CANCEL:
            // console.log('cancel duds');
            // make it pretty? iterate? perhaps have an stored copy of label in store?
            if(newState.elementEditor.data.element.isLink()) {
                newState.elementEditor.data.element.label(0, {
                    attrs: {
                        text: {
                            text: state.elementEditor.originalLabel
                        }
                    }
                });
                newState.elementEditor.data.element.label(1, {
                    attrs: {
                        text: {
                            text: state.elementEditor.originalValue
                        }
                    }
                });
            } else {
                // console.log("Orgval");
                console.log(state.elementEditor.originalValue);
                state.elementEditor.data.element.attr('text/text', state.elementEditor.originalLabel);
                state.elementEditor.data.element.attr('value/text', state.elementEditor.originalValue);
                state.elementEditor.data.element.position(state.elementEditor.originalPosition.x, state.elementEditor.originalPosition.y);
                state.elementEditor.data.element.size(state.elementEditor.originalSize.width, state.elementEditor.originalSize.height);
            }
            return Object.assign({}, state, { elementEditor: { visible: false } });

        case ActionTypes.EDITOR.ELEMENT_SAVE:
            return Object.assign({}, state, { elementEditor: { visible: false } });

        case ActionTypes.EDITOR.ELEMENT_DELETE:
            state.elementEditor.data.element.remove();
            return Object.assign({}, state, { elementEditor: { visible: false }, editorMenu: {showClearModalElement: false} });

        case ActionTypes.EDITOR.ELEMENT_LABEL_EDIT:
            //if(newState.elementEditor.data.element.isLink()) newState.elementEditor.data.element.labels([{attrs: {text: {text: action.payload.label}}}]);
            if(newState.elementEditor.data.element.isLink()) {
                newState.elementEditor.data.element.label(0, {
                    attrs: {
                        text: {
                            text: action.payload.label
                        }
                    }
                });
            } else {
                newState.elementEditor.data.element.attr('text/text', action.payload.label);
            }
            newState.elementEditor.data.label = action.payload.label;
            return newState;

        //TODO "[" + action.payload.value + "]"
        case ActionTypes.EDITOR.ELEMENT_VALUE_EDIT:
            var wrapped = action.payload.value === '' ? action.payload.value : (() => {
                let i = 0;
                while (action.payload.value[i] === '\n') {
                    i++;
                }
                console.log("YO ", action.payload.value.toString().slice(0,i), action.payload.value.toString().slice(i))
                return action.payload.value.toString().slice(0,i) +  "[" + action.payload.value.toString().slice(i) + "]";
            })();
            if(newState.elementEditor.data.element.isLink()) {
                newState.elementEditor.data.element.label(1, {
                    attrs: {
                        text: {
                            //text: action.payload.value
                            text: wrapped
                        }
                    }
                });
            } else {
                //newState.elementEditor.data.element.attr('value/text', action.payload.value);
                newState.elementEditor.data.element.attr('value/text', wrapped);
            }
            newState.elementEditor.data.value = action.payload.value;
            return newState;

        case ActionTypes.EDITOR.ELEMENT_CHANGE_X:
            newState.elementEditor.data.position.x = parseInt(action.payload.x);
            newState.elementEditor.data.element.position(parseInt(action.payload.x), state.elementEditor.data.position.y);
            return newState;

        case ActionTypes.EDITOR.ELEMENT_CHANGE_Y:
            newState.elementEditor.data.position.y = parseInt(action.payload.y);
            //TODO check this for learning purposes
            newState.elementEditor.data.element.position(state.elementEditor.data.position.x, parseInt(action.payload.y));
            return newState;
        
        //TODO, consider one action, unsure of best practice
        case ActionTypes.EDITOR.ELEMENT_CHANGE_HEIGHT:
            console.log(`STORE HEIGHT`)
            console.log(action.payload)
            newState.elementEditor.data.size = action.payload; //always int atm
            newState.elementEditor.data.element.size(action.payload)
            return newState;

         //TODO
        case ActionTypes.EDITOR.ELEMENT_CHANGE_WIDTH:
            newState.elementEditor.data.size = action.payload; //Always int atm
            newState.elementEditor.data.element.size(action.payload)
            return newState;
        
        case ActionTypes.EDITOR.ELEMENT_CHANGE_SIZE:
            newState.elementEditor.data.size = action.payload; //always int atm
            console.log(`STORE Size`)
            console.log(action.payload)
            newState.elementEditor.data.element.size(action.payload)
            return newState;

        //TODO implement
        case ActionTypes.EDITOR.ELEMENT_CHANGE_FONTSIZE:
            console.log(`Payload: `,action.payload)
            console.log(`Element: `, state.elementEditor.data.element)
            newState.elementEditor.data.fontSize = action.payload; //Always int atm
            newState.elementEditor.data.element.size(action.payload)
            return newState;

        case ActionTypes.EDITOR.ELEMENT_CHANGE_PERSPECTIVE:
            let { perspective } =  action.payload;
            if(newState.elementEditor.data.element.isLink()) {
                newState.elementEditor.data.perspective = perspective;

                if(perspective === 0)
                    newState.elementEditor.data.element.attr({ '.connection': { stroke: '#000000', 'stroke-width': 2, 'stroke-dasharray': '' }});
                else if(perspective === 1 || perspective === 2)
                    newState.elementEditor.data.element.attr({ '.connection': { stroke: '#000000', 'stroke-width': 2, 'stroke-dasharray': "5 2" } })
                newState.elementEditor.data.element.set('perspective', perspective);
            } else {
                const styles = newState.elementEditor.data.element.get('perspectives');
                Object.keys(styles[perspective]).map((item) => newState.elementEditor.data.element.attr(item, styles[perspective][item]));
                newState.elementEditor.data.perspective = perspective;
                newState.elementEditor.data.element.set('perspective', perspective);
            }
            return newState;
        
        case ActionTypes.EDITOR.ELEMENT_CHANGE_INDICATOR_TYPE:
            let { indicatorType } =  action.payload;

            console.log("INDICATOR TYPE", indicatorType);


            //const styles = newState.elementEditor.data.element.get('perspectives');
            //Object.keys(styles[perspective]).map((item) => newState.elementEditor.data.element.attr(item, styles[perspective][item]));
            //newState.elementEditor.data.perspective = perspective; //NOT NEEDED?

            newState.elementEditor.data.element.attr("body/fill", state.indicatorTypes[indicatorType]);
            newState.elementEditor.data.element.attr("innerBody/fill", state.indicatorTypes[indicatorType]);

            newState.elementEditor.data.element.set('indicatorType', indicatorType);
            return newState;
        

        case ActionTypes.EDITOR.TOOL_ELEMENT_CLICKED:
            newState.movement = action.payload;
            return newState;

        case ActionTypes.EDITOR.TOOL_ELEMENT_RELEASED:
            if (!newState.movement.element) return newState;
            const elem = newState.movement.element;
            newState.movement.element = null;
            elem.position(action.payload.pageX, action.payload.pageY);
            elem.resize(newState.movement.width, newState.movement.height);
            action.payload.graph.addCell(elem);
            return newState;
        
        case ActionTypes.EDITOR.TOOL_TAB_SELECTED:
            newState.editorToolSection = action.payload.tabNo;
            newState.currentShapes = ToolDefinitions.filter((shape) => {
                return shape.existsIn[newState.currGraph.label];
            });
            return newState;

        case ActionTypes.EDITOR.MENU_CLEAR_CLICKED:
            //Not very scalable, both prompts removed if one closed.
            if (action.payload.event.target.innerText === "Clear") {
                console.log('Open clear')
                newState.editorMenu.showClearModal = !state.editorMenu.showClearModal;
                if (state.editorMenu.showClearModalElement === true) {
                    newState.editorMenu.showClearModalElement = false
                }
                newState.editorMenu.clearPosition = { top: `${action.payload.event.pageY}px`, left: `${action.payload.event.pageX}px`}
            } else if (action.payload.event.target.innerText === "Delete") {
                console.log('Open delete')
                newState.editorMenu.showClearModalElement = !state.editorMenu.showClearModalElement;
                if (state.editorMenu.showClearModal === true) {
                    newState.editorMenu.showClearModal = false
                 }
                newState.editorMenu.clearPosition = { top: `${action.payload.event.pageY}px`, left: `${action.payload.event.pageX}px`}
            } else {
                console.log('Closing prompts')
                //Close the open prompts.
                if (state.editorMenu.showClearModal === true) {
                   newState.editorMenu.showClearModal = false
                }
                if (state.editorMenu.showClearModalElement === true) {
                    newState.editorMenu.showClearModalElement = false
                }
            }
            //newState.editorMenu.clearPosition = { top: `${action.payload.event.pageY}px`, left: `${action.payload.event.pageX}px`}
            return newState;

        case ActionTypes.EDITOR.MENU_CLEAR_CONFIRMED:
            newState.editorMenu.showClearModal = !state.editorMenu.showClearModal;
            newState.elementEditor.visible = false;
            return newState;

        case ActionTypes.EDITOR.CELL_CLICKED:
            const { x, y, width, height } = action.payload;
            newState.cellTool = {
                open: true,
                position: {
                    x,
                    y
                },
                size: {
                    width,
                    height
                }
            };
            return newState;
        
        case ActionTypes.EDITOR.CELL_HANDLE_CLICKED:
            newState.cellTool.handleHeld = true;
            newState.cellTool.handle = action.payload.handle;
            return newState;
        
        case ActionTypes.EDITOR.CELL_HANDLE_RELEASED:
            newState.cellTool.handleHeld = false;
            newState.cellTool.handle = "";
            return newState;
        
        case ActionTypes.EDITOR.CELL_HANDLE_MOVED:
            if(state.cellTool.handleHeld) newState.cellTool.size = action.payload;
            return newState;
        // Modifies graph
        case ActionTypes.EDITOR.CLEAR_GRAPH:
            //newState.graphs[action.payload] = null
            newState.graphs[action.payload] = {
                graph: null,
                scale: null
            };
            return newState;

        case ActionTypes.EDITOR.SET_GRAPH:
            console.log("EDITOR.SET_GRAPH");
            //console.log(`Set graph called! `, action.payload);
            let { label, graph, scale, position } = action.payload;
            //newState.graphs[label] = graph;
            newState.graphs[label] = {
                graph: graph,
                scale: scale,
                position: position
            };
            return newState;

        case ActionTypes.EDITOR.SET_CURR_GRAPH:
            console.log("EDITOR.SET_CURR_GRAPH");
            newState.currGraph.label = action.payload.label;
            newState.currGraph.graph = action.payload.graph;

            newState.currentShapes = ToolDefinitions.filter((shape) => {
                return shape.existsIn[newState.currGraph.label];
            });
            //newState.paper.paper.model = action.payload.graph; //hmm
            return newState;

        case ActionTypes.EDITOR.SET_PAPER:
            console.log("EDITOR.SET_PAPER");
            //newState.paper = action.payload;
            return newState;

        case ActionTypes.EDITOR.SET_CURR_SHAPES:
            newState.currentShapes = action.payload;
            return newState;

        case ActionTypes.EDITOR.SET_CELL_RESIZING:
            newState.cellResizing = action.payload.boolean;
            return newState;

        case ActionTypes.EDITOR.SET_ELEMENT_POSITION:
            newState.elementPosition = action.payload.pos;
            return newState;

        case ActionTypes.EDITOR.SET_MOVING_LINKS:
            newState.movingLinks = action.payload.arr;
            return newState;

        case ActionTypes.EDITOR.TOGGLE_INFO_BOX:
            console.log(action.payload)
            newState.infoBox = {
                visible: action.payload.bool,
                position: action.payload.pos,
                category: action.payload.category,
                id: action.payload.id
            }
            return newState;
        
        case ActionTypes.EDITOR.SET_EDITOR_POSITION:
            console.log(action.payload)
            if (newState.elementEditor.data.editorPosition) {
                newState.elementEditor.data.editorPosition = action.payload.pos;
            }
            return newState;
        
        case ActionTypes.EDITOR.SET_MODAL_POSITION:
            console.log(action.payload.pos)
            newState.editorMenu.clearPosition = action.payload.pos;
            return newState;

        case ActionTypes.EDITOR.TOGGLE_INDICATORS:
            newState.indicatorsToggled = !state.indicatorsToggled;
            return newState;
    }
}

const Store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default Store;
