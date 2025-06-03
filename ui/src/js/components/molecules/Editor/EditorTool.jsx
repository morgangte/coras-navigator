import React, { useEffect, useState } from 'react';
import { connect, shallowEqual } from 'react-redux';
import { ToolElementClicked, ToolTabSelected, SetCurrGraph, ToggleInfoBox, currentPerspective, ToggleIndicators} from '../../../store/Actions';
import './editortool.css';

const EditorToolBar = ({ beginMoveElement, svgs, toggleInfoBox, currentPerspective, indicatorsToggled, indicatorTypes }) => {

    console.log(`EditorToolBar currentperspective `, currentPerspective)

    const [icons, setIcons] = useState(svgs);

    //removes indicator from displayed icons if not toggled on
    useEffect(() => {
        if (!indicatorsToggled) {
            setIcons(svgs.filter((icon) => {
                return icon.role !== "indicator"
            }))
        } else {
            setIcons(svgs);
        }
    }, [svgs, indicatorsToggled]);
    
    const parseName = (id) => {
        var name = id.charAt(0).toUpperCase() + id.slice(1);
        name = name.replace('_', '-'); 
        return name;
    }

    const displayInfo = (e, id) => {
        e.preventDefault();
        console.log(id)
        toggleInfoBox({
            x: e.clientX,
            y: e.clientY
        }, true, "elements", id);
    }

    return (
        <div className="editor-toolbox">
            {svgs ?
                icons.map((svg, i) =>
                    <div className="editor-toolbox__element"
                    draggable
                    onContextMenu={(e) => displayInfo(e, svg.id)}
                    onDragStart={(e) => {
                        const shape = svg.shapeFn();
                        if(svg.attrs)
                            Object.keys(svg.attrs).map((key, index) => shape.attr(key, svg.attrs[key]));

                        const styles = svg.perspectives[currentPerspective]; 
                        console.log(`STYLES `, styles)
                        Object.keys(styles).forEach((ref) => shape.attr(ref, styles[ref]));
                        shape.attr("text/text", svg.text);
                        shape.attr("value/text", "");
                        shape.set('perspective', currentPerspective); // Unsure if needed
                        shape.set('perspectives', svg.perspectives);
                        shape.set('role', svg.role);
                        shape.set('valueType', svg.valueType); //maybe store info outside svg object instead?
                        // a bit careful with these, some assumptions are made
                        // set custom fill color in ellipse and rect
                        if (svg.indicatorType) {
                            shape.set('indicatorType', svg.indicatorType);
                            shape.attr("body/fill", indicatorTypes[svg.indicatorType]);
                            shape.attr("innerBody/fill", indicatorTypes[svg.indicatorType]);
                        }
                        // set magnet attribute, only used for vulnerabilities now.
                        if (svg.magnet) { 
                            shape.attr("linkHandler/magnet", svg.magnet);
                        }

                        beginMoveElement(shape, svg.width, svg.height)
                    }}
                    key={i} >
                        <img src={svg.perspectives[currentPerspective]["icon/href"]} height={svg.iconHeight || 40} className="editor-toolbox__icon" />
                        <div>{svg.text}</div>
                    </div>) :
                null}
        </div>
    )
}

const EditorTool = ({ beginMoveElement, selectTab, currentShapes, toggleInfoBox, currentPerspective, perspectives, indicatorsToggled, toggleIndicators, indicatorTypes }) => {

    const displayInfo = (e, currElem) => {
        e.preventDefault();
        console.log(currElem)
        toggleInfoBox({
            x: e.clientX,
            y: e.clientY
        }, true, "perspectives", currElem);
    }

    const displayIndicatorInfo = (e) => {
        e.preventDefault();
        toggleInfoBox({
            x: e.clientX,
            y: e.clientY
        }, true, "elements", "indicator");
    }

    const parseName = (id) => {
        var name = id.charAt(0).toUpperCase() + id.slice(1);
        name = name.replace('_', '-'); 
        return name;
    }

    return (
        <div className="editor-tools">
            <div className="editor-tabrow">
                {perspectives.map((perspective, i) =>
                    <a onClick={() => selectTab(i)} key={i} onContextMenu={(e) => displayInfo(e, perspective)} className="editor-tabrow__tablink">
                        <div className={`editor-tabrow__tab${i === currentPerspective ? " editor-tabrow__tab--selected" : ""}`}>{parseName(perspective)}</div>
                    </a>
                )}
                <a onClick={() => toggleIndicators()} onContextMenu={(e) => displayIndicatorInfo(e)} className="editor-tabrow__tablink_toggle">
                        <div className={`editor-tabrow__tab_toggle${indicatorsToggled ? " editor-tabrow__tab_toggle--selected" : ""}`}>{`Indicators: ${indicatorsToggled ? "On" : "Off"}`}</div>
                </a>
            </div>
            <EditorToolBar 
                beginMoveElement={beginMoveElement} 
                svgs={currentShapes} 
                toggleInfoBox={toggleInfoBox} 
                currentPerspective={currentPerspective}
                indicatorsToggled={indicatorsToggled}
                indicatorTypes={indicatorTypes}
            />
        </div>
    );
};

export default connect((state) => ({
    selectedTab: state.editor.editorToolSection,
    currGraph: state.editor.currGraph,
    currentShapes: state.editor.currentShapes,
    perspectives: state.editor.perspectives,
    currentPerspective: state.editor.editorToolSection,
    indicatorsToggled: state.editor.indicatorsToggled,
    indicatorTypes: state.editor.indicatorTypes

}), (dispatch) => ({
    beginMoveElement: (element, width, height) => dispatch(ToolElementClicked(element, width, height)),
    selectTab: (tabNo) => dispatch(ToolTabSelected(tabNo)),
    toggleInfoBox: (pos, bool, category, id) => dispatch(ToggleInfoBox(pos, bool, category, id)),
    toggleIndicators: () => dispatch(ToggleIndicators())
}))(EditorTool);
