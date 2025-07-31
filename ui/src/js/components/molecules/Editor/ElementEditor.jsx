import React, {useState} from 'react';

import Draggable from 'react-draggable';
import './elementeditor.css';
import Modal from '../../atoms/Modal/Modal';

const ElementEditor = (props) => {

    const [position, setPosition] = useState(props.editorPosition);

    console.log("Elementeditor props -> ", props);
    const [deletePos, setDeletePos] = useState(position);

    const [minInnerSize, setMinInnerSize] = useState({width: 90, height: 90});

    const [size, setSize] = useState(() => {
        return props.isLink ? {width:null, height:null} : props.element.attributes.size
    });

    //used for stakeholder only
    const [innerSize, setInnerSize] = useState(() => {
        //some issues with retrieveing information from store.editor.elementEditor.data
        //gets sizeinfo from the element path instead.
        if (props.element.attributes.type === 'coras.roundRectElement') {
            var innerwidth = props.element.attributes.attrs.cornerBox.d.split(" ")[4];
            var innerheight = props.element.attributes.attrs.cornerBox.d.split(" ")[2];
            return {width:innerwidth, height:innerheight};
        } else {
            return {width:null, height:null};
        }
    });

    const [label, setLabel] = useState(() => {
        return props.isLink ?
            props.element.label(0).attrs.text.text :
            props.element.attr('text/text');
    });

    const [value, setValue] = useState(() => {
        return props.isLink ?
            props.element.label(1).attrs.text.text :
            props.element.attr('value/text');
    });
    const [perspective, setPerspective] = useState(props.element.get('perspective'));
    const [indicatorType, setIndicatorType] = useState(props.element.get('indicatorType'));

    const [valType, setValType] = useState(() => {
        let val = "Value";
        if (props.isLink) {
            //console.log(this.props.element.attributes.valueType);
            return props.element.attributes.valueType;
        } else {
            //TODO
            switch(props.element.attributes.role) {
                case "unwanted_incident":
                case "threat_scenario":
                case "risk":
                    val = "Likelihood"
                    break;
                default:
                    break;
            }
        }
        return val;
    });

    const onPositionChangeX = (e) => {
        props.xOnChange(e.target.value);
        //setState({ x: e.target.value });
        setPosition({x: e.target.value, y: position.y});
    }
    
    const onPositionChangeY = (e) => {
        props.yOnChange(e.target.value);
        //setState({ y: e.target.value });
        setPosition({x: position.x, y: e.target.value})
    }

    const onLabelChange = (e) => {
        props.labelOnChange(e.target.value);
        //setState({ label: e.target.value });
        setLabel(e.target.value);
    }

    const onValueChange = (e) => {
        //test
        props.valueOnChange(e.target.value);
        //setState({ value: e.target.value });
        //Wraps the displaystring in square brackets
        setValue(e.target.value);
    }

    const onPerspectiveChange = (e) => {
        props.perspectiveOnChange(parseInt(e.target.value));
        //setState({ perspective: parseInt(e.target.value) });
        setPerspective(parseInt(e.target.value));
    }

    const onIndicatorTypeChange = (e) => {
        console.log("value ", e.target.value);
        props.elementChangeIndicatorType(e.target.value); //Expects string
        setIndicatorType(e.target.value);
    }

    //Check for minimum width
    const onWidthChange = (e) => {
        var w = parseInt(e.target.value);

        //setState({ width: w });
        setSize({width: w, height: size.height})

        if (!isNaN(w)) {
            props.widthChange(w);
            //console.log("Width")
        } else {
            props.widthChange(0); //smallest possible number, considering 0.
            //TODO change the bordercolor of the input box to red
        }
    }

    const onHeightChange = (e) => {
        var h = parseInt(e.target.value);

        //setState({ height: h });
        setSize({width: size.width, height: h});

        if (!isNaN(h)) { //this check can be extended to include a minimum size for objects.
            props.heightChange(h);
            //console.log("Height", h);
            //console.log(`State`,state)
        } else {
            props.heightChange(0);
            //TODO change the bordercolor of the input box to red
        }
    }

    const onInnerHeightChange = (e) => {
        var h = parseInt(e.target.value);
        var newH = h;
        if (isNaN(h) || h < minInnerSize.height) {
            newH = minInnerSize.height;
        } else if (h > size.height - 10) {
            newH = size.height - 10; //-10 to avoid border overlap
        }
        var w = innerSize.width;
        var path = `M 0 ${newH} h ${w} v ${-newH} `;
        props.element.attr({
            cornerBox: {d: path}
        })
        console.log("Props -> ", props);
        //props.changeInnerSize({height: newH, width: props.data.innerSize.width});
        setInnerSize({width: innerSize.width, height: h});
    }

    //consider centering stakeholder image here.
    const onInnerWidthChange = (e) => {
        var w = parseInt(e.target.value);
        var newW = w;
        if (isNaN(w) || w < minInnerSize.width) {
            newW = minInnerSize.width;
        } else if (w > size.width - 10) {
            newW = size.width - 10; //-10 to avoid border overlap
        }
        var h = innerSize.height;
        var path = `M 0 ${h} h ${newW} v ${-h} `;
        props.element.attr({
            cornerBox: {d: path}
        })
        console.log("Element -> ", props.element.attributes.attrs.cornerBox.d);
        //props.changeInnerSize({height: props.innerSize.height, width: newW});
        setInnerSize({width: w, height: innerSize.height});
    }

    //TODO
    const onFontSizeChange = (e) => {
        var fs = parseInt(e.target.value);
        //setState({fontSize: fs});
        setFontSize(fs);
        //var fs = parseInt(e.target.value);
    }
    
    const reqVal = (e) => { //may store this in state instead.
        return props.element.attributes.valueType; //null is falsy, any other valuetype should be true.
    }

    const showLabel = () => {
        //console.log("relation ", props.element.attributes.relation)
        if (props.isLink) {
            if (props.element.attributes.relation === "impacts") {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    const deleteClicked = (e) => {

        console.log("EVENT: ", e);
        console.log("X:", e.clientX," Y:", e.clientY);
        setDeletePos({x: e.clientX, y: e.clientY});
        console.log("deletePos: ", deletePos)
        props.clearClicked(e);
        console.log("Delete Clicked");
        return
    }

    return (
        <Draggable
            defaultPosition={position}
        >
            <form className="element-editor" >
            {showLabel() ? <div className="element-editor-section">
                <label htmlFor="label" className="element-editor-section__label element-editor-section__label--full">Label</label>
                <textarea
                    id="label"
                    className="element-editor-section__input element-editor-section__input--100"
                    type="text"
                    value={label}
                    onChange={onLabelChange}>
                </textarea>
            </div>: null}
            {reqVal() ? < div className="element-editor-section">
                <label htmlFor="label" className="element-editor-section__label element-editor-section__label--full">{valType}</label>
                <textarea
                    id="value"
                    className="element-editor-section__input element-editor-section__input--100"
                    type="text"
                    value={value}
                    onChange={onValueChange}>
                </textarea>
            </div>: null}
            {(!props.isLink && props.element.attributes.type !== 'coras.unboxedElement') ? <div className="element-editor-section">
                <label className="element-editor-section__label element-editor-section__label--full">Size</label>
                <div className="element-editor-section__partitioner">
                    <input id="width" className="element-editor-section__input element-editor-section__input--75" type="number" value={size.width.toString()} onChange={onWidthChange} />
                    <label htmlFor="width" className="element-editor-section__label">Width</label>
                </div>
                <div className="element-editor-section__partitioner">
                    <input id="height" className="element-editor-section__input element-editor-section__input--75" type="number" value={size.height.toString()} onChange={onHeightChange} />
                    <label htmlFor="height" className="element-editor-section__label">Heigth</label>
                </div>
            </div> : null}
            {(props.element.attributes.type === 'coras.roundRectElement') ? <div className="element-editor-section">
                <label className="element-editor-section__label element-editor-section__label--full">Inner size</label>
                <div className="element-editor-section__partitioner">
                    <input id="width" className="element-editor-section__input element-editor-section__input--75" type="number" value={innerSize.width.toString()} onChange={onInnerWidthChange} />
                    <label htmlFor="width" className="element-editor-section__label">Width</label>
                </div>
                <div className="element-editor-section__partitioner">
                    <input id="height" className="element-editor-section__input element-editor-section__input--75" type="number" value={innerSize.height.toString()} onChange={onInnerHeightChange} />
                    <label htmlFor="height" className="element-editor-section__label">Heigth</label>
                </div>
            </div> : null}
            {(!props.isLink && !props.element.attributes.role === "indicator") ? <div className="element-editor-section">
                <label className="element-editor-section__label element-editor-section__label--full">Perspective</label>
                <RadioGroup name="symboltype" values={[ "Before", "Before-after", "After" ]} currentValue={perspective} onChange={onPerspectiveChange} />
            </div> : null}
            {props.element.attributes.role === "indicator" ?

            <div className="element-editor-section">
                <label className="element-editor-section__label element-editor-section__label--full">Indicator Type</label>
                <select id = "myList" value={indicatorType} onChange={onIndicatorTypeChange} >
                    <option value="businessConfiguration"> Business Configuration </option>
                    <option value="testResult" > Test Result </option>
                    <option value="networkMonitoring"> Network-layer Monitoring </option>
                    <option value="applicationMonitoring"> Application-layer Monitoring </option>
                </select>
            </div> : null}

            <div className="element-editor-section">
                <button className="element-editor-section__button element-editor-section__button--cta" type="button" onClick={props.save}>Save</button>
                <button className="element-editor-section__button" type="button" onClick={props.cancel}>Cancel</button>
                <button className="element-editor-section__button element-editor-section__button--danger" type="button" onClick={deleteClicked}>Delete</button> 
            </div>
            <Modal isOpen={props.showClearModalElement} noBackground={true} position={deletePos}>
                    <div className="delete-warning-modal">
                        <div className="delete-warning-modal__description">Are you sure you want to delete the element?</div>
                        <button className="delete-warning-modal__button delete-warning-modal__button--danger" onClick={props.delete}>Yes, delete</button>
                        <button className="delete-warning-modal__button delete-warning-modal__button" onClick={deleteClicked}>No, cancel</button>
                    </div>
                </Modal>
        </form>
    </Draggable>
    );
}

const RadioButton = ({ name, value, checked, onChange, label }) =>
    <span>
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange} />
        <label className="element-editor-section__label">{label}</label>
    </span>;

const RadioGroup = ({ name, values, currentValue, onChange }) =>
    <span>
        {values.map((value, index) => <RadioButton
                                        name={name}
                                        value={index}
                                        key={index}
                                        checked={index === currentValue}
                                        onChange={onChange}
                                        label={value} />)}
    </span>;

export default ElementEditor;



