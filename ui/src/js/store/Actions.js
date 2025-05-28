import ActionTypes from './ActionTypes';

export const ElementRightClicked = (element, graph) => ({
    type: ActionTypes.EDITOR.ELEMENT_RIGHT_CLICKED,
    payload: { element, graph }
});

export const ElementDoubleClicked = (element, event) => ({
    type: ActionTypes.EDITOR.ELEMENT_DOUBLE_CLICKED,
    payload: {
        element,
        event
    }
});

export const ElementEditorCancel = () => ({
    type: ActionTypes.EDITOR.ELEMENT_CANCEL
});

export const ElementEditorSave = () => ({
    type: ActionTypes.EDITOR.ELEMENT_SAVE
});

export const ElementEditorDelete = () => ({
    type: ActionTypes.EDITOR.ELEMENT_DELETE
});

export const ElementLabelEdit = (label) => ({
    type: ActionTypes.EDITOR.ELEMENT_LABEL_EDIT,
    payload: { label }
});

export const ElementValueEdit = (value) => ({
    type: ActionTypes.EDITOR.ELEMENT_VALUE_EDIT,
    payload: { value }
});

export const ElementChangeX = (x) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_X,
    payload: { x }
});

export const ElementChangeY = (y) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_Y,
    payload: { y }
});

//consider a single action for both width and height
export const ElementChangeWidth = (width) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_WIDTH,
    payload: { width }
});

export const ElementChangeHeight = (height) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_HEIGHT,
    payload: { height }
});
//TODO delete
export const ElementChangeSize = (height, width) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_SIZE,
    payload: { height, width }
});

export const ElementChangeFontSize = (fontsize) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_FONTSIZE,
    payload: { fontsize }
});

export const ElementChangePerspective = (perspective) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_PERSPECTIVE,
    payload: { perspective }
});

export const ToolElementClicked = (element, width, height) => ({
    type: ActionTypes.EDITOR.TOOL_ELEMENT_CLICKED,
    payload: { element, width, height }
});

export const ToolElementRelease = (graph, pageX, pageY) => ({
    type: ActionTypes.EDITOR.TOOL_ELEMENT_RELEASED,
    payload: { graph, pageX, pageY }
});

export const ToolTabSelected = (tabNo) => ({
    type: ActionTypes.EDITOR.TOOL_TAB_SELECTED,
    payload: { tabNo }
});

export const MenuClearClicked = (e) => ({
    type: ActionTypes.EDITOR.MENU_CLEAR_CLICKED,
    payload: { event: e}
});

export const MenuClearConfirmed = () => ({
    type: ActionTypes.EDITOR.MENU_CLEAR_CONFIRMED
});

export const CellClicked = (x, y, width, height) => ({
    type: ActionTypes.EDITOR.CELL_CLICKED,
    payload: { x, y, width, height }
});

export const CellHandleClicked = (handle) => ({
    type: ActionTypes.EDITOR.CELL_HANDLE_CLICKED,
    payload: { handle }
});

export const CellHandleRelased = () => ({
    type: ActionTypes.EDITOR.CELL_HANDLE_RELEASED
});

export const CellHandleMoved = (width, height) => ({
    type: ActionTypes.EDITOR.CELL_HANDLE_MOVED,
    payload: { width, height }
});

export const ClearGraph = (label) => ({
    type: ActionTypes.EDITOR.CLEAR_GRAPH,
    payload: { label }
});

export const SetGraph = (label, graph, scale, position) => ({
    type: ActionTypes.EDITOR.SET_GRAPH,
    payload: { label, graph, scale, position }
});

export const SetCurrGraph = (label, graph) => ({
    type: ActionTypes.EDITOR.SET_CURR_GRAPH,
    payload: { label, graph }
});

export const SetPaper = (paper) => ({
    type: ActionTypes.EDITOR.SET_PAPER,
    payload: { paper }
});

export const SetCurrShapes = (shapes) => ({
    type: ActionTypes.EDITOR.SET_CURR_SHAPES,
    payload: { shapes }
});

export const SetCellResizing = (boolean) => ({
    type: ActionTypes.EDITOR.SET_CELL_RESIZING,
    payload: { boolean }
});

export const SetElementPosition = (pos) => ({
    type: ActionTypes.EDITOR.SET_ELEMENT_POSITION,
    payload: { pos }
});

export const SetMovingLinks = (arr) => ({
    type: ActionTypes.EDITOR.SET_MOVING_LINKS,
    payload: { arr }
});

export const ToggleInfoBox = (pos, bool, category, id) => ({
    type: ActionTypes.EDITOR.TOGGLE_INFO_BOX,
    payload: { pos, bool, category, id }
});

export const SetEditorPosition = (pos) => ({
    type: ActionTypes.EDITOR.SET_EDITOR_POSITION,
    payload: { pos }
});

export const SetModalPosition = (pos) => ({
    type: ActionTypes.EDITOR.SET_MODAL_POSITION,
    payload: { pos }
});

export const ToggleIndicators = () => ({
    type: ActionTypes.EDITOR.TOGGLE_INDICATORS
});

export const ElementChangeIndicatorType = (indicatorType) => ({
    type: ActionTypes.EDITOR.ELEMENT_CHANGE_INDICATOR_TYPE,
    payload: { indicatorType }
});
